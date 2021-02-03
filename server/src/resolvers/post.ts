import { Updoot } from '../entities/Updoot'
import { MyContext } from 'src/types'
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import { getConnection } from 'typeorm'
import { Post } from '../entities/Post'
import { isAuth } from '../middleware/isAuth'

@InputType()
class PostInput {
  @Field()
  title: string
  @Field()
  text: string
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[]
  @Field()
  hasMore: boolean
}

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 50)
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value', () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session!
    const isUpdoot = value !== -1
    const realValue = isUpdoot ? 1 : -1

    const updoot = await Updoot.findOne({ where: { postId, userId } })
    if (updoot && updoot.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          update updoot
          set value = $1
          where "postId" = $2 and "userId" = $3
        `,
          [realValue, postId, userId]
        )

        await tm.query(
          `
            update post 
            set points = points + $1 
            where id = $2 
          `,
          [2 * realValue, postId]
        )
      })
    } else if (!updoot) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
      insert into updoot ("userId", "postId", value)
      values ($1, $2, $3);
        `,
          [userId, postId, realValue]
        )

        await tm.query(
          `
      update post 
      set points = points + $1 
      where id = $2 
        `,
          [realValue, postId]
        )
      })
    }

    return true
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit) + 1

    const replacements: any[] = [realLimit + 1]
    if (req.session!.userId) {
      replacements.push(req.session!.userId)
    }

    let cursorIndex = 3
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
      cursorIndex = replacements.length
    }

    const posts = await getConnection().query(
      `
      select p.*, 
      json_build_object(
        'id', u.id,
        'username', u.username,
        'email', u.email
      ) creator,
  ${
    req.session!.userId
      ? '(select value from updoot where "userId" = $2 and "postId" = p.id) "voteStatus"'
      : 'null as "voteStatus"'
  }
      from post p
      inner join public.user u on u.id = p."creatorId"
      ${cursor ? `where p."createdAt" < $${cursorIndex}` : ''}
      order by p."createdAt" DESC
      limit $1
    `,
      replacements
    )

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder('p')
    //   .innerJoinAndSelect('p.creator', 'u', 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', 'DESC')
    //   .take(realLimit)

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   })
    // }

    // const posts = await qb.getMany()
    console.log('posts: ', posts)
    return {
      posts: posts.slice(0, realLimit - 1),
      hasMore: posts.length === realLimit,
    }
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id, { relations: ['creator'] })
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...input, creatorId: req.session!.userId }).save()
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg('title') title: string,
    @Arg('text') text: string,
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: req.session!.userId,
      })
      .returning('*')
      .execute()
    return result.raw[0]
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('id', () => Int) id: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    const post = await Post.findOne(id)
    if (!post) {
      return false
    }
    if (post.creatorId !== req.session!.userId) {
      throw new Error('not authorized')
    }
    await Updoot.delete({ postId: id })
    await Post.delete({ id })
    return true
  }
}

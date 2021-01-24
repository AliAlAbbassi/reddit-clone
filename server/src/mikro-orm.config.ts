import { __prod__ } from './constants'
import { Post } from './entities/Post'
import { MikroORM } from '@mikro-orm/core'
import path from 'path'
import { User } from './entities/User'

export default {
  entities: [Post, User],
  dbName: 'reddit-clone-db',
  type: 'postgresql',
  debug: !__prod__,
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  user: 'alialabbassi',
  password: '04092001',
} as Parameters<typeof MikroORM.init>[0]

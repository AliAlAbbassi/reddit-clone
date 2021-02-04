import { Response, Request } from 'express'
import { Redis } from 'ioredis'
import { createUpdootLoader } from './Utils/createUpdootLoader'
import { createUserLoader } from './Utils/createUserLoader'

export type MyContext = {
  req: Request
  res: Response
  redis: Redis
  userLoader: ReturnType<typeof createUserLoader>
  updootLoader: ReturnType<typeof createUpdootLoader>
}

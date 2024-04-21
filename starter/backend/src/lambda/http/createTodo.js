import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('create-todo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing event', { event })

    const newTodo = JSON.parse(event.body)

    const todo = await createTodo(newTodo, getUserId(event))

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: todo
      })
    }
  })
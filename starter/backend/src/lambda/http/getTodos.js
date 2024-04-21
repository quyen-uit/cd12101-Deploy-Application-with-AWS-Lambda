
import { getUserId } from '../utils.mjs'
import { getAllTodo } from '../../businessLogic/todos.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('get-todo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing event', { event })

    const todos = await getAllTodo(getUserId(event))

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: todos.Items
      })
    }
  })

  
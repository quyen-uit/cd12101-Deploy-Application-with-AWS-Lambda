import { deleteTodo } from '../../businessLogic/todos.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('delete-todo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing event', { event })

    const todoId = event.pathParameters.todoId

    await deleteTodo(todoId, getUserId(event))

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Delete succesfully" }),
    }
  })


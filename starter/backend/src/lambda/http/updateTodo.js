
import { updateTodo } from '../../businessLogic/todos.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('update-todo')

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
    const updatedTodo = JSON.parse(event.body)

    await updateTodo(updatedTodo, todoId, getUserId(event))

    return {
      statusCode: 200,
      body:
        JSON.stringify({ message: "Update succesfully" }),
    }
  })
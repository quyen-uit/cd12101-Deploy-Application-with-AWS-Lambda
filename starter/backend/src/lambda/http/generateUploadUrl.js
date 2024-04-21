import { getUserId } from '../utils.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('generate-image')
const s3Client = new S3Client()
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

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

    const uploadUrl = await getUploadUrl(todoId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      })
    }
  })

async function getUploadUrl(todoId) {  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })

  return url
}

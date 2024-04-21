import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getAllTodo(userId) {
    return await todoAccess.getAllByUserId(userId)
}

export async function createTodo(todo, userId) {
    const todoId = uuid.v4()
    const curDate = new Date().toISOString().slice(0, 10)

    return await todoAccess.create({
        todoId,
        userId,
        createdAt: curDate,
        done: false,
        attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`,
        ...todo
    })
}

export async function updateTodo(todo, id, userId) {
    await todoAccess.update(todo, id, userId)
}

export async function deleteTodo(id, userId) {
    return await todoAccess.delete(id, userId)
}
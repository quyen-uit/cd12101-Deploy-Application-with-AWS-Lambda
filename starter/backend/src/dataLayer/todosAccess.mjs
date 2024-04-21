import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE,
        todosCreateAtIndex = process.env.TODOS_CREATED_AT_INDEX,
    ) {
        this.documentClient = documentClient
        this.todosTable = todosTable
        this.todosCreateAtIndex = todosCreateAtIndex
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    }

    async getAllByUserId(userId) {
        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            IndexName: this.todosCreateAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        return result
    }

    async create(todo) {
        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            IndexName: this.todosCreateAtIndex,
            Item: todo
        })

        return todo
    }

    async update(todo, id, userId) {
        await this.dynamoDbClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: id
            },
            UpdateExpression: "set #nameAttr = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeNames: {
                "#nameAttr": "name"
            },
            ExpressionAttributeValues: {
                ":name": todo.name,
                ":dueDate": todo.dueDate,
                ":done": todo.done,
            },
        })
    }

    async delete(id, userId) {
        await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: id
            },
        })
    }
}
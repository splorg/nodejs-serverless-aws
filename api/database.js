const { MongoClient, ObjectId } = require("mongodb")

let connectionInstance = null

const connectToDatabase = async () => {
  if (connectionInstance) return connectionInstance

  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING)

  const connection = await client.connect()

  connectionInstance = connection.db(process.env.MONGODB_DB_NAME)

  return connectionInstance
}

const getUserByCredentials = async (username, password) => {
  const client = await connectToDatabase()
  const collection = await client.collection('users')

  const user = await collection.findOne({
    name: username,
    password
  })

  if (!user) return null

  return user
}

const getResultByID = async (id) => {
  const client = await connectToDatabase()
  const collection = await client.collection('results')

  const result = await collection.findOne({
    _id: new ObjectId(id)
  })

  if (!result) return null

  return result
}

const saveResults = async (result) => {
  const client = await connectToDatabase()
  const collection = await client.collection('results')
  const { insertedId } = await collection.insertOne(result)

  return insertedId
}

module.exports = { 
  connectToDatabase, 
  getUserByCredentials,
  getResultByID,
  saveResults
}
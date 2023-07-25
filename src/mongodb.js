import { MongoClient } from 'mongodb'
console.log(process.env.MONGO_CONNECTION_STRING)
export default new MongoClient(process.env.MONGO_CONNECTION_STRING, { useUnifiedTopology: true })

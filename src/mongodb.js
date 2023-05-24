import { MongoClient } from 'mongodb'

export default mongodb = new MongoClient(process.env.MONGODB_URL)

import { v4 } from "uuid";
import mongodb from "./mongodb";

export default class User {

  constructor(options = {}) {

    this.id = v4();
    this.db = mongodb.collection('users')
    this.options = options
  }

  async find(query) {
    return await this.db.findOne(query)
      .catch((err) => {
        console.log(err)
        throw err
      })
  }

  async remove(query) {
    const result = await this.db.deleteOne(query)
    return { deleted: result.deletedCount === 1 }
  }

  async create () {
    if (!this.options || this.options.keys().length === 0) throw Error('Missing client options.')

    const result = await this.db.insertOne(this.options)

    return result
  }

}

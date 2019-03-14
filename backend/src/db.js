const MongoClient = require('mongodb').MongoClient

const DB_URI = `${process.env.MONGO_URI || 'mongodb://localhost:27017'}/cg_glass`

const connect = url => {
  return MongoClient.connect(url).then(client => client.db())
}

module.exports = () => connect(DB_URI)

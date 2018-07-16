'use strict';
const axios = require('axios')
const program = require('commander')
const pkg = require('./package.json')
const MongoClient = require('mongodb').MongoClient

const bps = []

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options] <command> [...]')
  .option('-u, --url <url>', 'url [https://api.cypherglass.com]', 'https://api.cypherglass.com')
  .option('-t, --timeout <timeout>', 'bp.json reading timeout [5000]', 15000)
  .option('-m, --mongoaddr <mongoaddr>', 'mongodb address [mongodb://localhost:27017]', 'mongodb://localhost:27017')
  .option('-d, --database <database>', 'mongodb database [cg_glass]', 'cg_glass')
  .option('-c, --mongocoll <mongocoll>', 'mongodb collection [bps]', 'bps')

program.parse(process.argv)

console.log('BP Watcher Init')

const initBps = async () => {
  const url = program.url + '/v1/chain/get_table_rows'
  const body = {
    scope: "eosio",
    code: "eosio",
    table: "producers",
    json: "true",
    limit: 9999
  }

  console.log(`Init BPs Reading ${url}`)

  const producersRes = await axios.post(url, body)
    .catch(err => console.error('Fail to init BPs', err))

  if (producersRes && producersRes.data) {
    updateBps(producersRes.data.rows)
  }
}

const updateBps = (bpRows) => {
  if (!bpRows || !bpRows.length) {
    console.warn('No bps to update')
    return
  }

  bpRows.forEach(bp => {
    console.log(`Adding new BP ${bp.owner}`)
    bp.total_votes = bp.total_votes ? Number(bp.total_votes) : 0
    bps.push(bp)
  })
}

const sortBps = () => {
  bps.sort((a, b) => {
    return b.total_votes - a.total_votes
  })
}

const retrieveJsonData = async () => {
  const jsonsRequests = bps.map(bp => {
    const url = bp.url +
      (bp.url.substr(-1) === '/' ? 'bp.json' : '/bp.json')
    return axios.get(url, {timeout: program.timeout})
      .then(res => ({owner: bp.owner, data: res.data}))
      .catch(e => ({owner: bp.owner, error: e}))
  })

  console.log(`Getting BP JSONs for ${jsonsRequests.length} bps`)
  const jsonsRes = await Promise.all(jsonsRequests)
    .catch(e => console.log('Fail to get BP JSONs Files', e))

  if (jsonsRes) {
    jsonsRes.forEach(json => {
      const bp = getBp(json.owner)
      if (!bp) {
        console.log(`Unknown bp response ${json.owner}`)
      } else if (json.error) {
        console.log(`${json.owner} - Failed JSON Response`)
        bp.json = null
      } else {
        bp.json = json.data
      }
    })
  }
}

const getBp = owner => {
  return bps.find(bp => bp.owner == owner)
}

const saveBps = async () => {
  console.log('Saving bps to mongodb...')

  MongoClient.connect(program.mongoaddr, function(err, client) {
    if(err) {
      console.error('Fail to connect to mongodb', err)
      return
    }

    console.log("Connected successfully to MongoDb server")

    const db = client.db(program.database)

    const collection = db.collection(program.mongocoll)
    const bulk = collection.initializeUnorderedBulkOp()

    const updatedAt = (new Date()).getTime()
    bps.forEach(bp => {
      bp.updatedAt = updatedAt
      bulk.find({owner: bp.owner}).upsert().update({$set: bp})
    })

    bulk.execute((err, result) => {
      if (err) {
        console.error('Fail to insert bps to mongo db', err)
        return
      }
      console.log(`${result.nModified} updated and ${result.nInserted} inserted into the collection`)
    })

    client.close()
  });
}

(async () => {
  await initBps()

  if (bps.length < 1) {
    console.error('Bps not found')
    return
  }

  sortBps()

  await retrieveJsonData()

  await saveBps()
})()

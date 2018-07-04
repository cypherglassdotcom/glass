require('dotenv').config()
import axios from 'axios'

const EOS_NODE_API = process.env.EOS_NODE_API
const TICK_INTERVAL = 60 * 1000

let bps = []

// BP Ticker Loop - Check Every 60 Seconds
const tickLoop = async () => {
  console.log('BpTicker Init Loop')

  await initBps()

  await retrieveJsonData()

  setTimeout(tickLoop, TICK_INTERVAL)
}

const initBps = async () => {
  const url = EOS_NODE_API + '/chain/get_table_rows'
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
    let currentBp = bps.find(item => item.owner == bp.owner)

    if (!currentBp) {
      console.log(`Adding new BP ${bp.owner}`)
      bps.push(bp)
    } else {
      console.log(`Updating and merging ${bp.owner}`)
      currentBp = {
        ...currentBp,
        ...bp
      }
    }
  })
}

const retrieveJsonData = () => {
  console.log('lazy developer need to do')
}

const getBps = () => {
  return bps
}

// initialize loop
tickLoop()

export default {
  getBps
}

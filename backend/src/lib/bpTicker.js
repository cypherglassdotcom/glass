require('dotenv').config()
import axios from 'axios'

const EOS_NODE_API = process.env.EOS_NODE_API
const TICK_INTERVAL = 60 * 1000
const BP_JSON_TIMEOUT = 5000

let bps = []

// BP Ticker Loop - Check Every 60 Seconds
const tickLoop = async () => {
  console.log('BpTicker Init Loop')

  await initBps()

  sortBps()

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
    let currentBp = getBp(bp.owner)

    const isValid = isValidBp(bp)

    if (!currentBp && isValid) {
      console.log(`Adding new BP ${bp.owner}`)
      bps.push(bp)
    } else if (currentBp && isValid) {
      console.log(`Updating and merging ${bp.owner}`)
      currentBp = {
        ...currentBp,
        ...bp
      }
    } else if (currentBp && !isValid) {
      console.log(`Removing invalid BP ${bp.owner}`)
      bps.splice(bps.indexOf(currentBp), 1)
    }
  })
}

const isValidBp = (bp) => {
  return bp.url && Number(bp.total_votes) > 0 && bp.is_active == 1
}

const sortBps = () => {
  bps.sort((a, b) => {
    return Number(b.total_votes) - Number(a.total_votes)
  })
}

const retrieveJsonData = async () => {
  const jsonsRequests = bps.map(bp => {
    const url = bp.url +
      (bp.url.substr(-1) === '/' ? 'bp.json' : '/bp.json')
    return axios.get(url, {timeout: BP_JSON_TIMEOUT})
      .then(res => ({owner: bp.owner, data: res.data}))
      .catch(e => ({owner: bp.owner, error: e}))
  })

  console.log(`Getting BP JSONs for ${jsonsRequests.length} bps`)
  const jsonsRes = await Promise.all(jsonsRequests)
    .catch(e => console.log('Fail to get BP JSONs Files', e))

  if (jsonsRes) {
    jsonsRes.forEach(json => {
      if (json.error) {
        console.log(`${json.owner} - Failed JSON Response`)
      } else {
        const bp = getBp(json.owner)
        if (bp)
          bp.json = json.data
      }
    })
  }
}

const getBps = () => {
  return bps
}

const getBp = owner => {
  return bps.find(bp => bp.owner == owner)
}

// initialize loop
tickLoop()

export default {
  getBps
}

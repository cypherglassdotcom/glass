const humanToCron = require('human-to-cron')
const cron = require('node-cron')

const interval = humanToCron('each 2 minutes')

cron.schedule(interval, () => {
  require('./index')
})
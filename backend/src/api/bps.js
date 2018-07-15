import { Router } from 'express'
import bpsData from '../data/bps'

export default ({ config, db }) => {
  let api = Router()
  const data = bpsData(db)

  api.get('/', async (req, res) => {
    const count = await data.count()
    res.json({bps: count})
  })

  api.get('/list', async (req,res) => {
    const { limit, search } = req.query
    const bps = await data.listBps(Number(limit) || 21, search)
    res.json({bps})
  })

  api.get('/:owner', async (req,res) => {
    const { owner } = req.params
    const bp = await data.getBp(owner)
    res.json(bp)
  })

  return api
}

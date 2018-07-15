export default (db) => ({

  count: async () => {
    const count = await db.collection('bps').countDocuments()
    return count
  },

  getBp: async(account) => {
    const bp = await db.collection('bps').find({owner: account}).toArray()
    return bp && bp[0]
  },

  listBps: async (limit, search) => {

    const bps = await db.collection('bps')
      .find(search ? {owner: {$regex: search, $options: 'i' }} : {})
      .project({
        _id: 0,
        owner: 1,
        is_active: 1,
        url: 1,
        total_votes: 1,
        "json.nodes": 1,
        "json.org.candidate_name": 1,
        "json.org.website": 1,
        "json.org.location": 1,
        "json.org.branding.logo_256": 1
      }).sort({total_votes: -1}).limit(limit)
      .toArray()

    return bps
  },
})

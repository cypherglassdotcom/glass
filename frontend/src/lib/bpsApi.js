import axios from 'axios'

const listBps = (limit, search) => {
  let url = `http://localhost:8080/api/bps/list?limit=${limit}`
  if (search) {
    url += `&search=${search}`
  }

  return axios.get(url).then(res => res.data.bps)
}

const countBps = () => {
  return axios.get(`http://localhost:8080/api/bps`)
    .then(res => res.data.bps)
}

const getBp = account => {
  return axios.get(`http://localhost:8080/api/bps/${account}`)
    .then(res => res.data)
}

export {
  listBps,
  countBps,
  getBp
}

import axios from 'axios'

const listBps = (limit, search) => {
  let url = `${process.env.REACT_APP_BACKEND_API}/bps/list?limit=${limit}`
  if (search) {
    url += `&search=${search}`
  }

  return axios.get(url).then(res => res.data.bps)
}

const countBps = () => {
  return axios.get(`${process.env.REACT_APP_BACKEND_API}/bps`)
    .then(res => res.data.bps)
}

const getBp = account => {
  return axios.get(`${process.env.REACT_APP_BACKEND_API}/bps/${account}`)
    .then(res => res.data)
}

export {
  listBps,
  countBps,
  getBp
}

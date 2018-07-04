let tick = 0

const tickLoop = () => {
  tick = Date.now()
  setTimeout(tickLoop, 500)
}

const getTick = () => {
  return tick;
}

export default {
  tickLoop,
  getTick
}

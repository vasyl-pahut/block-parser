let content = {}

const get = (key) => content[key]
const getAll = () => content
const set = (key, value) => (content[key] = value)
const clear = () => (content = {})

export default {
  get,
  getAll,
  set,
  clear
}

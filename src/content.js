import _ from 'lodash/fp'

let content = {}

const get = (key) => content[key]
const getAll = () => content
const set = (key, value) => (content[key] = value)
const setBind = (key, value) => (content = _.set(key, value, content))
const clear = () => (content = {})

export default {
  get,
  getAll,
  set,
  setBind,
  clear,
}

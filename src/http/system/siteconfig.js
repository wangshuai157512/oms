import * as api from '../api'
import request from '../request'

const getConfigList = data => {
  return request({
    url :api.getConfigList,
    data
  })
}
const setConfigValue = data => {
  return request({
    method:"post",
    url : api.setConfigValue,
    data
  })
}

export default {
  getConfigList,
  setConfigValue
}
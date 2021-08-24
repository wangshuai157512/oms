import * as api from '../api'
import request from '../request'

const getUserGridSet = data => {
  return request({
    url : api.getUserGridSet,
    params : data
  })
}

const setUserGrid = data => {
  return request({
    url : api.setUserGrid,
    method : 'POST',
    data
  })
}

const setFrozenColunm = data => {
  return request({
    url : api.setFrozenColunm,
    method : 'POST',
    data
  })
}

export default {
  getUserGridSet,
  setUserGrid,
  setFrozenColunm
}

import * as api from '../api'
import request from '../request'

const GetAuthCode = data => {
  return request({
    url : api.autoCode,
    data 
  })
}
const checkLogin = data => {
  return request({
    method:"post",
    url : api.checkLogin,
    data
  })
}
const editPsd = data => {
  return request({
    method:"post",
    url : api.editPsd,
    data
  })
}
const outLogin = data => {
  return request({
    method:"post",
    url : api.outLogin,
    data
  })
}

export default {
  GetAuthCode,
  checkLogin,
  editPsd,
  outLogin,
}

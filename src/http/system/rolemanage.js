import * as api from '../api'
import request from '../request'

const delRoleItem = data => {
  return request({
  	method:"post",
    url :api.delRoleItem,
    data
  })
}
// 
const getRoleList = data => {
  return request({
    url : api.getRoleList,
    params : data
  })
}
const getRolePrivileges = data => {
  return request({
    // method:"post",
    url : api.getRolePrivileges,
    params : data
  })
}
const submitForm = data => {
  return request({
    method:"post",
    url : api.submitForm,
    data
  })
}
const setRolePrivilege = data =>{
  return request({
    method:"post",
    url : api.setRolePrivilege,
    data
  })
}
export default {
  getRoleList,
  submitForm,
  delRoleItem,
  getRolePrivileges,
  setRolePrivilege
}
import * as api from '../api'
import request from '../request'

const getConfigList = data => {
  return request({
    url :api.getConfigList,
    data
  })
}
const setConfigValue1 = data => {
  return request({
    method:"post",
    url : api.setConfigValue1,
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
const getRoleSelectJsonByRoleType = data =>{
  return request({
    method:"post",
    url : api.getRoleSelectJsonByRoleType,
    data

  })
}
const getUserGridJson = data =>{
  return request({
    url : api.getUserGridJson,
    params:data

  })
}
const setUserState = data =>{
  return request({
    method:"post",
    url : api.setUserState,
    data

  })
}
const delUser = data =>{
  return request({
    method:"post",
    url : api.delUser,
    data

  })
}
const getAllExamTypePrivileges = data =>{
  return request({
    method:"post",
    url : api.getAllExamTypePrivileges,
    data
  })
}
const submitUserForm = data =>{
  return request({
    method:"post",
    url : api.submitUserForm,
    data
  })
}
const getUserRoleIds = data =>{
  return request({
    method:"post",
    url : api.getUserRoleIds,
    data

  })
}
const getFormJson = data =>{
  return request({
    method:"post",
    url : api.getFormJson,
    data

  })
}
const getUserRolePrivilegeList = data =>{
  return request({
    url : api.getUserRolePrivilegeList,
    params:data

  })
}
const getRoleSelectJson = data =>{
  return request({
    url : api.getRoleSelectJson,
    params:data

  })
}
const setUserRole = data =>{
  return request({
    method:"post",
    url : api.setUserRole,
    data

  })
}
const getUserPrivileges = data =>{
  return request({
    method:"post",
    url : api.getUserPrivileges,
    data

  })
}
const setUserExamTypePrivileges = data =>{
  return request({
    method:"post",
    url : api.setUserExamTypePrivileges,
    data

  })
}
const setUserPrivilege = data =>{
  return request({
    method:"post",
    url : api.setUserPrivilege,
    data

  })
}
const getConfigById = data =>{
  return request({
    method:"post",
    url : api.getConfigById,
    data

  })
}

const uploadPackage = (data,cb) => {
  return request({
    url : `${api.uploadPackage}`,
    method : 'POST',
    headers : {
      'Content-Type' : 'multipart/form-data'
    },
    onUploadProgress : progressEvent => {
      let persent = (progressEvent.loaded / progressEvent.total * 100 | 0)
      if (progressEvent.lengthComputable) {
        cb && cb(persent)
      }
    },
    data
  })
}
const getNumberNameSet = data =>{
  return request({
   
    url : api.getNumberNameSet,
    params:data

  })
}
export default {
  getConfigList,
  setConfigValue1,
  setConfigValue,
  getRoleList,
  submitForm,
  delRoleItem,
  getRolePrivileges,
  setRolePrivilege,
  getRoleSelectJsonByRoleType,
  getUserGridJson,
  setUserState,
  delUser,
  getAllExamTypePrivileges,
  submitUserForm,
  getUserRoleIds,
  getFormJson,
  getUserRolePrivilegeList,
  getRoleSelectJson,
  setUserRole,
  getUserPrivileges,
  setUserExamTypePrivileges,
  setUserPrivilege,
  getConfigById,
  getNumberNameSet,
  uploadPackage
}

// import { houseList } from "../api";
import * as api from '../api'
import request from '../request'

const getControlPanelData = data => {
  return request({
    url : api.getControlPanelData,
    params:data
  })
}
const getExamPlanSettingInfo = data => {
  return request({
  
    url : api.getExamPlanSettingInfo,
    params:data
  })
}
const getStatistics = data => {
  return request({
    url : api.getStatistics,
    params:data
  })
}
const getShowClient = data => {
  return request({
    url : api.getShowClient,
    method : 'POST',
    data
  })
}
const getCurrUserInfo = data => {
  return request({
    url : api.getCurrUserInfo,
    method : 'POST',
    data
  })
}
const UpdateCurrUserInfo = data => {
  return request({
    url : api.UpdateCurrUserInfo,
    method : 'POST',
    data
  })
}
const checkSingleLogin = data => {
  return request({
    url : api.checkSingleLogin,
    method : 'POST',
    data
  })
}

//生成扫描测试数据
const initTestScanData = data => {
  return request({
    url : api.initTestScanData,
    method : 'POST',
    data
  })
}

export default {
  getControlPanelData,
  getStatistics,
  getExamPlanSettingInfo,
  getShowClient,
  getCurrUserInfo,
  UpdateCurrUserInfo,
  checkSingleLogin,
  initTestScanData,
}

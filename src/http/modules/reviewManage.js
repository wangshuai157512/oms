import * as api from '../api'
import request from '../request'
const getOnlineReviewExamPlan = data => {
  return request({
  	method:"post",
    url :api.getOnlineReviewExamPlan,
    data
  })
}
const getOnlineReviewData = data => {
  return request({
    method:"post",
    url : api.getOnlineReviewData,
    data
  })
}
const getStudentPaper = data => {
  return request({
    method:"post",
    url : api.getStudentPaper,
    data
  })
}
const getCurrentUserInfo = data => {
  return request({
    url : api.getCurrentUserInfo,
    params : data
  })
}
const getConfigValue2ByKey = data => {
  return request({
    url : api.getCurrentUserInfo,
    params : data
  })
}
const getQualityExamPlan = data => {
  return request({
    method:"post",
    url : api.getQualityExamPlan,
    data
  })
}
const getQualityPaperData = data => {
  return request({
    method:"post",
    url : api.getQualityPaperData,
    data
  })
}
const getExamMarkSetPaper = data => {
  return request({
    method:"post",
    url : api.getExamMarkSetPaper,
    data
  })
}
const saveBulkQuality = data => {
  return request({
    method:"post",
    url : api.saveBulkQuality,
    data
  })
}
const cancelPaperQuality = data => {
  return request({
    method:"post",
    url : api.cancelPaperQuality,
    data
  })
}
const getFeedBack = data => {
  return request({
    method:"post",
    url : api.getFeedBack,
    data
  })
}
const saveFeedBack = data => {
  return request({
    method:"post",
    url : api.saveFeedBack,
    data
  })
}
const deleteFeedBack = data => {
  return request({
    method:"post",
    url : api.deleteFeedBack,
    data
  })
}
const getPaperQualityDetailData = data => {
  return request({
    url : api.getPaperQualityDetailData,
    params:data
  })
}
const getOnlineReviewStatisticsGrid = data => {
  return request({
    url : api.getOnlineReviewStatisticsGrid,
    params:data
  })
}
const getUserMarkSetExamPlan = data => {
  return request({
    method:"post",
    url : api.getUserMarkSetExamPlan,
  })
}
const getUserExamCourse = data => {
  return request({
    method:"post",
    url : api.getUserExamCourse,
    data
  })
}
const getUserExamBatch = data => {
  return request({
    method:"post",
    url : api.getUserExamBatch,
    data
  })
}
const getUserExamLevel = data => {
  return request({
    method:"post",
    url : api.getUserExamLevel,
    data
  })
}
const getUserExamSubject = data => {
  return request({
    method:"post",
    url : api.getUserExamSubject,
    data
  })
}
const getUserExamStation = data => {
  return request({
    method:"post",
    url : api.getUserExamStation,
    data
  })
}
const saveScore = data => {
  return request({
    method:"post",
    url : api.saveScore,
    data
  })
}
const saveReviewMark = data => {
  return request({
    method:"post",
    url : api.saveReviewMark,
    data
  })
}
const releaseJudgeState = data => {
  return request({
    method:"post",
    url : api.releaseJudgeState,
    data
  })
}
const tempSaveScore = data => {
  return request({
    method:"post",
    url : api.tempSaveScore,
    data
  })
}
const getStudentPaperInfo = data => {
  return request({
     method:"post",
    url : api.getStudentPaperInfo,
    data
  })
}
const saveQuality = data => {
  return request({
     method:"post",
    url : api.saveQuality,
    data
  })
}
const saveOperateLog = data => {
  return request({
     method:"post",
    url : api.saveOperateLog,
    data
  })
}
const getConfigValue1ByKey = data => {
  return request({
    method:"post",
    url : api.getConfigValue1ByKey,
    data
  })
}

export default{
	getOnlineReviewExamPlan,
	getOnlineReviewData,
	getCurrentUserInfo,
	getConfigValue2ByKey,
  getStudentPaper,
  getQualityExamPlan,
  getQualityPaperData,
  getExamMarkSetPaper,
  getPaperQualityDetailData,
  saveBulkQuality,
  cancelPaperQuality,
  getFeedBack,
  saveFeedBack,
  deleteFeedBack,
  getOnlineReviewStatisticsGrid,
  getUserMarkSetExamPlan,
  getUserExamCourse,
  getUserExamBatch,
  getUserExamLevel,
  getUserExamSubject,
  getUserExamStation,
  saveScore,
  saveReviewMark,
  releaseJudgeState,
  tempSaveScore,
  getStudentPaperInfo,
  saveQuality,
  saveOperateLog,
  getConfigValue1ByKey
}
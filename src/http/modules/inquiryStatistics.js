import * as api from '../api'
import request from '../request'


const getUseExamPlan = data => {
  return request({
    url : api.useExamPlan,
    method : 'POST',
    data
  })
}
const getScoreList = data => {
  return request({
    url : api.getScoreList,
    params : data
  })
}
const exportStudentScore = data => {
  return request({
    url : api.exportStudentScore,
    method : 'POST',
    data
  })
}
const exportPassingRate = data => {
  return request({
    url : api.exportPassingRate,
    method : 'POST',
    data
  })
}
const exportFeedBack = data => {
  return request({
    url : api.exportFeedBack,
    method : 'POST',
    data
  })
}
const exportScoreCallBack = data => {
  return request({
    url : api.exportScoreCallBack,
    method : 'POST',
    data
  })
}
const getLogOptType = data => {
  return request({
    url : api.getLogOptType,
    method : 'POST',
    data
  })
}
const getMarkLog = data => {
  return request({
    url : api.getMarkLog,
    params : data
  })
}
const getTeacherJson = data => {
  return request({
    url : api.getTeacherJson,
    method : 'POST',
    data
  })
}
const getReviewOperateGrid = data => {
  return request({
    url : api.getReviewOperateGrid,
    params : data
  })
}
const getSignInfo = data => {
  return request({
    url : api.getSignInfo,
    params : data
  })
}
const getSignImg = data => {
  return request({
    url : api.getSignImg,
    params : data
  })
}
const getPackageLogList = data => {
  return request({
    url : api.getPackageLogList,
    params : data
  })
}
const reviewList = data => {
  return request({
    url : api.reviewList,
    params : data
  })
}

const qualityList = data => {
  return request({
    url : api.qualityList,
    params : data
  })
}
const totalQualityData = data => {
  return request({
    method:"post",
    url : api.totalQualityData,
    data
  })
}

const reviewResult = data => {
  return request({
    method:"post",
    url : api.reviewResult,
    data
  })
}
const getGridJsonForTeacher = data => {
  return request({
    url : api.getGridJsonForTeacher,
    params : data
  })
}

const teacherJudegExcelOut = data => {
  return request({
    url : api.teacherJudegExcelOut,
    params : data
  })
}

const getExamGridJson = data => {
  return request({
    url : api.getExamGridJson,
    params : data
  })
}

const paperJudegExcelOut = data => {
  return request({
    url : api.paperJudegExcelOut,
    params : data
  })
}

const getTeacherReviewStudentGrid = data => {
  return request({
    url : api.getTeacherReviewStudentGrid,
    params : data
  })
}
const exportQualityJudgeStatistics = data => {
  return request({
    url : api.exportQualityJudgeStatistics,
    params : data
  })
}

const getTotalJudgeForReview = data => {
  return request({
    url : api.getTotalJudgeForReview,
    method : 'POST',
    data
  })
}

const exportReviewWork = data => {
  return request({
    url : api.exportReviewWork,
    params : data
  })
}
const getQualityStatistics = data => {
  return request({
    url : api.getQualityStatistics,
    params : data
  })
}
const teaQualityResult = data => {
  return request({
    method:"post",
    url : api.teaQualityResult,
    data
  })
}
const exportQualityStatistics = data => {
  return request({
    url : api.exportQualityStatistics,
    params : data
  })
}
const getViolateType = data => {
  return request({   
    url : api.getViolateType,
    params:data
  })
}
const getExamAnalysis = data => {
  return request({   
    url : api.getExamAnalysis,
    params:data
  })
}
const getExamAnalysisField = data => {
  return request({   
    url : api.getExamAnalysisField,
    params:data
  })
}
const setExamAnalysisField = data => {
  return request({  
    method:'post', 
    url : api.setExamAnalysisField,
    data
  })
}
const getExamCourseList = data => {
  return request({  
    url : api.getExamCourseList,
    params:data
  })
}
const getPaperTypeList = data => {
  return request({  
    url : api.getPaperTypeList,
    params:data
  })
}
const getPaperAnalysis = data => {
  return request({  
    url : api.getPaperAnalysis,
    params:data
  })
}
const getExamAnalysisTotal = data => {
  return request({  
    url : api.getExamAnalysisTotal,
    params:data
  })
}
const getPaperAnalysisChartData = data => {
  return request({  
    url : api.getPaperAnalysisChartData,
    params:data
  })
}

const exportExamAnalysis = data => {
  return request({
    url : api.exportExamAnalysis,
    params : data
  })
}
const exportPaperAnalysis = data => {
  return request({
    url : api.exportPaperAnalysis,
    params : data
  })
}
export default {
    getUseExamPlan,
    getScoreList,
    exportStudentScore,
    exportPassingRate,
    exportFeedBack,
    exportScoreCallBack,
    getLogOptType,
    getMarkLog,
    getTeacherJson,
    getReviewOperateGrid,
    getSignInfo,
    getSignImg,
    getPackageLogList,
    reviewList,
    qualityList,
    totalQualityData,
    reviewResult,
    getGridJsonForTeacher,
    teacherJudegExcelOut,
    getExamGridJson,
    paperJudegExcelOut,
    getTeacherReviewStudentGrid,
    getTotalJudgeForReview,
    exportQualityJudgeStatistics,
    exportReviewWork,
    getQualityStatistics,
    teaQualityResult,
    exportQualityStatistics,
    getViolateType,
    getExamAnalysis,
    getExamAnalysisField,
    setExamAnalysisField,
    getExamCourseList,
    getPaperTypeList,
    getPaperAnalysis,
    getExamAnalysisTotal,
    getPaperAnalysisChartData,
    exportExamAnalysis,
    exportPaperAnalysis
}


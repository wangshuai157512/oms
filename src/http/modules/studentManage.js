import * as api from '../api'
import request from '../request'

const getHighManageList = data => {
  return request({
    url : `${api.getHighManageList}`,
    params : data
  })
}

const getEnableExamJson = () => {
  return request({
    url : api.getEnableExamJson,
    method: 'POST'
  })
}

const getExamStation = data => {
  return request({
    url : api.getExamStation,
    method : 'POST',
    data
  })
}

const getExamCourseCode = data => {
  return request({
    url : api.getExamCourseCode,
    method : 'POST',
    data
  })
}

const getCheckState = () => {
  return request({
    url : api.getCheckState
  })
}

const getStudentField = data => {
  return request({
    url : api.getStudentField,
    params : data
  })
}

const highManageCheckState = () => {
  return request({
    url : api.highManageCheckState
  })
}

const saveHighManagePaperState = data => {
  return request({
    url : api.saveHighManagePaperState,
    method : 'POST',
    data
  })
}

const getExamBatch = data => {
  return request({
    url : api.getExamBatch,
    method : 'POST',
    data
  })
}

const getExamLevel = data => {
  return request({
    url : api.getExamLevel,
    method : 'POST',
    data
  })
}

const getExamSubject = data => {
  return request({
    url : api.getExamSubject,
    method : 'POST',
    data
  })
}

const getStudentInfoGridJson = data => {
  return request({
    url : api.getStudentInfoGridJson,
    params : data
  })
}

const deleteForm = data => {
  return request({
    url : api.deleteForm,
    method : 'POST',
    data
  })
}

const batchDelete = data => {
  return request({
    url : api.batchDelete,
    method : 'POST',
    data
  })
}

const deleteQueryStudents = data => {
  return request({
    url : api.deleteQueryStudents,
    method : 'POST',
    data
  })
}

const excelOut = data => {
  return request({
    url : api.excelOut,
    method : 'POST',
    data
  })
}

const downloadFile = data => {
  return request({
    url : api.downloadFile,
    params : data
  })
}

const studentInfoImport = data => {
  return request({
    url : `${api.studentInfoImport}`,
    method : 'POST',
    headers : {
      'Content-Type' : false
    },
    data
  })
}

const getStudentPaperJson = data => {
  return request({
    url : api.getStudentPaperJson,
    method : 'POST',
    data
  })
}

const releaseBindStudent = data => {
  return request({
    url : api.releaseBindStudent,
    method : 'POST',
    data
  })
}

const saveHighManagePaperObjectiveAnswer = data => {
  return request({
    url : api.saveHighManagePaperObjectiveAnswer,
    method : 'POST',
    data
  })
}

const getSignInfoImg = data => {
  return request({
    url : api.getSignInfoImg,
    method : 'POST',
    data
  })
}

const getStudentInfoImportTemplate = data => {
  return request({
    url : api.getStudentInfoImportTemplate,
    method : 'POST',
    data
  })
}

const getStudentImportInfo = data => {
  return request({
    url : api.getStudentImportInfo,
    method : 'POST',
    data
  })
}

const getExamPlace = data => {
  return request({
    url : api.getExamPlace,
    method : 'POST',
    data
  })
}

export default {
  getHighManageList,
  getEnableExamJson,
  getExamStation,
  getExamCourseCode,
  getCheckState,
  getStudentField,
  highManageCheckState,
  saveHighManagePaperState,
  getExamBatch,
  getExamLevel,
  getExamSubject,
  getStudentInfoGridJson,
  deleteForm,
  batchDelete,
  deleteQueryStudents,
  excelOut,
  studentInfoImport,
  getStudentPaperJson,
  releaseBindStudent,
  saveHighManagePaperObjectiveAnswer,
  getSignInfoImg,
  getStudentInfoImportTemplate,
  getStudentImportInfo,
  getExamPlace
}

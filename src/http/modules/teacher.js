import * as api from '../api'
import request from '../request'


const getTeacherList = data => {
  return request({
    url : api.teacherList,
    params : data
  })
}
const getRoleType = data => {
  return request({
    url : api.roleType,
    method : 'POST',
    data
  })
}
const addTeacher = data => {
  return request({
    url : api.addTeacher,
    method : 'POST',
    data
  })
}
const deleteTeacher = data => {
  return request({
    url : api.deleteTeacher,
    method : 'POST',
    data
  })
}
const exportTeacherCourse = data => {
  return request({
    url : api.exportTeacherCourse,
    method : 'POST',
    data
  })
}
const teaSwitchState = data => {
  return request({
    url : api.teaSwitchState,
    method : 'POST',
    data
  })
}
const TeacherCourseImport = data => {
  return request({
    url : api.TeacherCourseImport,
    method : 'POST',
    headers : {
      'Content-Type' : false
    },
    data
  })
}
const getCourseList = data => {
  return request({
    url : api.getCourse,
    method : 'POST',
    data
  })
}
const getReadList = data => {
  return request({
    url : api.readList,
    params : data
  })
}
const getTestPlan = data => {
  return request({
    url : api.testPlan,
    method : 'POST',
    data
  })
}
const GetMarkRule = data => {
  return request({
    url : api.GetMarkRule,
    method : 'POST',
    data
  })
}
const saveMarkRule = data => {
  return request({
    url : api.saveMarkRule,
    method : 'POST',
    data
  })
}
const allocation = data => {
  return request({
    url : api.allocation,
    method : 'POST',
    data
  })
}
const batchTeaDelete = data => {
  return request({
    url : api.batchTeaDelete,
    method : 'POST',
    data
  })
}
const getDetailList = data => {
  return request({
    url : api.detailList,
    params : data
  })
}
const getTeaInfo = data => {
  return request({
    url : api.teaInfo,
    method : 'POST',
    data
  })
}
const getPaperBindInfo = data => {
  return request({
    url : api.paperBindInfo,
    method : 'POST',
    data
  })
}
const exportMarkSet = data => {
  return request({
    url : api.exportMarkSet,
    method : 'POST',
    data
  })
}
const deleteMarkSet = data => {
  return request({
    url : api.deleteMarkSet,
    method : 'POST',
    data
  })
}
const addSetDetail = data => {
  return request({
    url : api.addSetDetail,
    method : 'POST',
    data
  })
}
const editSetDetail = data => {
  return request({
    url : api.editSetDetail,
    method : 'POST',
    data
  })
}
const notSetSequence = data => {
  return request({
    url : api.notSetSequence,
    method : 'POST',
    data
  })
}
const editSwitch = data => {
  return request({
    url : api.editSwitch,
    method : 'POST',
    data
  })
}
const getExamCourseCode = data => {
  return request({
    url : api.examCourseCode,
    method : 'POST',
    data
  })
}
const getTeaResultList = data => {
  return request({
    url : api.teaResultList,
    params : data
  })
}
const ImportTeacherMark = data => {
  return request({
    url : api.ImportTeacherMark,
    method : 'POST',
    headers : {
      'Content-Type' : false
    },
    data
  })
}
const getTeaCourseJson = data => {
  return request({
    url : api.getTeaCourseJson,
    params : data
  })
}
const getImportArea = data => {
  return request({
    url : api.getImportArea,
    method : 'POST',
    data
  })
}
const exportTeaTemplate = data => {
  return request({
    url : api.exportTeaTemplate,
    method : 'POST',
    data
  })
}
const ImportTeaXls = data => {
  return request({
    url : api.ImportTeaXls,
    method : 'POST',
    data
  })
}

export default {
  getTeacherList,
  getRoleType,
  addTeacher,
  deleteTeacher,
  exportTeacherCourse,
  teaSwitchState,
  TeacherCourseImport,
  getCourseList,
  getReadList,
  getTestPlan,
  GetMarkRule,
  saveMarkRule,
  allocation,
  batchTeaDelete,
  exportMarkSet,
  getDetailList,
  getTeaInfo,
  getPaperBindInfo,
  deleteMarkSet,
  addSetDetail,
  editSetDetail,
  notSetSequence,
  editSwitch,
  getExamCourseCode,
  getTeaResultList,
  ImportTeacherMark,
  getTeaCourseJson,
  getImportArea,
  exportTeaTemplate,
  ImportTeaXls,
 
}
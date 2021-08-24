import * as api from '../api'
import request from '../request'

const getGridJson = data => {
  return request({
    url : api.getGridJson,
    params : data
  })
}

const getExamTypeList = data => {
  return request({
    url : api.getExamTypeList,
    method : 'POST',
    data
  })
}

const submitForm = data => {
  return request({
    url : api.submitFormExamPlan,
    method : 'POST',
    data
  })
}

const getExamPlanFormJson = data => {
  return request({
    url : api.getExamPlanFormJson,
    method : 'POST',
    data
  })
}

const deleteExamPlanForm = data => {
  return request({
    url : api.deleteExamPlanForm,
    method : 'POST',
    data
  })
}

const enabledExam = data => {
  return request({
    url : api.enabledExam,
    method : 'POST',
    data
  })
}

const getTeacherCourseGridJson = data => {
  return request({
    url : api.getTeacherCourseGridJson,
    params : data
  })
}

const submitFormCourse = data => {
  return request({
    url : api.SubmitFormCourse,
    method : 'POST',
    data
  })
}

const deleteCourseForm = data => {
  return request({
    url : api.deleteCourseForm,
    method : 'POST',
    data
  })
}
const getAnswerCardConfigInfo = data => {
  return request({
    url : api.getAnswerCardConfigInfo,   
    params:data
  })
}
const getAnswerCardTemplateInfo = data => {
  return request({
    url : api.getAnswerCardTemplateInfo,  
    method:"POST",
    data
  })
}


export default {
  getGridJson,
  getExamTypeList,
  submitForm,
  getExamPlanFormJson,
  deleteExamPlanForm,
  enabledExam,
  getTeacherCourseGridJson,
  submitFormCourse,
  deleteCourseForm,
  getAnswerCardConfigInfo,
  getAnswerCardTemplateInfo
}

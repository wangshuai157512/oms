import * as api from '../api'
import request from '../request'

const getPaperGridJson = data => {
  return request({
    url : api.getPaperGridJson,
    params : data
  })
}

const getPaperAnswerGridJson = data => {
  return request({
    url : api.getPaperAnswerGridJson,
    params : data
  })
}

const getPaperAnswerFormJson = data => {
  return request({
    url : api.getPaperAnswerFormJson,
    method : 'POST',
    data
  })
}

const paperAnswerSubmitForm = data => {
  return request({
    url : api.paperAnswerSubmitForm,
    method : 'POST',
    data
  })
}

const deleteForm = data => {
  return request({
    url : api.deleteAnswerForm,
    method : 'POST',
    data
  })
}

const getPaperJson = data => {
  return request({
    url : api.getPaperJson,
    method : 'POST',
    data
  })
}

const getExaminationGridJson = data => {
  return request({
    url : api.getExaminationGridJson,
    params : data
  })
}

const uploadFiles = (data,cb) => {
  return request({
    url : `${api.uploadFiles}`,
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

const getSyncOtsPaperList = data => {
  return request({
    url : api.getSyncOtsPaperList,
    params : data
  })
}

const getOTSAutoRelationRules = data => {
  return request({
    url : api.getOTSAutoRelationRules,
    method : 'POST',
    data
  })
}

const setOTSAutoRelationRules = data => {
  return request({
    url : api.setOTSAutoRelationRules,
    method : 'POST',
    data
  })
}

const setAutoRelation = data => {
  return request({
    url : api.setAutoRelation,
    method : 'POST',
    data
  })
}

const getOTSPaperList = data => {
  return request({
    url : api.getOTSPaperList,
    method : 'POST',
    data
  })
}

const autoAnswerSync = data => {
  return request({
    url : api.autoAnswerSync,
    method : 'POST',
    data
  })
}

const getOTSCourseJson = data => {
  return request({
    url : api.getOTSCourseJson,
    method : 'POST',
    data
  })
}

const relationOnePaper = data => {
  return request({
    url : api.relationOnePaper,
    method : 'POST',
    data
  })
}

const unRelationOnePaper = data => {
  return request({
    url : api.unRelationOnePaper,
    method : 'POST',
    data
  })
}

const answerSyncOnePaper = data => {
  return request({
    url : api.answerSyncOnePaper,
    method : 'POST',
    data
  })
}

const getPaperTemplateGridJson = data => {
  return request({
    url : api.getPaperTemplateGridJson,
    params : data
  })
}

const getAllTemplate = data => {
  return request({
    url : api.getAllTemplate,
    params : data
  })
}

const setTempletToPaper = data => {
  return request({
    url : api.setTempletToPaper,
    method : 'POST',
    data
  })
}

const setPaperPageCount = data => {
  return request({
    url : api.setPaperPageCount,
    method : 'POST',
    data
  })
}

const importPageCount = data => {
  return request({
    url : api.importPageCount,
    method : 'POST',
    headers : {
      'Content-Type' : false
    },
    data
  })
}

const getPackageRule = data => {
  return request({
    url : api.getPackageRule,
    method : 'POST',
    data
  })
}

const setPackageRule = data => {
  return request({
    url : api.setPackageRule,
    method : 'POST',
    data
  })
}

const createPackageNumber = data => {
  return request({
    url : api.createPackageNumber,
    method : 'POST',
    data
  })
}

const copyPackageNumber = data => {
  return request({
    url : api.copyPackageNumber,
    method : 'POST',
    data
  })
}

const deletePackageNumber = data => {
  return request({
    url : api.deletePackageNumber,
    method : 'POST',
    data
  })
}

const checkPackageInfo = data => {
  return request({
    url : api.checkPackageInfo,
    method : 'POST',
    data
  })
}

const uploadPaper = (data,cb) => {
  return request({
    url : api.uploadPaper,
    method : 'POST',
    headers : {
      'Content-Type' : false
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

const downLoadFile = api => {
  return request({
    url : api
  })
}

const getPaperPackageInfo = data => {
  return request({
    url : api.getPaperPackageInfo,
    params : data
  })
}

const deleteLocalPaper = data => {
  return request({
    url : api.deleteLocalPaper,
    method : 'POST',
    data
  })
}
const saveAnswerCardDesignInfo = data => {
  return request({
    url : api.saveAnswerCardDesignInfo,
    method : 'POST',
    data
  })
}
const getAnswerCardTemplateList = data => {
  return request({
    url : api.getAnswerCardTemplateList,
    params : data
  })
}
const previewAnswerCardTemplate = data => {
  return request({
    url : api.previewAnswerCardTemplate,
     method : 'POST',
    data
  })
}

export default {
  getPaperGridJson,
  getPaperAnswerGridJson,
  getPaperAnswerFormJson,
  paperAnswerSubmitForm,
  deleteForm,
  getPaperJson,
  getExaminationGridJson,
  uploadFiles,
  getSyncOtsPaperList,
  getOTSAutoRelationRules,
  setOTSAutoRelationRules,
  setAutoRelation,
  getOTSPaperList,
  autoAnswerSync,
  getOTSCourseJson,
  relationOnePaper,
  unRelationOnePaper,
  answerSyncOnePaper,
  getPaperTemplateGridJson,
  getAllTemplate,
  setTempletToPaper,
  setPaperPageCount,
  importPageCount,
  getPackageRule,
  setPackageRule,
  createPackageNumber,
  copyPackageNumber,
  deletePackageNumber,
  checkPackageInfo,
  uploadPaper,
  downLoadFile,
  getPaperPackageInfo,
  deleteLocalPaper,
  saveAnswerCardDesignInfo,
  getAnswerCardTemplateList,
  previewAnswerCardTemplate
}

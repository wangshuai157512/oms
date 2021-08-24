import * as api from '../api'
import request from '../request'

const getExamOrder = data => {
    return request({
        url : api.getExamOrder,
        method : 'POST',
        data
    })
}
const getExamClass = data => {
    return request({
        url : api.getExamClass,
        method : 'POST',
        data
    })
}
const getHeader = data => {
    return request({
        url : api.getHeader,
        params:data
    })
}
const getScanJson = data => {
    return request({
        url : api.getScanJson,
        params:data
    })
}
const exportScan = data => {
    return request({
        url : api.exportScan,
        params:data
    })
}

export default {
    getExamOrder,
    getExamClass,
    getHeader,
    getScanJson,
    exportScan,
}
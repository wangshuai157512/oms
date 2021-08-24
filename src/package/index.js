import OmsUploadFile from './OmsUploadFile'
import OmsRefer from './OmsRefer'
import OmsTable from './OmsTable'
import OmsPage from './OmsPage'
import OmsTableGroup from './OmsTableGroup'
import OmsCustomPage from './OmsCustomPage'

const packages = [
    OmsUploadFile,
    OmsRefer,
    OmsTable,
    OmsPage,
    OmsTableGroup,
    OmsCustomPage
]

const install = Vue => {
    packages.forEach(item => {
        Vue.component(item.name,item)
    })
}

export default install

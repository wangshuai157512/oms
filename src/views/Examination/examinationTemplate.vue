<template>
    <div>
        <oms-table-group
            :selectList="teaSelectList"
            :functionality-btn="functionalityBtn"
            :request-form="queryJson"
            :tableHeaderList="tableHeader"
            :paginationOptions="pageOptions"
            :option="tableOptions"
            :tableList="tableList"
            title="试卷模板设置"
            @search="getPaperTemplateGridJson"
            @sortChange="sortChange"
            @handleSelectionChange="handleSelectionChange"
            @changePage="changePage"
            @changeNum="changeNum"
        />
        <oms-custom-page
            :dialog.sync="templateDialog"
            title="设置试卷与模板关联"
        >
            <template v-slot:content>
                <oms-table-group
                    :tableList="tableTemplateList"
                    :tableHeaderList="tableTemplateListHeader"
                    :paginationOptions="templatePageOptions"
                    :option="{ isHideSetting : true }"
                    @handleCurrentChange="handleCurrentChange"
                    @changePage="changeTemplatePage"
                />
            </template>
            <template v-slot:footer>
                <el-button @click="templateDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="setTemplate">确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="countDialog"
            title="设置张数"
        >
            <template v-slot:content>
                <div style="width: 240px">
                    <el-form :model="countForm" ref="countForm">
                        <el-form-item
                            label="答题卡纸张数量"
                            prop="count"
                            :rules="[
                                { required : true, validator : checkCount, trigger: 'blur'}
                            ]"
                        >
                            <el-input type="age" v-model.number="countForm.count" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="countDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="setCount">确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="importDialog"
            title="导入数量文件"
        >
            <template v-slot:content>
                <div class="dialog-content">
                    <div class="dialog-item">
                        <p>考试批次:</p>
                        <el-select v-model="importExamId" placeholder="请选择">
                            <el-option
                                v-for="item in teaSelectList[0].data"
                                :key="item.examId"
                                :label="item.examName"
                                :value="item.examId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="dialog-item">
                        <p>导入文件:</p>
                        <oms-upload-file ref="upload" :http-request="handleUpLoad"></oms-upload-file>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="importDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="importFile">导入</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  export default {
    name: "examinationTemplate",
    data() {
      return {
        teaSelectList: [
          {
            title: "考试批次",
            type: "select",
            isSearch: true,
            requestKey: "examId",
            label: 'examName',
            value: 'examId',
            data: [],
          },
          {
            title: "课程名称",
            type: "select",
            isSearch: true,
            requestKey: "courseCode",
            label: 'courseName',
            value: 'courseCode',
            data: [],
          },
          {
            title: "卷别",
            type: "select",
            isSearch: false,
            requestKey: "paperType",
            label: 'label',
            value: 'value',
            data: [
              {
                value: '',
                label: "全部",
              },
              {
                value: 'A',
                label: "A",
              },
              {
                value: "B",
                label: "B",
              },
              {
                value: "C",
                label: "C",
              },
              {
                value: "D",
                label: "D",
              },
              {
                value: "E",
                label: "E",
              },
              {
                value: "F",
                label: "F",
              }
            ]
          },
        ],
        functionalityBtn: [
          {
            title: '导出套打信息',
            funClick: this.handleExport,
            disabled : this.isDisable
          },
          {
            title: '指定模板',
            funClick: this.showTemplateDialog,
            disabled : this.isDisable
          },
          {
            title : '设置张数',
            funClick : this.showCountDialog,
            disabled : this.isDisable
          },
          {
            title : '导入数量文件',
            funClick : this.showImportDialog
          }
        ],
        queryJson: {
          examId: '',
          courseCode: '',
          paperType: '',
          page : 1,
          rows : 30,
          sidx : 'paperId',
          sord : 'asc'
        },
        tableHeader: [
          {
            title: '考试批次',
            prop: 'examName',
            sortable: 'custom'
          },
          {
            title: '课程名称',
            prop: 'courseName',
            sortable: 'custom'
          },
          {
            title: '卷别',
            prop: 'paperType',
            sortable: 'custom'
          },
          {
            title: '模板名称',
            prop: 'templateName',
            sortable: 'custom'
          },
          {
            title: '纸张数量',
            prop: 'pageCount',
            sortable: 'custom'
          }
        ],
        tableTemplateListHeader: [
          {
            title: '模板名称',
            prop: 'templateName'
          },
          {
            title: '正面预览',
            prop: 'thumbnailFaceUrl',
            formatter : ({row : { thumbnailFaceUrl }}) => {
              if (thumbnailFaceUrl) {
                return `<a class="linkto" href="${thumbnailFaceUrl}" target="_blank">点击查看</a>`
              } else {
                return '-'
              }
            }
          },
          {
            title: '背面预览',
            prop: 'thumbnailBackUrl',
            formatter : ({row : { thumbnailBackUrl }}) => {
              if (thumbnailBackUrl) {
                return `<a class="linkto" href="${thumbnailBackUrl}" target="_blank">点击查看</a>`
              } else {
                return '-'
              }
            }
          }
        ],
        tableOptions: {
          ismultiple: true,
          defaultProp: 'paperId',
          defaultSort: 'ascending'
        },
        templatePageOptions : {
          total : 0,
          pageSize : 30
        },
        pageOptions : {
          total : 0,
          pageSize : 30
        },
        tableList: [],
        tableTemplateList: [
          {
            a: '123'
          }
        ],
        setTemplateParams: {
          ids: '',
          templateID: '',
          examId: ''
        },
        templateQueryJson : {
          page : 1,
          rows : 30,
          sidx : 'templateName',
          sord : 'asc'
        },
        templateDialog: false,
        countDialog: false,
        countForm: {
          count : 0
        },
        selectList : [],
        importDialog : false,
        importExamId : null,
        setTemplateVal : null,
        file : null
      }
    },
    methods: {
      //考试批次
      async getEnableExamJson() {
        let {data} = await this.$api.studentManage.getEnableExamJson()
        this.$set(this.teaSelectList[0], 'data', data)
        this.queryJson.examId = data[0].examId
        this.importExamId = data[0].examId
      },
      //课程名称
      async getCourse() {
        let {data} = await this.$api.teacher.getCourseList()
        let newList = [
          {
            courseName: '全部',
            courseCode: ''
          },
          ...data
        ]
        this.$set(this.teaSelectList[1], 'data', newList)
      },
      //获取列表
      async getPaperTemplateGridJson () {
        let { data } = await this.$api.examination.getPaperTemplateGridJson(this.queryJson)
        this.tableList = data.rows
        this.pageOptions.total = data.records
      },
      handleSelectionChange (val) {
        this.selectList = val
      },
      changePage (p) {
        this.queryJson.page = p
        this.getPaperTemplateGridJson()
      },
      changeNum (n) {
        this.queryJson.rows = n
        this.getPaperTemplateGridJson()
      },
      sortChange({prop, order}) {
        this.tableSort(this.requestParams,order,prop,'paperId')
        this.getPaperTemplateGridJson()
      },
      //获取模板列表
      async showTemplateDialog() {
        if (!this.selectList.length) {
          this.$message.warning('请选择试卷才可进行模板分配操作!')
          return
        }
        this.templateDialog = true
        let { data } = await this.$api.examination.getAllTemplate(this.templateQueryJson)
        this.tableTemplateList = data.rows
        this.templatePageOptions.total = data.records
      },
      changeTemplatePage (p) {
        this.templateQueryJson.page = p
        this.showTemplateDialog()
      },
      async setTemplate() {
        if (!this.setTemplateVal) {
          this.$message.warning('请选择模板')
          return
        }
        let paperIds = []
        this.selectList.forEach(item => {
          paperIds.push(item.paperId)
        })
        let { status } = await this.$api.examination.setTempletToPaper({
          templateId : this.setTemplateVal.templateId,
          paperIds : paperIds.join(',')
        })
        if (status === 1) {
          this.templateDialog = false
          this.setTemplateVal = null
          this.$message.success('设置成功')
          this.getPaperTemplateGridJson()
        }
      },
      handleCurrentChange(val) {
        this.setTemplateVal = val
      },
      async setCount() {
        let paperIds = []
        this.selectList.forEach(item => {
          paperIds.push(item.paperId)
        })
        let { status } = await this.$api.examination.setPaperPageCount({
          count : this.countForm.count,
          paperIds : paperIds.join(',')
        })
        if (status === 1) {
          this.$message.success('设置成功')
          this.countDialog = false
          this.getPaperTemplateGridJson()
        }
      },
      showCountDialog () {
        if (!this.selectList.length) {
          this.$message.warning('请选择需要设置的试卷！')
          return
        }
        this.countDialog = true
      },
      checkCount (rule, value, callback) {
        if (value !== '') {
            if (typeof value !== 'number') {
              callback(new Error('请输入数字类型'))
            } else {
              if (value < 1) {
                callback(new Error('请输入大于0的数字'))
              } else {
                callback()
              }
            }
        } else {
          callback(new Error('张数不能为空'))
        }
      },
      showImportDialog () {
        this.importDialog = true
      },
      handleUpLoad ({file}) {
        this.file = file
      },
      clearFile (val) {
        if (!val) {
          this.file && this.$refs.upload.clearFileName()
          this.file = null
        }
      },
      async importFile () {
        if (!this.file) {
          this.$message.error('请选择文件')
          return
        }
        let formdata = this.$tools.createFormData({
          file : this.file,
          examId : this.importExamId
        })
        await this.$api.examination.importPageCount(formdata)
        this.importDialog = false
      },
      //导出
      async handleExport () {
        let { data, status } = await this.$api.examination.exportPrintInfo({examId:this.queryJson.examId})
        if (status === 1) {
          window.open(data.fileName)
        }
      },
    },
    async mounted() {
      await this.getEnableExamJson()
      await this.getCourse()
      this.getPaperTemplateGridJson()
    },
    watch : {
      'importDialog' : {
        handler : 'clearFile'
      }
    }
  }
</script>

<style scoped lang="less">
    .dialog-item {
        margin-top: 10px;
        p {
            margin-bottom: 10px;
            color: #666;
            font-size: 14px;
        }
        /deep/.el-select {
            width: 280px;
        }
    }
</style>

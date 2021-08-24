<template>
    <div class="examination-answer-container">
        <oms-table-group
            :selectList="teaSelectList"
            :functionality-btn="functionalityBtn"
            :request-form="requestForm"
            :tableHeaderList="tableHeader"
            :option="tableOptions"
            :tableList="tableList"
            :paginationOptions="pageOptions"
            title="试卷答案管理"
            @search="getPaperGridJson"
            @sortChange="sortChange"
            @changePage="changePage"
            @changeNum="changeNum"
        />
        <oms-custom-page :dialog.sync="importDialog" title="导入答案">
            <template v-slot:content class="uploadH">
                <slot>
                    <div class="upLoadExplain">
                        <div>1.请按照模板格式准备需要导入的数据</div>
                        <a href="/template/paperAnswerImport.xls " class="downTemplate">下载标准答案模板</a>
                        <div>2.请选择需导入的文件，支持xls、xlsx格式，单文件不得大于5M</div>
                    </div>
                </slot>
                <oms-upload-file ref="upload" :limit="10000000" :multiple="isAllImport" :http-request="handleUpLoad" :accept="accept" :fileSize="upFileSize"></oms-upload-file>
                <div v-if="Array.isArray(file) && file.length > 0">
                    <div class="progress-item">
                        <span>总进度</span>
                        <el-progress :percentage="progress"></el-progress>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="importDialog = false" round>取 消</el-button>
                <el-button type="primary" round @click="handleImport">导入</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="answerDialog"
            title=""
            :isFullScreen="true"
        >
            <template v-slot:content>
                <oms-table
                    :functionality-btn="answerFunctionalityBtn"
                    :tableHeaderList="answerTableHeader"
                    :option="answerTableOptions"
                    :tableList="answerTableList"
                    :paginationOptions="pageOptions"
                    title="答案明细"
                    @handleSelectionChange="selectAllData"
                ></oms-table>
                <oms-page
                    :paginationOptions="answerPageOptions"
                    @changePage="changeAnswerPage"
                    @changeNum="changeAnswerNum"
                />
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="editAnswerDialog"
            :before-close="clearForm"
            title="编辑试卷答案"
        >
            <template v-slot:content>
                <div class="form-conrainer">
                    <el-form :rules="rules" label-position="left" ref="form" :model="editForm" >
                        <el-form-item label="大题号" prop="structureId">
                            <el-input :disabled="editForm.sequence !== ''" v-model.number="editForm.structureId"
                                      placeholder="请输入大题号"></el-input>
                        </el-form-item>
                        <el-form-item label="小题号" prop="questionId">
                            <el-input :disabled="editForm.sequence !== ''" v-model.number="editForm.questionId"
                                      placeholder="请输入小题号"></el-input>
                        </el-form-item>
                        <el-form-item label="子题号" prop="subQuestionId">
                            <el-input :disabled="editForm.sequence !== ''" v-model.number="editForm.subQuestionId"
                                      placeholder="请输入子题号"></el-input>
                        </el-form-item>
                        <el-form-item label="题目类型" prop="questionType">
                            <el-select v-model="editForm.questionType" placeholder="请选择题目类型">
                                <el-option label="客观题" :value="1"></el-option>
                                <el-option label="主观题" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="答案" prop="answer" v-if="editForm.questionType === 1">
                            <el-checkbox-group v-model="editForm.answer">
                                <el-checkbox label="A" name="type"></el-checkbox>
                                <el-checkbox label="B" name="type"></el-checkbox>
                                <el-checkbox label="C" name="type"></el-checkbox>
                                <el-checkbox label="D" name="type"></el-checkbox>
                                <el-checkbox label="E" name="type"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="分值" prop="score">
                            <el-input v-model.number="editForm.score" placeholder="请输入分值"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="cancelEditAnswer" round>取消</el-button>
                <el-button type="primary" round @click="saveAnswer">确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page :dialog.sync="importMsgDialog" title="提示">
            <template v-slot:content>
                <div>
                    <div>
                        <span>导入完成，共导入</span>
                        <span style="color: #3388FF;">{{importInfo.totalCount}}</span>
                        <span>个文件，失败</span>
                        <span style="color: #FE5958;">{{importInfo.errorCount}}</span>
                        <span>个文件；</span>
                    </div>
                    <div style="margin-top: 17px">
                        <div v-if="importInfo.fileName">
                            <a class="linkto" :href="importInfo.fileName" target="_blank">下载错误数据</a>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button type="primary" round @click="importMsgDialog = false" >确认</el-button>
            </template>
        </oms-custom-page>

        <oms-custom-page :dialog.sync="uploadDialog" :title="getTips">
            <template v-slot:content>
                <div class="upload-file">
                    <p class="title dialog-title">请选择需要导入的文件</p>
                    <div class="upload-content">
                        <oms-upload-file :http-request="handleUpLoad" :fileSize="upFileSize" :accept="uploadFlag===1?unitAccept:answerAccept">
                            <el-button type="primary" plain round>上传附件</el-button>
                        </oms-upload-file>
                    </div>
                    <p class="tip">支持{{uploadFlag===1?'txt、doc、docx、xls、xlsx、ppt、pptx、pdf、jpg、png、gif、bmp、jpeg、zip、rar':'xls、xlsx'}}格式文件，单个文件不得大于5M</p>
                    <div class="progress-content" v-if="file">
                        <span class="file-name">{{file.name}}</span>
                        <el-progress :percentage="progress"></el-progress>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="uploadDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="uploadAnswer">导入</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  export default {
    name: "ExaminationAnswer",
    data() {
      return {
        tableOptions: {
          defaultProp: 'courseName',
          defaultSort: 'ascending'
        },
        answerTableOptions: {
          isHideSetting: true,
          ismultiple: true
        },
        functionalityBtn: [
          {
            type: 'primary',
            title: '导入答案',
            plain: true,
            size: 'small',
            funClick: this.showUploadDialog
          }
        ],
        answerFunctionalityBtn: [
          {
            type: 'primary',
            title: '新增',
            plain: true,
            size: 'small',
            funClick: this.addAnswer,
            disabeld : false
          },
          {
            type: 'primary',
            title: '批量删除',
            plain: true,
            size: 'small',
            funClick: this.delAllData,
            disabeld : false
          }
        ],
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
            title: '试卷总分',
            prop: 'totalScore',
            sortable: 'custom'
          },
          {
            title: '标准答案',
            label: '查看明细',
            type: 'button',
            prop: 'questionCount',
            formatter: this.getAnswerBtnText,
            onClick: this.lookAnswer
          },
          {
            title: '原卷',
            prop: 'localAddress',
            formatter: this.localAddressFormatter
          },
          {
            title: '答案',
            prop: 'localAnswerAddress',
            formatter: this.localAnswerAddressFormatter
          },
          {
            title: '操作',
            fixed: 'right',
            width: '220',
            show: true,
            type: "buttons",
            fixedPos: 'right',
          }
        ],
        answerTableHeader: [
          {
            title: '大题号',
            prop: 'structureId'
          },
          {
            title: '小题号',
            prop: 'questionId'
          },
          {
            title: '子题号',
            prop: 'subQuestionId'
          },
          {
            title: '答案',
            prop: 'answer'
          },
          {
            title: '分值',
            prop: 'score'
          },
          {
            title: '题目类型',
            prop: 'questionType',
            formatter: ({row: {questionType}}) => questionType === 1 ? '客观题' : '主观题'
          },
          {
            title: '操作',
            fixed: 'right',
            width: '100',
            type: "buttons",
            fixedPos: 'right',
            butList: [
              {
                title: '编辑',
                onClick: this.getAnswerDetail,
                formatter : () => this.paperInfo.allowEdit > 0
              },
              {
                title: '删除',
                onClick: this.showDelTip,
                formatter : () => this.paperInfo.allowEdit > 0
              }
            ]
          }
        ],
        tableList: [],
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
          {
            title: "标准答案",
            type: "select",
            requestKey: "paperSet",
            isSearch: true,
            label: 'label',
            value: 'value',
            data: [
              {
                value: -1,
                label: "全部",
              },
              {
                value: 1,
                label: "已设置",
              },
              {
                value: 2,
                label: "未设置",
              }
            ]
          },
          {
            title: "原卷",
            type: "select",
            requestKey: "localPaper",
            label: 'label',
            value: 'value',
            data: [
              {
                value: -1,
                label: "全部",
              },
              {
                value: 0,
                label: "无",
              },
              {
                value: 1,
                label: "有",
              }
            ]
          },
        ],
        pageOptions: {
          pageSize: 30,
          total: 0
        },
        answerPageOptions: {
          pageSize: 30,
          total: 0
        },
        requestForm: {
          examId: '',
          courseCode: '',
          paperType: '',
          paperSet: -1,
          localPaper: -1,
          rows: 30,
          page: 1,
          sidx: 'courseName',
          sord: 'asc'
        },
        importDialog: false,
        accept: "xls,xlsx",
        upFileSize: "5",
        answerDialog: false,
        answerTableList: [],
        answerRequestParams: {
          "paperId": '',
          "page": 1,
          "rows": 30,
          "sidx": "sequence",
          "sord": "asc"
        },
        editAnswerDialog: false,
        editForm: {
          "paperId": '',
          "sequence": '',
          "structureId": '',
          "questionId": '',
          "subQuestionId": '',
          "questionType": 1,
          "answer": [],
          "score": ''
        },
        rules: {
          structureId: [{required: true, message: '请输入大题号', trigger: 'blur'}],
          questionId: [{required: true, message: '请输入小题号', trigger: 'blur'}],
          answer: [{type: 'array', required: true, message: '请至少选择一个答案', trigger: 'change'}],
          score: [{required: true, message: '请输入分值', trigger: 'blur'}]
        },
        selectDelAllList : '',
        paperInfo : {},
        file : null,
        importData : {},
        isAllImport : false,
        progress : 0,
        importMsgDialog : false,
        importInfo : {},
        uploadDialog : false,
        uploadData : {},
        uploadFlag : 1, //1:原卷 2:答案
        unitAccept:'txt,doc,docx,xls,xlsx,ppt,pptx,pdf,jpg,png,gif,bmp,jpeg,zip,rar',
        answerAccept:'xls,xlsx'
      }
    },
    computed : {
      getTips () {
        return this.uploadFlag===1?'上传原卷':'上传答案'
      }
    },
    methods: {
      //试卷列表
      getPaperGridJson() {
        this.$api.examination.getPaperGridJson(this.requestForm)
          .then(({data}) => {
            data.rows.forEach(item => {
              let butList = [
                {
                  title: "导入答案",
                  onClick: this.showImportAnswerDialog,
                },
              ]
              if (item.localAddress) {
                butList.push({
                  title : '删除原卷',
                  onClick : ({row : { paperId }}) => {
                    this.deleteLocalPaper({
                      paperId,
                      action : 1
                    })
                  }
                })
              } else {
                butList.push({
                  title: "上传原卷",
                  onClick: ({row}) => {
                    this.uploadFlag = 1
                    this.showUploadAnswerDialog(row)
                  },
                })
              }
              if (item.localAnswerAddress) {
                butList.push({
                  title : '删除答案',
                  onClick : ({row : { paperId }}) => {
                    this.deleteLocalPaper({
                      paperId,
                      action : 2
                    })
                  }
                })
              } else {
                butList.push({
                  title: "上传答案",
                  onClick: ({row}) => {
                    this.uploadFlag = 2
                    this.showUploadAnswerDialog(row)
                  }
                })
              }
              item.butList = butList
            })
            this.tableList = data.rows
            this.pageOptions.total = data.records
          })
      },
      //考试批次
      async getEnableExamJson() {
        let {data} = await this.$api.studentManage.getEnableExamJson()
        this.$set(this.teaSelectList[0], 'data', data)
        this.requestForm.examId = data[0].examId
      },
      //课程名称
      getCourse() {
        this.$api.teacher.getCourseList()
          .then(({data}) => {
            let newList = [
              {
                courseName: '全部',
                courseCode: ''
              },
              ...data
            ]
            this.$set(this.teaSelectList[1], 'data', newList)
          })
      },
      async deleteLocalPaper (data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        })
          .then(async () => {
            let { status } = await this.$api.examination.deleteLocalPaper(data)
            if (status === 1) {
              this.$message.success('删除成功')
              this.getPaperGridJson()
            }
          })
          .catch(() => {})
      },
      changePage(p) {
        this.requestForm.page = p
        this.getPaperGridJson()
      },
      changeNum (n) {
        this.requestForm.rows = n
        this.getPaperGridJson()
      },
      //获取试卷信息
      async getPaperInfo () {
        let { data } = await this.$api.examination.getPaperJson({
          paperId : this.answerRequestParams.paperId
        })
        this.paperInfo = data
        let isEdit = data.allowEdit > 0
        this.$set(this.answerFunctionalityBtn[0],'disabled',isEdit)
        this.$set(this.answerFunctionalityBtn[1],'disabled',isEdit)
      },
      //查看明细
      async lookAnswer({paperId}) {
        this.answerRequestParams.paperId = paperId
        this.editForm.paperId = paperId
        this.answerDialog = true
        await this.getPaperInfo()
        this.lookAnswerDetail()
      },
      //查看详情
      async lookAnswerDetail() {
        let { data } = await this.$api.examination.getPaperAnswerGridJson(this.answerRequestParams)
        this.answerTableList = data.rows
        this.answerPageOptions.total = data.records
      },
      showDelTip ({row : { sequence }}) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        }).then(() => {
          this.selectDelAllList = sequence.toString()
          this.delAnswer()
        }).catch(() => {});
      },
      //删除答案
      async delAnswer () {
        let { status } = await this.$api.examination.deleteForm({
          paperId : this.answerRequestParams.paperId,
          sequence : this.selectDelAllList
        })
        if (status === 1) {
          this.$message.success('删除成功')
          this.selectDelAllList = ''
          this.lookAnswerDetail()
          this.getPaperGridJson()
        }
      },
      //批量删除
      async delAllData () {
        this.$confirm('此操作将永久删除选中数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        }).then(() => {
          if (this.selectDelAllList) {
            this.delAnswer()
          } else {
            this.$message.warning('请选择删除的数据')
          }
        }).catch(() => {});
      },
      selectAllData (val) {
        let data = []
        val.forEach(item => {
          data.push(item.sequence)
        })
        this.selectDelAllList = data.toString()
      },
      addAnswer() {
        this.editAnswerDialog = true
        setTimeout(() => {
          this.$refs.form.resetFields()
          this.editForm = {
            "paperId": this.editForm.paperId,
            "sequence": '',
            "structureId": '',
            "questionId": '',
            "subQuestionId": '',
            "questionType": 1,
            "answer": [],
            "score": ''
          }
        },20)
      },
      //编辑答案
      async getAnswerDetail({row: {paperId, sequence}}) {
        let { data } = await this.$api.examination.getPaperAnswerFormJson({
          paperId, sequence
        })
        this.editAnswerDialog = true
        setTimeout(() => {
          this.$refs.form.resetFields()
          this.editForm = {
            "paperId": data.paperId,
            "sequence": data.sequence,
            "structureId": data.structureId,
            "questionId": data.questionId,
            "subQuestionId": data.subQuestionId,
            "questionType": data.questionType,
            "answer": data.answer ? data.answer.split('') : [],
            "score": data.score
          }
        },20)
      },
      clearForm () {
        setTimeout(() => {
          this.$refs.form.resetFields()
        },20)
      },
      cancelEditAnswer () {
        this.clearForm()
        this.editAnswerDialog = false
      },
      //保存/新增答案
      async saveAnswer() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let params = {
              ...this.editForm,
              answer: this.editForm.questionType === 1 ? this.editForm.answer.join('') : ''
            }
            let { status } = await this.$api.examination.paperAnswerSubmitForm(params)
            if (status === 1) {
              this.$message.success('操作成功')
              this.$refs.form.resetFields()
              setTimeout(() => {
                this.editAnswerDialog = false
              },20)
              this.editForm = {
                "paperId": this.editForm.paperId,
                "sequence": '',
                "structureId": '',
                "questionId": '',
                "subQuestionId": '',
                "questionType": 1,
                "answer": [],
                "score": ''
              }
              this.lookAnswerDetail()
            }
          }
        });
      },
      changeAnswerPage (p) {
        this.answerRequestParams.page = p
        this.lookAnswerDetail()
      },
      changeAnswerNum (n) {
        this.answerRequestParams.rows = n
        this.lookAnswerDetail()
      },
      sortChange({prop, order}) {
        this.tableSort(this.requestForm,order,prop,'courseName')
        this.getPaperGridJson()
      },
      localAddressFormatter({row: {localAddress, otsPaperId, paperId, examId, otsPaperName}}) {
        if (localAddress) {
          let aTag = `<a onClick="downLoadFile('/service/api/PaperAnswer/DownloadLocalPaper?paperId=${paperId}&actionType=1')" class="linkto" href='javascript:;'>下载原卷</a>`
          if (otsPaperId) {
            aTag += `<a onClick="downloadFile('/service/api/PaperAnswer/PreviewOTSPaper?paperid=${otsPaperId}&examId=${examId}')" class="linkto no-first" href='javascript:;'>${otsPaperName}</a>`
          }
          return aTag
        } else {
          if (otsPaperId) {
            return `<a onClick="downLoadFile('/service/api/PaperAnswer/PreviewOTSPaper?paperid=${otsPaperId}&examId=${examId}')" class="linkto" href='javascript:;'>${otsPaperName}</a>`
          } else {
            return '无'
          }
        }
      },
      localAnswerAddressFormatter({row: {localAnswerAddress, paperId}}) {
        if (localAnswerAddress) {
          return `<a onClick="downLoadFile('/service/api/PaperAnswer/DownloadLocalPaper?paperId=${paperId}&actionType=2')" class="linkto" href='javascript:;'>下载答案</a>`
        } else {
          return '无'
        }
      },
      async downLoadFile (api) {
        let {
          data :
            {
              fileName
            }
        } = await this.$api.examination.downLoadFile(api)
        window.open(fileName)
      },
      showUploadDialog() {
        this.importDialog = true
        this.isAllImport = true
        this.file = []
      },
      //清除上传后的文件
      clearFile (val) {
        if (!val) {
          if (this.$refs.upload) {
            this.file && this.$refs.upload.clearFileName()
          }
          this.file = null
          this.progress = 0
        }
      },
      handleUpLoad({file}) {
        if (this.isAllImport) {
          this.file.push(file)
        } else {
          this.file = file
        }
      },
      updateProgress (p) {
        this.progress = p
      },
      async handleImport() {
        if (!this.file || this.file.length < 1) {
          this.$message.warning('请选择文件')
          return
        }
        let formdata;
        //判断是否是批量导入
        if (!this.isAllImport) {
          let {
            examId,
            courseCode,
            paperType
          } = this.importData
          formdata = this.$tools.createFormData({
            files : this.file,
            examId,
            courseCode,
            paperType
          })
        } else {
          let { file } = this
          let fileMap = {
            examId : this.requestForm.examId
          }
          file.forEach((item,index) => {
            fileMap['files'+index] = item
          })
          formdata = this.$tools.createFormData(fileMap)
        }
        let {
          status,
          data,
          message
        } = await this.$api.examination.uploadFiles(formdata,this.updateProgress)
        if (status === 1) {
          if (this.isAllImport) {
            this.importMsgDialog = true
            this.importInfo = data
          } else {
            if (data.fileName) {
              this.importMsgDialog = true
              this.importInfo = data
            } else {
              this.$message.success('导入成功')
            }
          }
          this.importDialog = false
          this.getPaperGridJson()
        }
      },
      showImportAnswerDialog ({row : { paperId }}) {
        this.importDialog = true
        this.isAllImport = false
        this.getImportParams(paperId)
      },
      async getImportParams (paperId) {
        let { data  } = await this.$api.examination.getPaperJson({
          paperId
        })
        this.importData = data
      },
      showUploadAnswerDialog (row) {
        this.uploadData = row
        this.uploadDialog = true
      },
      async uploadAnswer () {
        if (!this.file) {
          this.$message.warning('请先上传文件')
          return
        }
        let {
          examId,
          courseCode,
          paperType
        } = this.uploadData
        let formdata = this.$tools.createFormData({
          file : this.file,
          action : this.uploadFlag,
          examId,
          courseCode,
          paperType
        })
        let { status } = await this.$api.examination.uploadPaper(formdata,(p) => {
          this.progress = p
        })
        if (status === 1) {
          this.$message.success('上传成功')
          this.uploadDialog = false
          this.getPaperGridJson()
        }
      },
      getAnswerBtnText ({row: {questionCount}}) {
        return questionCount > 0 ? '查看明细' : '未设置'
      },
    },
    async mounted() {
      window.downLoadFile = this.downLoadFile
      await this.getEnableExamJson()
      this.getCourse()
      this.getPaperGridJson()
    },
    watch : {
      'importDialog' : {
        handler : 'clearFile'
      },
      'uploadDialog' : {
        handler : 'clearFile'
      }
    }
  }
</script>

<style lang="less" scoped>
    .upload-file {
        .title {
            color: #363940;
            font-size: 14px;
            margin-bottom: 10px;
        }
        /deep/.upload-content .el-button {
            padding: 0;
            width: 80px;
        }
        .progress-content {
            margin-top: 32px;
            .file-name {
                color: #626673;
                font-size: 13px;
            }
        }
        .tip {
            color: #9599A6;
            font-size: 13px;
            margin-top: 10px;
        }
    }
    .downTemplate {
        display: block;
        padding: 10px 0 30px 0;
        color: #3388FF;
        font-size: 13px;
        text-decoration: none;
    }

    .upLoadExplain {
        margin-bottom: 10px;
    }

    .form-conrainer {
        width: 360px;
        /deep/ .el-select {
            width: 100%;
        }
        /deep/.el-form-item__label {
            float: none;
        }
    }
    .progress-item {
        margin-top: 15px;
        span {
            color: #626673;
            font-size: 13px;
            margin-bottom: 8px;
        }
    }
    .download-file {
        color: #3388FF;
        font-size: 13px;
        text-decoration: none;
        /*display: block;*/
        margin-bottom: 5px;
    }
</style>

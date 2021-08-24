<template>
    <div>
        <oms-table-group
            title="考生管理"
            :selectList.sync="teaSelectList"
            :request-form="queryJson"
            :functionalityBtn="functionalityBtnList"
            :tableList="tableData"
            :tableHeaderList="tableHerder"
            :option="tableOption"
            :paginationOptions="pageOptions"
            @handleSelectionChange="handleSelectionChange"
            @search="getStudentInfoGridJson"
            @changePage="changePage"
            @sortChange="sortChange"
            @changeNum="changeNum"
        ></oms-table-group>
        <oms-custom-page
            :dialog.sync="delCustomDialog"
            title="批量删除考生"
        >
            <template v-slot:content>
                <span class="dialog-title">删除范围</span>
                <div class="del-status">
                    <el-radio-group v-model="delStatus">
                        <el-radio :label="0">选择的查询结果</el-radio>
                        <el-radio :label="1">全部查询结果</el-radio>
                    </el-radio-group>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="delCustomDialog = false" round>关闭</el-button>
                <el-button type="primary" round @click="delSelectStatus">确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="showImportDialog"
            title="考生信息导入"
        >
            <template v-slot:content class="uploadH">
                <slot>
                    <div class="upLoadExplain">
                        <div>1.请按照模板格式准备需要导入的数据</div>
                        <a :href="templateFile" target="_blank" class="downTemplate">下载学生导入数据模板</a>
                        <div>2.请选择需导入的文件，支持xls、xlsx格式，文件不得大于2M</div>
                    </div>
                </slot>
                <oms-upload-file ref="upload" :http-request="handleImport" fileSize="2"></oms-upload-file>
                <div class="import-tips">
                    <p class="tips">导入提示:</p>
                    <ul>
                        <li class="tip-item">
                            <div>(1).</div>
                            <div>导入文档应包含：<span v-for="item in importInfoText.allColList" :key="item">{{item}},</span>顺序无关。</div>
                        </li>
                        <li class="tip-item">
                            <div>(2).</div>
                            <div><span v-for="item in importInfoText.colList" :key="item">{{item}},</span>为必填项，内容不得为空；</div>
                        </li>
                        <li class="tip-item">
                            <div>(3).</div>
                            <div>同一导入模板中，考试科目与课程代码需一一对应；不同考试科目对应课程代码不得与系统中课程代码相同，否则将导入失败。</div>
                        </li>
                    </ul>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="showImportDialog = false" round>取 消</el-button>
                <el-button type="primary" round @click="handleUpload">导入</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page :dialog.sync="importMsgDialog" title="提示">
            <template v-slot:content>
                <div>
                    <div>
                        <span>导入完成，共导入</span>
                        <span style="color: #3388FF;">{{importMsgData.studentCount}}</span>
                        <span>条，失败</span>
                        <span style="color: #FE5958;">{{importMsgData.studentErrorResultCount}}</span>
                        <span>条；下载导入报告，查看原因</span>
                    </div>
                    <div style="margin-top: 17px" v-if="importMsgData.fileName">
                        <a class="download-file" :href="importMsgData.fileName" target="_blank">下载错误报告</a>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button type="primary" round @click="importMsgDialog = false" >确认</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  export default {
    name: 'stuManagement',
    components: {},
    data() {
      return {
        queryJson : {
          examId : '',
          placeId : '-1',
          batchId: '-1',
          levelId : '-1',
          subjectId : '-1',
          courseCode : '-1',
          paperType : '-1',
          studentInfo : ''
        },
        requestParams : {
          _search : false,
          nd : new Date().getTime(),
          rows: 30,
          page: 1,
          sidx: 'examBarCode',
          sord: 'asc'
        },
        deleteList: [], //批量删除
        teaSelectList: [
          {
            title: "考试批次",
            type: "select",
            isSearch: true,
            requestKey: "examId",
            label : 'examName',
            value : 'examId',
            data: [],
          },
          {
            title: "学习中心",
            type: "select",
            isSearch: true,
            requestKey : 'placeId',
            label : 'value',
            value : 'key',
            data: [],
          },
          {
            title: "批次",
            type: "select",
            requestKey: "batchId",
            label : 'value',
            value : 'key',
            data: []
          },
          {
            title: "层次",
            type: "select",
            requestKey: "levelId",
            label : 'value',
            value : 'key',
            data: []
          },
          {
            title: "专业",
            type: "select",
            requestKey: "subjectId",
            label : 'value',
            value : 'key',
            data: []
          },
          {
            title: "课程名称",
            type: "select",
            requestKey: "courseCode",
            label : 'value',
            value : 'key',
            data: []
          },
          {
            title: "卷别",
            type: "select",
            requestKey: "paperType",
            label : 'value',
            value : 'key',
            data: [
              {
                key : '-1',
                value : '全部'
              },
              {
                key : 'A',
                value : 'A'
              },
              {
                key : 'B',
                value : 'B'
              },
              {
                key : 'C',
                value : 'C'
              },
              {
                key : 'D',
                value : 'D'
              },
              {
                key : 'E',
                value : 'E'
              },
              {
                key : 'F',
                value : 'F'
              },
            ]
          },
          {
            title: "学生信息",
            type: "input",
            requestKey: "studentInfo",
            placeholder: '请输入学生证件号码、学号或姓名'
          }
        ],
        functionalityBtnList: [
          {
            title: "批量删除",
            funClick: () => this.delCustomDialog = true,
            disabled : this.isDisable
          },
          {
            title : '导入',
            funClick : this.importStudent
          },
          {
            title: "导出",
            funClick: this.handleExport,
            disabled : this.isDisable
          }
        ],
        tableOption: {
          ismultiple: true,
          isShowCustom: true,
        },
        tableHerder: [
          {
            title: "操作",
            width: '100',
            type: "buttons",
            fixed: "right",
            fixedPos: "right",
            align: "center",
            butList: [
              {
                title: "删除",
                onClick: this.delData,
              }
            ],
          },
        ],
        tableData: [],
        pageOptions: {
          small: false,
          pageSize: 30,
          total: 0,
          currentPage: 1,
          pageSizes: [20, 40, 60],
        },
        tableAnswerOption: {
          ismultiple : true,
          defaultProp : 'examBarCode',
          defaultSort : 'ascending'
        },
        delAllList : [],
        delStatus : null,
        delCustomDialog : false,
        customDialog: false,
        showImportDialog : false,
        file : null,
        importMsgDialog : false,
        importMsgData : {},
        templateFile : '',
        importInfoText : {}
      };
    },
    methods: {
      //获取表头
      getStudentField () {
        this.$api.studentManage.getStudentField({
          examId : this.queryJson.examId
        }).then(({data}) => {
          data.forEach(item => {
            item.title = item.colViewName
            item.prop = item.colName
            item.width = '150'
            item.sortable = 'custom'
          })
          this.tableHerder = [...data,...this.tableHerder]
        })
      },
      //获取数据
      getStudentInfoGridJson () {
        this.$api.studentManage.getStudentInfoGridJson({
          ...this.requestParams,
          queryJson : this.queryJson
        }).then(({data}) => {
          this.pageOptions = {
            ...this.pageOptions,
            total : data.records
          }
          this.tableData = data.rows
        })
      },
      //考试批次
      async getEnableExamJson () {
        let { data } = await this.$api.studentManage.getEnableExamJson()
        if (data.length) {
          this.$set(this.teaSelectList[0],'data',data)
          this.$set(this.queryJson,'examId',data[0].examId)
        }
      },
      //学习中心
      getExamStation () {
        this.$api.studentManage.getExamStation({
          examId : this.queryJson.examId
        }).then(({data}) => {
          let newList = [
            {
              value : '全部',
              key : '-1'
            },
            ...data
          ]
          this.$set(this.teaSelectList[1],'data',newList)
        })
      },
      //考试批次
      getExamBatch () {
        this.$api.studentManage.getExamBatch({
          examId : this.queryJson.examId
        }).then(({data}) => {
          let newList = [
            {
              value : '全部',
              key : '-1'
            },
            ...data
          ]
          this.$set(this.teaSelectList[2],'data',newList)
        })
      },
      //层次
      async getExamLevel () {
        this.$api.studentManage.getExamLevel({
          examId : this.queryJson.examId
        }).then(({data}) => {
          let newList = [
            {
              value : '全部',
              key : '-1'
            },
            ...data
          ]
          this.$set(this.teaSelectList[3],'data',newList)
        })
      },
      //专业
      getExamSubject () {
        this.$api.studentManage.getExamSubject({
          examId : this.queryJson.examId
        }).then(({data}) => {
          let newList = [
            {
              value : '全部',
              key : '-1'
            },
            ...data
          ]
          this.$set(this.teaSelectList[4],'data',newList)
        })
      },
      //课程名称
      getExamCourseCode () {
        this.$api.studentManage.getExamCourseCode({
          examId : this.queryJson.examId
        }).then(({data}) => {
          let newList = [
            {
              key : '-1',
              value : '全部'
            },
            ...data
          ]
          this.$set(this.teaSelectList[5],'data',newList)
        })
      },
      //排序
      sortChange ({prop,order}) {
        this.tableSort(this.requestParams,order,prop,'examBarCode')
        this.getStudentInfoGridJson()
      },
      clearFile (val) {
        if (!val) {
          this.file && this.$refs.upload.clearFileName()
          this.file = null
        }
      },
      getTemplateFile () {
        this.$api.studentManage.getStudentInfoImportTemplate({
          examId : this.queryJson.examId
        }).then(({data}) => {
            this.templateFile = data.fileName
        })
      },
      getStudentImportInfo () {
        this.$api.studentManage.getStudentImportInfo({
          examId : this.queryJson.examId
        }).then(({data}) => {
            this.importInfoText = data
        })
      },
      //导入
      async handleUpload () {
        if (!this.file) {
          this.$message.warning('请选择文件')
          return
        }
        let formdata = this.$tools.createFormData({
          file : this.file,
          examId : this.queryJson.examId
        })
        let { status ,data } = await this.$api.studentManage.studentInfoImport(formdata)
        if (status === 1) {
            this.showImportDialog = false
            let importData = {
              ...data.totalInfo,
              fileName : data.fileName
            }
            this.importMsgData = importData
            this.importMsgDialog = true
            this.getStudentInfoGridJson()
        }
      },
      handleImport ({file}) {
        this.file = file
      },
      delSelectStatus () {
        if (this.delStatus === null) {
          this.$message.warning('请选择批量删除范围')
        } else {
          if (this.delStatus === 0) {
            this.allDelet()
          } else if (this.delStatus === 1) {
            this.delQuery()
          }
        }
      },
      //单条删除
      async delData({row}) {
        this.$confirm('确定要删除该考生数据？删除后将不可恢复！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        }).then(async () => {
          let { examBarCode } = row
          let { status } = await this.$api.studentManage.deleteForm({
            examId : this.queryJson.examId,
            examBarCode
          })
          if (status === 1) {
            this.getStudentInfoGridJson()
            this.$message.success('删除成功')
          }
        }).catch(() => {});
      },
      // 批量删除
      async allDelet() {
        let len = this.delAllList.length
        if (len) {
          this.$confirm(`确定要删除选中的${len}条考生数据？删除后将不可恢复！`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            roundButton:true,
            type: 'warning'
          }).then(async () => {
            let { status } = await this.$api.studentManage.batchDelete({
              examId : this.queryJson.examId,
              examBarcodeList : this.delAllList
            })
            if (status === 1) {
              this.delCustomDialog = false
              this.getStudentInfoGridJson()
              this.$message.success('删除成功')
            }
          }).catch(() => {});
        } else {
          this.$message.warning('请选择批量删除的数据')
        }
      },
      async delQuery () {
        this.$confirm(`确定要删除全部${this.pageOptions.total}条考生数据？删除后将不可恢复！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        }).then(async () => {
          let { status } = await this.$api.studentManage.deleteQueryStudents(this.queryJson)
          if (status === 1) {
            this.delCustomDialog = false
            this.getStudentInfoGridJson()
            this.$message.success('删除成功')
          }
        }).catch(() => {});
      },
      //导出
      async handleExport () {
        let { data, status } = await this.$api.studentManage.excelOut(this.queryJson)
        if (status === 1) {
          window.open(data.fileName)
        }
      },
      handleSelectionChange(val) {
        let data = []
        val.forEach((item) => {
          data.push(item.examBarCode)
        });
        this.delAllList = data;
      },
      // 第几页
      changePage(p) {
        this.requestParams.page = p
        this.getStudentInfoGridJson()
      },
      changeNum (n) {
        this.requestParams.rows = n
        this.getStudentInfoGridJson()
      },
      examIdChange () {
        this.queryJson = {
          ...this.queryJson,
          placeId : '-1',
          batchId: '-1',
          levelId : '-1',
          subjectId : '-1',
          courseCode : '-1'
        }
        this.getExamStation()
        this.getExamBatch()
        this.getExamLevel()
        this.getExamSubject()
        this.getExamCourseCode()
      },
      importStudent () {
        this.showImportDialog = true
        this.getTemplateFile()
        this.getStudentImportInfo()
      }
    },
    async mounted() {
      await this.getEnableExamJson()
      this.getStudentField()
      this.getStudentInfoGridJson()
    },
    watch : {
      'queryJson.examId' : {
        handler: 'examIdChange'
      },
      'showImportDialog' : {
        handler : 'clearFile'
      }
    }
  };
</script>

<style lang="less" scoped>
    .import-tips {
        .tips {
            color: #363940;
            font-size: 14px;
            font-weight: bold;
            margin-top: 20px;
        }
    }
    .tip-item {
        display: flex;
        color: #9599A6;
        font-size: 13px;
        margin-top: 8px;
    }
    /deep/ .el-dialog__body {
        max-height: 70%;
        overflow-y: auto;
    }
    .del-status {
        box-sizing: border-box;
        padding-top: 15px;
        /deep/.el-radio-group {
            display: flex;
            flex-direction: column;
        }
        /deep/.el-radio {
            margin-top: 8px;
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
        margin-bottom: 16px;
    }
    .download-file {
        color: #3388FF;
        font-size: 13px;
        text-decoration: none;
    }
</style>

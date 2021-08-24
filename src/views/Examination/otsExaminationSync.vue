<template>
    <div class="ots-examination">
        <oms-table-group
            :selectList="teaSelectList"
            :functionality-btn="functionalityBtn"
            :request-form="queryJson"
            :tableHeaderList="tableHeader"
            :option="tableOptions"
            :paginationOptions="pageOptions"
            :tableList="tableList"
            title="OTS试卷同步"
            @search="getSyncOtsPaperList"
            @sortChange="sortChange"
            @changePage="changePage"
            @changeNum="changeNum"
        />
        <oms-custom-page
            :dialog.sync="rulesDialog"
            title="自动关联规则"
        >
            <template v-slot:content>
                <div class="rules-dialog-content">
                    <div class="checkbox-content">
                        <el-checkbox true-label="1" false-label="0" v-model="setRulesParams.isSameOTS">与OTS中课程编码一致</el-checkbox>
                        <el-checkbox true-label="1" false-label="0" v-model="setRulesParams.isOTSEnable">仅匹配OTS中启用试卷</el-checkbox>
                        <el-checkbox true-label="1" false-label="0" v-model="setRulesParams.isNameRules">匹配命名规则</el-checkbox>
                    </div>
                    <div class="tag-content mb16">
                        <span
                            class="tag"
                            v-for="item in tagList"
                            :key="item"
                            @click="selectTag(item)"
                        >#{{item}}#</span>
                    </div>
                    <div class="text-input">
                        <el-input
                            type="textarea"
                            :autosize="true"
                            resize="none"
                            placeholder="请输入命名规则"
                            v-model="setRulesParams.nameRules">
                        </el-input>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="rulesDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="setOTSAutoRelationRules">确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="otsExaminationDialog"
            isFullScreen
            title="关联试卷"
        >
            <template v-slot:content>
                <oms-refer
                    :selectList="examinationSelectList"
                    :request-form="examinationQueryJson"
                    @search="getOTSPaperList"
                />
                <oms-table
                    ref="omsTable"
                    :tableHeaderList="examinationTableHeader"
                    :tableList="examinationTableList"
                    :option="examinationTableOptions"
                    @handleCurrentChange="handleCurrentChange"
                />
            </template>
            <template v-slot:footer>
                <el-button @click="otsExaminationDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="confrimRelationExamination">确认</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  export default {
    name: "otsExaminationSync",
    data () {
      return {
        teaSelectList : [
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
            title : '关联状态',
            type: "select",
            requestKey: "relationState",
            label: 'label',
            value: 'value',
            data : [
              {
                label : '全部',
                value : '',
              },
              {
                label : '已关联',
                value : '已关联',
              },
              {
                label : '未关联',
                value : '未关联',
              }
            ]
          },
          {
            title : '答案同步',
            type: "select",
            requestKey: "answerSyncState",
            label: 'label',
            value: 'value',
            data : [
              {
                label : '全部',
                value : '',
              },
              {
                label : '已同步',
                value : '已同步',
              },
              {
                label : '未同步',
                value : '未同步',
              }
            ]
          },
          {
            title : '试卷信息',
            type : 'input',
            requestKey : 'keyword',
            placeholder : '请输入试卷信息'
          }
        ],
        examinationSelectList : [
          {
            title: "课程",
            type: "select",
            isSearch: true,
            requestKey: "courseCode",
            label: 'name',
            value: 'code',
            data: [],
            change : this.changeCourse
          },
          {
            title: "状态",
            type: "select",
            requestKey: "isOTSEnable",
            label: 'key',
            value: 'value',
            data: [
              {
                key : '全部',
                value : -1
              },
              {
                key : '启用',
                value : 1
              },
              {
                key : '停用',
                value : 0
              }
            ],
          },
          {
            title : '试卷名称',
            type : 'input',
            placeholder : '请输入试卷名称',
            requestKey: "keyword"
          }
        ],
        functionalityBtn : [
          {
            title : '自动关联规则',
            type : 'text',
            funClick : this.getOTSAutoRelationRules
          },
          {
            title : '自动关联',
            funClick : this.setAutoRules,
            disabled : this.isDisable
          },
          {
            title : '批量同步答案',
            funClick : this.showSyncAnswer
          }
        ],
        queryJson : {
          examId : '',
          courseCode : '',
          paperType : '',
          relationState : '',
          answerSyncState : '',
          keyword : '',
          page : 1,
          rows : 30,
          sidx : 'courseCode',
          sord : 'asc'
        },
        examinationQueryJson : {
          courseCode : '-1',
          courseName : '',
          isOTSEnable : -1,
          keyword : '',
          paperId : ''
        },
        tableHeader : [
          {
            title : '考试批次',
            prop : 'examName',
            sortable: 'custom'
          },
          {
            title : '课程名称',
            prop : 'courseName',
            sortable: 'custom'
          },
          {
            title : '卷别',
            prop : 'paperType',
            sortable: 'custom'
          },
          {
            title : '关联试卷',
            prop : 'relationState',
            sortable: 'custom',
            formatter : this.relationExamination
          },
          {
            title : '答案同步',
            prop : 'answerSyncState',
            sortable: 'custom'
          },
          {
            title : '操作',
            type : 'buttons',
            width : '220'
          }
        ],
        tableOptions : {},
        pageOptions : {
          total : 0,
          pageSize: 30,
        },
        tableList : [],
        rulesDialog : false,
        setRulesParams : {
          isOTSEnable : '0',
          isSameOTS : '0',
          isNameRules : '0',
          nameRules : ''
        },
        tagList : ['考试批次名称','课程名称','课程编码','卷别'],
        otsExaminationDialog : false,
        examinationTableHeader : [
          {
            title : '试卷名称',
            prop : 'courseName'
          },
          {
            title : '课程',
            prop : 'paperName'
          },
          {
            title : '创建',
            prop : 'createDate'
          },
          {
            title : '状态',
            prop : 'isEnabled',
            formatter : this.getExaminationState
          },
          {
            title : '预览',
            formatter : this.previewExamination
          }
        ],
        examinationTableList : [],
        examinationTableOptions : {
          isHideSetting : true
        },
        relationData : null
      }
    },
    methods : {
      //考试批次
      async getEnableExamJson() {
        let {data} = await this.$api.teacher.getTestPlan()
        this.$set(this.teaSelectList[0], 'data', data)
        this.queryJson.examId = data[0].examId
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
      async getSyncOtsPaperList () {
        let { data } = await this.$api.examination.getSyncOtsPaperList(this.queryJson)
        data.rows.forEach(item => {
          let butList = [
            {
              title : '关联试卷',
              onClick : this.relationPaper,
              formatter : this.isDisanbedBtn
            }
          ]
          if (item.relationState !== '未关联') {
            butList.push({
              title : '取消关联',
              onClick : this.cancelRelation,
              formatter : this.isDisanbedBtn
            })
            butList.push({
              title : '同步答案',
              onClick : this.asyncAnswer,
              formatter : this.isDisanbedBtn
            })
          }
          item.butList = butList
        })
        this.tableList = data.rows
        this.pageOptions.total = data.records
      },
      isDisanbedBtn : ({row : {isScan}}) => isScan > 0,
      //获取关联课程
      async relationPaper ({row : {paperId}}) {
        this.otsExaminationDialog = true
        this.examinationQueryJson.paperId = paperId
        let { data } = await this.$api.examination.getOTSCourseJson({
          paperId
        })
        this.$set(
          this.examinationSelectList[0],
          'data',
          [{code : '-1',name : '全部'},...data]
        )
      },
      //获取关联列表
      async getOTSPaperList () {
        if (this.examinationQueryJson.courseCode === '-1' && !this.examinationQueryJson.keyword) {
          this.$message.error('条件为全部下,试卷名称不能为空')
          return
        }
        let { data } = await this.$api.examination.getOTSPaperList(this.examinationQueryJson)
        this.examinationTableList = data
      },
      handleCurrentChange (val) {
        this.relationData = val
      },
      //取消关联
      async cancelRelation ({row : { paperId }}) {
        let { status } = await this.$api.examination.unRelationOnePaper({
          paperId
        })
        if (status === 1) {
          this.$message.success('取消关联成功')
          this.getSyncOtsPaperList()
        }
      },
      //同步答案
      async asyncAnswer ({row : { paperId }}) {
        let { status, message } = await this.$api.examination.answerSyncOnePaper({paperId})
        if (status === 1) {
          this.$message.success(message)
          this.getSyncOtsPaperList()
        }
      },
      clearCurrentRow (val) {
        if (!val) {
          this.$refs['omsTable'] && this.$refs['omsTable'].setCurrent()
        }
      },
      //关联试卷
      async confrimRelationExamination () {
        if (!this.relationData) {
          this.$message.warning('请选择关联的试卷')
          return
        }
        let { paperId,paperName } = this.relationData
        let { status } = await this.$api.examination.relationOnePaper(
          {
            omsPaperId : this.examinationQueryJson.paperId,
            otsPaperId : paperId,
            otsPaperName : paperName
          }
        )
        if (status === 1) {
          this.$message.success('关联成功')
          this.otsExaminationDialog = false
          this.relationData = null
          this.getSyncOtsPaperList()
        }
      },
      //自动关联规则
      async getOTSAutoRelationRules () {
        this.rulesDialog = true
        let { data } = await this.$api.examination.getOTSAutoRelationRules()
        this.setRulesParams = data
      },
      autoRelationRulesCheck () {
        let {
          isOTSEnable,
          isSameOTS,
          isNameRules,
          nameRules
        } = this.setRulesParams
        if (isOTSEnable === '0' && isSameOTS === '0' && isNameRules === '0' && !nameRules) {
          this.$message.warning('【与OTS中课程编码一致】与【匹配命名规则】至少选择一项')
          return false
        }
        if (isSameOTS === '0' && !nameRules) {
          this.$message.warning('【与OTS中课程编码一致】与【匹配命名规则】至少选择一项')
          return false
        }
        if (isOTSEnable === '0' && isSameOTS === '0' && isNameRules === '0') {
          this.$message.warning('【与OTS中课程编码一致】与【匹配命名规则】至少选择一项')
          return false
        }
        return true
      },
      //设置自动关联规则
      async setOTSAutoRelationRules () {
        if (!this.autoRelationRulesCheck()) return;
        let { status, message } = await this.$api.examination.setOTSAutoRelationRules(this.setRulesParams)
        if (status === 1) {
          this.$message.success(message)
          this.rulesDialog = false
        }
      },
      //自动关联
      async setAutoRules () {
        let {
          examId,
          courseCode,
          paperType,
          relationState,
          answerSyncState,
          keyword
        } = this.queryJson
        let { status, message } = await this.$api.examination.setAutoRelation({
          examId,
          courseCode,
          paperType,
          relationState,
          answerSyncState,
          keyword
        })
        if (status === 1) {
          this.$message.success(message)
        }
      },
      selectTag (name) {
        let { nameRules } = this.setRulesParams
        this.setRulesParams.nameRules = nameRules += `【#${name}#】`
      },
      showSyncAnswer () {
        this.$confirm('确定进行批量同步答案操作?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        }).then(() => {
          this.asynccAnswer()
        }).catch(() => {});
      },
      //批量同步答案
      async asynccAnswer () {
        let {
          examId,
          courseCode,
          paperType,
          relationState,
          answerSyncState,
          keyword
        } = this.queryJson
        let { status, message } = await this.$api.examination.autoAnswerSync(
          {
            examId,
            courseCode,
            paperType,
            relationState,
            answerSyncState,
            keyword
          }
        )
        if (status === 1) {
          this.$message.success(message)
          this.getSyncOtsPaperList()
        }
      },
      changePage (p) {
        this.queryJson.page = p
        this.getSyncOtsPaperList()
      },
      changeNum (n) {
        this.queryJson.rows = n
        this.getSyncOtsPaperList()
      },
      sortChange ({prop,order}) {
        this.tableSort(this.queryJson,order,prop,'courseCode')
        this.getSyncOtsPaperList()
      },
      changeCourse (val) {
        this.examinationSelectList[0].data.forEach(item => {
          if (item.code === val) {
            this.examinationQueryJson.courseName = item.name
          }
        })
      },
      relationExamination ({row : { relationState,otsPaperId,examId }}) {
        if (relationState === '未关联') {
          return relationState
        } else {
          return `<a href="/Service/Api/PaperAnswer/PreviewOTSPaper?paperId=${otsPaperId}&examId=${examId}" class="linkto" target="_blank">${relationState}</a>`
        }
      },
      getExaminationState ({ row : { isEnabled }}) {
        return isEnabled === 1?'启用':'停用'
      },
      previewExamination ({row : { paperId }}) {
        return `<a href="/Service/Api/PaperAnswer/PreviewOTSPaper?paperId=${paperId}&examId=${this.queryJson.examId}" class="linkto" target="_blank" >预览</a>`
      }
    },
    async mounted () {
      await this.getEnableExamJson()
      await this.getCourse()
      this.getSyncOtsPaperList()
    },
    watch : {
      'otsExaminationDialog' : {
        handler : 'clearCurrentRow'
      }
    }
  }
</script>

<style scoped lang="less">
    .checkbox-content {
        display: inline-flex;
        flex-direction: column;
        /deep/.el-checkbox {
            margin-bottom: 8px;
        }
    }
    .text-input {
        width: 300px;
        margin-top: 10px;
        /deep/.el-textarea__inner {
            color: #333;
            font-size: 12px;
        }
    }
    .paper-list {
        /deep/.pagination-container {
            display: none!important;
        }
    }
</style>

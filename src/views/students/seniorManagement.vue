<template>
    <div class="senior-management-container">
        <oms-table-group
            :selectList="teaSelectList"
            :request-form="queryJson"
            :title="pageTitle"
            :functionalityBtn="functionalityBtnList"
            :tableList="tableData"
            :tableHeaderList="tableHerder"
            :option="tableOption"
            :paginationOptions="pageOptions"
            @handleSelectionChange="handleSelectionChange"
            @changePage="changePage"
            @changeNum="changeNum"
            @search="search"
            @sortChange="sortChange"
        ></oms-table-group>
        <oms-custom-page
            :dialog.sync="isShowViolation"
            title="设为违纪"
        >
            <template v-slot:content>
                <el-radio-group v-model="violationState">
                    <el-radio
                        v-for="vItem in violationList"
                        :key="vItem.value"
                        :label="vItem.value"
                    >{{vItem.key}}</el-radio>
                </el-radio-group>
            </template>
            <template v-slot:footer>
                <el-button @click="isShowViolation = false" round>关闭</el-button>
                <el-button type="primary" round @click="setViolation">确 定</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  export default {
    name: "seniorManagement",
    data () {
      return {
        teaSelectList : [
          {
            title : '考试批次',
            type : 'select',
            requestKey : 'examId',
            label : 'examName',
            value : 'examId',
            isSearch : true,
            data : []
          },
          {
            title : '学习中心',
            type : 'select',
            requestKey : 'placeId',
            label : 'value',
            value : 'key',
            data : []
          },
          {
            title : '课程名称',
            type : 'select',
            requestKey : 'courseId',
            isSearch : true,
            label : 'value',
            value : 'key',
            data : [
              {
                value : '全部',
                key : '-1'
              }
            ]
          },
          {
            title : '卷别',
            type : 'select',
            requestKey : 'paperType',
            label : 'value',
            value : 'key',
            data : [
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
            title : '状态',
            type : 'select',
            requestKey : 'state',
            label : 'value',
            value : 'key',
            data : [
              {
                key : '-1',
                value : '全部'
              }
            ]
          },
          {
            title : '异常状态',
            type : 'select',
            requestKey : 'doubtState',
            label : 'value',
            value : 'key',
            data : [
              {
                key : '-1',
                value : '全部'
              },
              {
                key : '0',
                value : '无'
              },
              {
                key : '1',
                value : '疑似缺考'
              },
              {
                key : '2',
                value : '多重标记'
              },
            ]
          },
          {
            title : '评阅标记',
            type : 'select',
            requestKey : 'markType',
            label : 'value',
            value : 'key',
            data : [
              {
                key : '-1',
                value : '全部'
              },
              {
                key : '-3',
                value : '有'
              },
              {
                key : '-2',
                value : '无'
              },
              {
                key : '1',
                value : '答案雷同'
              },
              {
                key : '2',
                value : '笔迹雷同'
              },
              {
                key : '3',
                value : '多种笔迹'
              },
              {
                key : '4',
                value : '作答与考题不符'
              },
              {
                key : '5',
                value : '其他'
              }
            ]
          },
          {
            title : '质检状态',
            type : 'select',
            requestKey : 'qualityStatus',
            label : 'value',
            value : 'key',
            data : [
              {
                key : '0',
                value : '全部'
              },
              {
                key : '1',
                value : '未质检'
              },
              {
                key : '2',
                value : '已通过'
              },
              {
                key : '3',
                value : '已订正'
              },
              {
                key : '4',
                value : '需重评'
              },
              {
                key : '5',
                value : '再质检'
              },
            ]
          },
          {
            title : '学生信息',
            type : 'input',
            requestKey : 'studentInfo',
            placeholder : '请输入学生姓名或号码'
          }
        ],
        requestForm : {},
        pageTitle : '高级管理',
        functionalityBtnList : [
          {
            title : '设为违纪',
            funClick : this.showViolation,
            disabled : this.isDisable
          },
          {
            title : '设为缺考',
            funClick : this.showViolation,
            disabled : this.isDisable
          },
          {
            title : '设为未评阅',
            funClick : this.showViolation,
            disabled : this.isDisable
          }
        ],
        tableData : [],
        tableHerder : [],
        tableOption : {
          ismultiple : true,
          defaultProp : 'examBarCode',
          defaultSort : 'ascending'
        },
        pageOptions : {
          page : 1,
          total : 0,
          pageSize : 30
        },
        queryJson : {
          examId : '',
          placeId : '-1',
          courseId : '-1',
          paperType : '-1',
          state : '-1',
          doubtState : '-1',
          studentInfo : '',
          markType : '-1',
          qualityStatus : '0'
        },
        requestParams : {
          _search : false,
          nd : new Date().getTime(),
          rows: 30,
          page: 1,
          sidx: 'examBarCode',
          sord: 'asc'
        },
        violationList : [],
        selectViolationList : [],
        isShowViolation : false,
        violationState : null
      }
    },
    methods : {
      //获取列表
      getHighManageList () {
        this.$api.studentManage.getHighManageList({
          ...this.requestParams,
          queryJson : this.queryJson,
        }).then(({data : { records, rows }}) => {
          this.$set(this.pageOptions,'total',records)
          rows.forEach(item => {
            let butList = []
            if (item.havePic === 1) {
              butList.push({
                title : '试卷',
                onClick : this.goSeniorDetail
              })
            }
            if (item.haveSignPic === 1) {
              butList.push({
                title : '签到表',
                onClick : this.goSeniorSign
              })
            }
            item.butList = butList
          })
          this.tableData = rows
        })
      },
      goSeniorDetail ({ row : { examBarCode } }) {
        this.linkTo({
          path : '/senior-management-detail',
          query : {
            examBarCode
          }
        })
      },
      goSeniorSign ({row : {examId, testPaperPackageNumber}}) {
        this.router.push({
          path : '/senior-sign',
          query : {
            examId,
            packageNumber : testPaperPackageNumber
          }
        })
      },
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
          let defaultHeader = [
            {
              title: '评阅标记',
              prop: 'feedback',
              sortable: 'custom',
              width : 150
            },
            {
              title: '评阅状态',
              prop: 'stateName',
              sortable: 'custom',
              width : 150
            },
            {
              title: '质检状态',
              prop: 'qualityStateName',
              sortable: 'custom',
              width : 150
            },
            {
              title: '异常状态',
              prop: 'doubtStateName',
              sortable: 'custom',
              width : 150
            },
            {
              title: '客观题分数',
              prop: 'objectiveScore',
              sortable: 'custom',
              width : 150
            },
            {
              title: '主观题分数',
              prop: 'subjectiveScore',
              sortable: 'custom',
              width : 150
            },
            {
              title: '总分',
              prop: 'score',
              sortable: 'custom',
              width : 150
            },
            {
              title : '操作',
              fixed : 'right',
              fixedPos : 'right',
              width : '150',
              type : 'buttons'
            }
          ]
          this.tableHerder = [...data,...defaultHeader]
        })
      },
      //学习中心
      getExamStation () {
        this.$api.studentManage.getExamPlace({
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
      async getEnableExamJson () {
        let { data } = await this.$api.studentManage.getEnableExamJson()
        if (data.length) {
          this.$set(this.teaSelectList[0],'data',data)
          this.$set(this.queryJson,'examId',data[0].examId)
        }
      },
      //获取状态
      getCheckState () {
        this.$api.studentManage.getCheckState().then(({data}) => {
          this.$set(this.teaSelectList[4],'data',[
            ...this.teaSelectList[4].data,
            ...data
          ])
        })
      },
      //获取课程
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
          this.$set(this.teaSelectList[2],'data',newList)
        })
      },
      search () {
        this.$set(this.requestParams,'page',1)
        this.getHighManageList()
      },
      handleSelectionChange (val) {
        let selectViolationList = []
        val.forEach(item => {
          selectViolationList.push(item.examBarCode.toString())
        })
        this.selectViolationList = selectViolationList
      },
      changePage (p) {
        this.requestParams.page = p
        this.getHighManageList()
      },
      changeNum (n) {
        this.requestParams.rows = n
        this.getHighManageList()
      },
      async examIdChange () {
        this.getExamStation()
        this.getExamCourseCode()
        this.queryJson = {
          ...this.queryJson,
          placeId : '-1',
          courseId : '-1'
        }
      },
      async highManageCheckState () {
        let { data } = await this.$api.studentManage.highManageCheckState()
        this.violationList = data.filter(item => item.value !== 1)
      },
      showViolation (item) {
        if (!this.selectViolationList.length) {
          this.$message.warning(`请选择需要${item.title}的数据`)
        } else {
          if (item.title === '设为违纪') {
            this.isShowViolation = true
          }
          if (item.title === '设为缺考') {
            this.violationState = 1
            this.setViolationRequest()
          }
          if (item.title === '设为未评阅') {
            this.violationState = 4
            this.setViolationRequest()
          }
        }
      },
      async setViolation () {
        if (!this.violationState) {
          this.$message.warning('请选择需要设置的记录')
        } else {
          this.setViolationRequest()
        }
      },
      async setViolationRequest () {
        let { status, message } = await this.$api.studentManage.saveHighManagePaperState({
          examBarCodes : this.selectViolationList.toString(),
          state : this.violationState
        })
        if (status === 1) {
          this.getHighManageList()
          this.$message.success(message)
          this.violationState = null
        }
        this.isShowViolation = false
      },
      sortChange ({prop,order}) {
        this.tableSort(this.requestParams,order,prop,'examBarCode')
        this.getHighManageList()
      }
    },
    async mounted () {
      await this.getEnableExamJson()
      this.getHighManageList()
      this.getStudentField()
      this.getCheckState()
      this.highManageCheckState()
    },
    watch : {
      'queryJson.examId' : {
        handler: 'examIdChange'
      }
    }
  }
</script>

<style scoped>

</style>

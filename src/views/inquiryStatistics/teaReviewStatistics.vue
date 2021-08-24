<template>
    <div>
        <oms-table-group
            title="教师评阅统计"
            :selectList="queryList"
            :request-form="requestParams"
            :tableHeaderList="tableHeader"
            :tableList="tableData"
            :paginationOptions="pageOptions"
            :option="tableOption"
            :functionalityBtn="functionalityBtnList"
            :showChart="showChart"
            @search="search"
            @changePage="changePage"
            @changeNum="changeNum"
            @sortChange="sortChange"
        >
            <template v-slot:chart>
                <div class="charts-container" ref="chartsContainer">
                    <div class="histogram-charts-container">
                        <div class="histogram-charts charts-item" ref="histogramChart"></div>
                    </div>
                    <div class="pie-charts-container">
                        <div class="pie-charts charts-item" ref="pieCharts"></div>
                    </div>
                </div>
            </template>
        </oms-table-group>
        <oms-custom-page
            :dialog.sync="detailDialog"
            title="教师评阅明细"
            is-full-screen
        >
            <template v-slot:content>
                <oms-table-group
                    :selectList="queryDetailList"
                    :request-form="requestDetailParams"
                    :tableHeaderList="tableDetailHeader"
                    :tableList="tableDetailData"
                    :paginationOptions="pageOptions"
                    :option="tableDetailOptions"
                    @search="getDetailList"
                    @changePage="changeDetailPage"
                    @changeNum="changeDetailNum"
                    @sortChange="sortDetailChange"
                />
            </template>
        </oms-custom-page>
        <oms-custom-page
          title="评阅统计导出"
          :dialog.sync="exportantDialog"
        >
        <template slot="content">
            <div class="checkedTitle">
              请选择需要导出的附加信息，如无需附加信息，请直接点击“确认”。
            </div>
            <el-form ref="exportForm" :model="exportForm" class="exportForm">
              <el-form-item>
                  <el-checkbox-group v-model="exportForm.checkeds" @change="handleChange">
                    <el-checkbox label="cardNumber">身份证号</el-checkbox>
                    <el-checkbox label="studentId">学号/工号</el-checkbox>
                    <el-checkbox label="mobile">手机号</el-checkbox>
                    <el-checkbox label="userGroup">单位</el-checkbox>
                    <el-checkbox label="bankProvince">开户行省</el-checkbox>
                    <el-checkbox label="bankCity">开户行市</el-checkbox>
                    <el-checkbox label="bankName">开户行</el-checkbox>
                    <el-checkbox label="bankCardNumber">银行卡号</el-checkbox>
                    <el-checkbox label="userGroupType">类型</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template slot="footer">
          <el-button round @click="exportantDialog = false">取消</el-button>
          <el-button type="primary" @click="handleExport" round>导出</el-button>
        </template>
      </oms-custom-page>
    </div>
</template>

<script>
  const COLOR_STYLE = [
    [
      {
        offset : 0,
        color : '#1FCCAF'
      },
      {
        offset : 1,
        color : '#16B8D9'
      }
    ],
    [
      {
        offset : 0,
        color : '#4552E6'
      },
      {
        offset : 1,
        color : '#9130F2'
      }
    ]
  ]
  export default {
    name: "teaReviewStatistics",
    data () {
      return {
        queryList : [
          {
            title : '考试批次',
            type : 'select',
            label : 'examName',
            value : 'examId',
            isSearch: true,
            requestKey: "examId",
            data : []
          },
          {
            title : '课程名称',
            type : 'select',
            isSearch: true,
            requestKey: "courseCode",
            label: 'courseName',
            value: 'courseCode',
            data: [],
          },
          {
            title : '卷别',
            type : 'select',
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
            title : '教师信息',
            type : 'input',
            placeholder : '请输入教师信息',
            requestKey : 'userInfo'
          }
        ],
        queryDetailList : [
          {
            title : '考生信息',
            type : 'input',
            placeholder : '请输入考生信息',
            requestKey : 'studentInfo'
          }
        ],
        requestParams : {
          examId : null,
          courseCode : '',
          paperType : '',
          userInfo : '',
          page:1,
          rows:30, //每页条数
          sord:"asc",
          sidx:"examId", // 排序字段
        },
        requestDetailParams : {
          studentInfo : '',
          paperId : '',
          teacherId : '',
          page:1,
          rows:30, //每页条数
          sord:"asc",
          sidx:"studentName", // 排序字段
        },
        tableHeader : [
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
            title: '教师用户名',
            prop: 'userName',
            sortable: 'custom'
          },
          {
            title: '教师姓名',
            prop: 'realName',
            sortable: 'custom'
          },
          {
            title: '待评阅',
            prop: 'waitJudgeNum',
            sortable: 'custom'
          },
          {
            title: '已评阅(个人/总)',
            prop: 'individualReview',
            sortable: 'custom',
            formatter:(scope)=> {
              return `${scope.row.teacherdoJudgeNum}/${scope.row.doJudgeNum}`
            }
          },
          {
            title: '待质检',
            prop: 'waitQuality',
            sortable: 'custom'
          },
          {
            title: '质检通过',
            prop: 'passQuality',
            sortable: 'custom'
          },
          {
            title: '质检已订正',
            prop: 'editQuality',
            sortable: 'custom'
          },
          {
            title: '质检不通过',
            prop: 'notPassQuality',
            sortable: 'custom'
          },
          {
            title: '再质检',
            prop: 'reQuality',
            sortable: 'custom'
          },
          {
            title: '平均评阅时间',
            prop: ' reviewTime',
            sortable: 'custom',
            formatter : this.averageDate
          },
          {
            title: '操作',
            type : 'buttons',
            width : '100',
            butList : [
              {
                title : '查看明细',
                formatter : this.isLookDetail,
                onClick : this.lookDetail
              }
            ]
          },
        ],
        tableDetailHeader : [
          {
            title : '考生姓名',
            prop : 'studentName',
            sortable: 'custom'
          },
          {
            title : '证件号',
            prop : 'cardNumber',
            sortable: 'custom'
          },
          {
            title : '客观题分数',
            prop : 'objectiveScore',
            sortable: 'custom'
          },
          {
            title : '主观题分数',
            prop : 'subjectiveScore',
            sortable: 'custom'
          },
          {
            title : '总分数',
            prop : 'score',
            sortable: 'custom'
          },
          {
            title : '评阅时间',
            prop : 'tracks',
            sortable: 'custom',
            formatter : this.formatterTime
          }
        ],
        tableData : [],
        tableDetailData : [],
        pageOptions : {
          pageSize : 30,
          total : 0
        },
        tableDetailOptions : {
          isHideSetting : true
        },
        pageDetailOptions : {
          pageSize : 30,
          total : 0
        },
        tableOption : {
          defaultProp: 'courseName',
          defaultSort: 'ascending'
        },
        functionalityBtnList : [
          {
            title: this.getBtnTitle,
            type:'text',
            funClick: this.changeCharts
          },
          {
            title : '导出',
            disabled : this.isDisableFun,
            funClick : ()=> {
              this.exportantDialog = true
            }
          }
        ],
        detailDialog : false,
        resultData : [],
        showChart : true,
        exportantDialog:false,
        exportForm: {
          checkeds: []
        }
      }
    },
    methods : {
      //考试批次
      async getEnableExamJson() {
        let { data } = await this.$api.studentManage.getEnableExamJson()
        this.$set(this.queryList[0], 'data', data)
        this.requestParams.examId = data[0].examId
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
            this.$set(this.queryList[1], 'data', newList)
          })
      },
      //数据列表
      getGridJsonForTeacher () {
        this.$api.inquiryStatistics.getGridJsonForTeacher(this.requestParams)
          .then(({ data : { records,rows } }) => {
            this.tableData = rows
            this.pageOptions.total = records
            this.getTotalJudgeForReview()
          })
      },
      search () {
        this.isGetResult = false
        this.getGridJsonForTeacher()
      },
      changeCharts () {
        this.showChart = !this.showChart
        if (!this.showChart) {
          this.$nextTick(this.initCharts)
        }
      },
      //统计
      getTotalJudgeForReview () {
        if (this.isGetResult) {
          this.sendSearchResult()
          return
        }
        let { examId, userInfo, courseCode, paperType } = this.requestParams
        this.$api.inquiryStatistics.getTotalJudgeForReview({
          examId, userInfo, courseCode, paperType
        })
          .then(({data : {
            waitJudgeNum,
            teacherdoJudgeNum,
            waitQuality,
            passQuality,
            editQuality,
            notPassQuality,
            reQuality
          }}) => {
            let resultData = [
              {
                key : '待评阅',
                value : waitJudgeNum
              },
              {
                key : '已评阅',
                value : teacherdoJudgeNum
              },
              {
                key : '待质检',
                value : waitQuality
              },
              {
                key : '质检通过',
                value : passQuality
              },
              {
                key : '质检已订正',
                value : editQuality
              },
              {
                key : '质检不通过',
                value : notPassQuality
              },
              {
                key : '再质检',
                value : reQuality
              }
            ]
            this.resultData = resultData
            this.sendSearchResult()
            this.isGetResult = true
            if (this.histogramChart || this.pieChart) {
              this.histogramChart.dispose()
              this.pieChart.dispose()
            }
            this.$refs.chartsContainer && this.initCharts()
          })
      },
      chartsColor (item) {
        return new this.$echarts.graphic.LinearGradient(0,0,0,1,COLOR_STYLE[item.dataIndex])
      },

      initCharts () {
        const xTitle = ['已评阅','待评阅']
        let histogramOptions = {
          title: [
            {
              text: '评阅数',
              left:0,
              textStyle: {
                color: '#2E3033',
                fontSize: 18,
                position:'bottom'
              }
            },
            {
              text: '（单位/份）',
              top:3,
              left:60,
              textStyle: {
                color:'#9299A6',
                fontSize: 12
              }
            },
          ],
          xAxis : {
            type : 'category',
            data : xTitle
          },
          yAxis : {
            type : 'value'
          },
          series : [
            {
              data: this.$tools.getEchartsNeedData(this.resultData,xTitle),
              barWidth : 40,
              type: 'bar',
              label : {
                show: true,
                position: 'top'
              },
              itemStyle : {
                normal : {
                  color : this.chartsColor
                }
              }
            }
          ]
        }
        let pieOptions = {
          title:
            {
              text: '评阅率',
              left:0,
              textStyle: {
                color: '#2E3033',
                fontSize: 18,
                position:'bottom'
              }
            },
          tooltip : {
            formatter : '{b} {d}%'
          },
          legend: {
            orient: 'center',
            bottom: 'bottom',
          },
          series : [
            {
              type : 'pie',
              radius: ['40%', '70%'],
              data : xTitle.map((item,index) => {
                return {
                  value : this.$tools.getEchartsNeedData(this.resultData,xTitle)[index],
                  name : item,
                  label : {
                    formatter: '{b|{b}}\n {d|{d}}%',
                    rich : {
                      b : {
                        fontSize : '12',
                        color : item === '已评阅'?'#43BFAB':'#8B5CE6'
                      },
                      d : {
                        fontSize : '20',
                        color : item === '已评阅'?'#43BFAB':'#8B5CE6'
                      }
                    }
                  }
                }
              }),
              itemStyle : {
                normal : {
                  color : this.chartsColor,
                }
              },
            }
          ]
        }

        this.histogramChart = this.$echarts.init(this.$refs.histogramChart)
        this.pieChart = this.$echarts.init(this.$refs.pieCharts)
        this.histogramChart.setOption(histogramOptions)
        this.pieChart.setOption(pieOptions)
      },
      listenWinResize () {
        window.addEventListener('resize', this.$tools.debounce(() => {
          this.histogramChart.resize()
          this.pieChart.resize()
        },200))
        this.$once('hook:beforeDestroy',() => {
          window.removeEventListener('resize',() => {})
        })
      },
      // 导出
      handleChange(value) {
        this.exportForm.checkeds = value
      },
      handleExport () {
        let { examId, userInfo, courseCode, paperType } = this.requestParams
        let { checkeds } = this.exportForm
        let queryExport = {
          filed:checkeds + '',
          examId,
          userInfo, 
          courseCode, 
          paperType
        }
        this.$api.inquiryStatistics.teacherJudegExcelOut(queryExport)
          .then(({status, data : { fileName }}) => {
            if (status === 1) {
              window.open(fileName)
            }
          })
      },
      averageDate ({row : { track, teacherdoJudgeNum  }}) {
        if (teacherdoJudgeNum === 0) {
          return '0分0秒'
        }
        let oneTime = parseInt(track / teacherdoJudgeNum)
        return `${parseInt(oneTime / 60)}分${oneTime % 60}秒`
      },
      isLookDetail ({row : { teacherdoJudgeNum }}) {
        return !teacherdoJudgeNum
      },
      lookDetail ({row : {paperId, userId}}) {
        this.requestDetailParams = Object.assign({
          ...this.requestDetailParams,
          studentInfo : '',
          paperId,
          teacherId : userId
        })
        if (!this.detailDialog) {
          this.detailDialog = true
        }
        this.getDetailList()
      },
      getDetailList () {
        this.$api.inquiryStatistics.getTeacherReviewStudentGrid(this.requestDetailParams)
          .then(({data : {records, rows}}) => {
            this.tableDetailData = rows
            this.pageDetailOptions.total = records
          })
      },
      formatterTime ({row : {tracks}}) {
        let m = tracks / 60
        let s = tracks % 60
        return `${parseInt(m)}分${parseInt(s)}秒`
      },
      changePage (p) {
        this.requestParams.page = p
        this.getGridJsonForTeacher()
      },
      changeDetailPage (p) {
        this.requestDetailParams.page = p
        this.getDetailList()
      },
      changeNum (n) {
        this.requestParams.rows = n
        this.getGridJsonForTeacher()
      },
      changeDetailNum (n) {
        this.requestDetailParams.rows = n
        this.getDetailList()
      },
      sortChange ({prop,order}) {
        this.tableSort(this.requestParams,order,prop,'courseName')
        this.getGridJsonForTeacher()
      },
      sortDetailChange ({prop,order}) {
        this.tableSort(this.requestDetailParams,order,prop,'studentName')
        this.getDetailList()
      },
      getBtnTitle () {
        return this.showChart?'显示图表统计':'显示查询明细'
      },
    },
    activated () {
      if (this.isGetResult) {
        this.getTotalJudgeForReview()
      }
    },
    async mounted () {
      this.listenWinResize()
      this.getCourse()
      await this.getEnableExamJson()
      this.getGridJsonForTeacher()
    }
  }
</script>

<style scoped lang="less">
    .charts-container {
        height: 400px;
        display: flex;
        .histogram-charts-container {
            height: 100%;
            width: 50%;
        }
        .pie-charts-container {
            height: 100%;
            width: 50%;
        }
        .charts-item {
            height: 100%;
        }
    }
    .exportForm {
      /deep/ .el-checkbox{
        color: #626773;
        margin-right: 16px;
        margin-bottom: 16px;
        width: 120px;
      }
    }
    .checkedTitle {
      margin-bottom: 8px;
      font-size: 14px;
    }
</style>

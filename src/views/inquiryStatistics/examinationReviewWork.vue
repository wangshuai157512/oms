<template>
    <div>
        <oms-table-group
            title="试卷评阅统计"
            :selectList="queryList"
            :request-form="requestParams"
            :tableHeaderList="tableHeader"
            :tableList="tableData"
            :paginationOptions="pageOptions"
            :option="tableOption"
            :functionalityBtn="functionalityBtnList"
            @search="getExamGridJson"
            @changePage="changePage"
            @changeNum="changeNum"
            @sortChange="sortChange"
        />
    </div>
</template>

<script>
  export default {
    name: "examinationReviewWork",
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
            data : [],
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
          }
        ],
        requestParams : {
          examId : null,
          courseCode : '',
          paperType : '',
          page:1,
          rows:30, //每页条数
          sord:"asc",
          sidx:"examId", // 排序字段
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
            title: '待评阅',
            prop: 'waitJudgeNum',
            sortable: 'custom'
          },
          {
            title: '已评阅',
            prop: 'doJudgeNum',
            sortable: 'custom'
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
            title: '质检未通过',
            prop: 'notPassQuality',
            sortable: 'custom'
          },
          {
            title: '再质检',
            prop: 'reQuality',
            sortable: 'custom'
          }
        ],
        tableData : [],
        pageOptions : {
          pageSize : 30,
          total : 0
        },
        tableOption : {
          defaultProp: 'courseName',
          defaultSort: 'ascending'
        },
        functionalityBtnList : [
          {
            title : '导出',
            funClick : this.exportData
          }
        ],
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
      getExamGridJson () {
        this.$api.inquiryStatistics.getExamGridJson(this.requestParams)
          .then(({data : { records,rows }}) => {
            this.tableData = rows
            this.pageOptions.total = records
            this.isGetResult = false
            this.getTotalJudgeForReview()
          })
      },
     //统计
      getTotalJudgeForReview () {
        if (this.isGetResult) {
          this.sendSearchResult()
          return
        }
        let { examId,courseCode, paperType } = this.requestParams
        this.$api.inquiryStatistics.getTotalJudgeForReview({
          examId,courseCode, paperType
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
          })
      },
      exportData () {
        this.$api.inquiryStatistics.paperJudegExcelOut(this.requestParams)
          .then(({ status, data : { fileName }}) => {
            if (status === 1) {
              window.open(fileName)
            }
          })
      },
      changePage (p) {
        this.requestParams.page = p
        this.getExamGridJson()
      },
      changeNum (n) {
        this.requestParams.rows = n
        this.getExamGridJson()
      },
      sortChange ({prop,order}) {
        this.tableSort(this.requestParams,order,prop,'examName')
        this.getExamGridJson()
      },
    },
    async mounted () {
      this.getCourse()
      await this.getEnableExamJson()
      this.getExamGridJson()
    }
  }
</script>

<style scoped>

</style>

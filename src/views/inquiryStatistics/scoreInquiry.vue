<template>
  <div>

    <oms-table-group
      :selectList.sync="teaSelectList" @search="search"
      :title="pageTitle"
      :request-form='requestForm'
      :functionalityBtn="functionalityBtnList"
      :explain="explainScore"
      :tableList="tableData"
      :tableHeaderList="tableHerder"
      :option="tableOption"
      :paginationOptions="pageOptions"
       @changePage="changePage"
       @changeNum="changeNum"
       @sortChange="sortChange"
    ></oms-table-group>
  </div>
</template>

<script>
export default {
  name: "scoreInquiry",
  components: {

  },
  data() {
    return {
      pageTitle:'',
      explainScore:"总成绩已取整，小题分数按实际显示。",
      requestForm : {
        page:1,
        rows:30, //每页条数
        sord:"asc",
        sidx:"examId", // 排序字段
        examId:null,
        batchId:-1, //入学批次Id
        subjectId:-1, //专业Id
        levelId:-1, //层次Id
        placeId:-1, //考点Id
        courseCode: "", //课程编码
        paperType:"", // 卷别
        state:-1, //状态
        markType:-1, //评阅标记
        qualityStatus:-1, // 质检状态
        studentInfo:''
      },
      teaSelectList: [
        {
          title: "考试批次",
          type: "select",
          isSearch: true,
          requestKey: "examId",
          label:"examName",
          value: "examId",
          change:()=> {
            this.getExamStation()
            this.getExamBatch()
            this.getExamLevel()
            this.getExamSubject()
            this.getExamCourseCode()
          },
          data: [

          ],
        },
        {
          title: "学习中心",
          type: "select",
          isSearch: true,
          requestKey: "placeId",
          label:"value",
          value: "key",
          data: [
              {
                key: -1,
                value: "全部",
              },
          ],
        },
        {
          title: "批次",
          type: "select",
          isSearch: true,
          requestKey: "batchId",
          label:"value",
          value: "key",
          data: [
              {
                key: -1,
                value: "全部",
              },
          ],
        },
        {
          title: "层次",
          type: "select",
          isSearch: true,
          requestKey: "levelId",
          label:"value",
          value: "key",
          data: [
              {
                key: -1,
                value: "全部",
              },
          ],
        },
        {
          title: "专业",
          type: "select",
          isSearch: true,
          requestKey: "subjectId",
          label:"value",
          value: "key",
          data: [
              {
                key: -1,
                value: "全部",
              },
          ],
        },
        {
          title: "考试科目",
          type: "select",
          isSearch: true,
          requestKey: "courseCode",
          label:"value",
          value: "key",
          data: [
              {
                key: "",
                value: "全部",
              },
          ],
        },
        {
          title: "卷别",
          type: "select",
          isSearch: true,
          requestKey: "paperType",
          label:"text",
          value: "id",
          data: [
              {
                id: "",
                text: "全部",
              },
              {
                id: "A",
                text: "A",
              },
              {
                id: "B",
                text: "B",
              },
              {
                id: "C",
                text: "C",
              },
              {
                id: "D",
                text: "D",
              },
              {
                id: "E",
                text: "E",
              },
              {
                id: "F",
                text: "F",
              },
          ],
        },
        {
          title: "状态",
          type: "select",
          isSearch: true,
          requestKey: "state",
          label:"text",
          value: "id",
          data: [
              {
                id: -1,
                text: "全部",
              },
              {
                id: "1",
                text: "未扫描",
              },
              {
                id: "2",
                text: "缺考",
              },
              {
                id: "3",
                text: "违纪",
              },
              {
                id: "4",
                text: "替考",
              },
              {
                id: "5",
                text: "未评阅",
              },
              {
                id: "6",
                text: "已评阅",
              },
          ],
        },
        {
          title: "评阅标记",
          type: "select",
          isSearch: true,
          requestKey: "markType",
          label:"text",
          value: "id",
          data: [
              {
                id: -1,
                text: "全部",
              },
              {
                id: "-3",
                text: "有",
              },
              {
                id: "-2",
                text: "无",
              },
              {
                id: "1",
                text: "答案雷同",
              },
              {
                id: "2",
                text: "笔迹雷同",
              },
              {
                id: "3",
                text: "多种笔迹",
              },
              {
                id: "4",
                text: "作答与考题不符",
              },
              {
                id: "5",
                text: "其他",
              },
          ],
        },
        {
          title: "质检状态",
          type: "select",
          isSearch: true,
          requestKey: "qualityStatus",
          label:"text",
          value: "id",
          data: [
              {
                id: -1,
                text: "全部",
              },
              {
                id: "1",
                text: "未质检",
              },
              {
                id: "2",
                text: "已通过",
              },
              {
                id: "3",
                text: "已订正",
              },
              {
                id: "4",
                text: "需重评",
              },
              {
                id: "5",
                text: "再质检",
              },
          ],
        },
        {
          title: "学生信息",
          type: "input",
          requestKey: "studentInfo",
          val: "",
          placeholder:"请输入学生姓名或号码"
        },
      ],
      tableOption:{
        ismultiple:false,
        isShowCustom : false,
        defaultProp : 'examId',
        defaultSort : 'ascending'
      },
      tableHerder:[
        {
          title:"考试批次",
          sortable : 'custom',
          width : '110',
          prop:"examId"
        },
        {
          title:"条号码",
          sortable : 'custom',
          width : '120',
          prop:"examBarCode"
        },
        {
          title:"区域",
          sortable : 'custom',

          prop:"stationArea"
        },
        {
          title:"学习中心",
          sortable : 'custom',
          width : '110',
          prop:"stationName"
        },
        {
          title:"答题卡袋条码",
          sortable : 'custom',
          width : '130',
          prop:"packageNumber"
        },
        {
          title:"课程名称",
          sortable : 'custom',
          width : '110',
          prop:"courseName"
        },
        {
          title:"入学批次",
          sortable : 'custom',
          width : '110',
          prop:"batchName"
        },
        {
          title:"层次",
          sortable : 'custom',
          prop:"levelName"
        },
        {
          title:"专业",
          prop:"subjectName"
        },
        {
          title:"姓名",
          sortable : 'custom',
          prop:"studentName",
        },
        {
          title:"证件号",
          sortable : 'custom',
          prop:"cardNumber",
        },
        {
          title:"卷别",
          sortable : 'custom',
          prop:"paperType"
        },
        {
          title:"学号",
          sortable : 'custom',
          prop:"studentId"
        },
        {
          title:"答题卡袋序号",
          sortable : 'custom',
          width : '130',
          prop:"packageIndex"
        },
        {
          title:"试卷袋序号",
          sortable : 'custom',
          width : '130',
          prop:"testPaperPackageIndex"
        },
        {
          title:"试卷袋条码号",
          sortable : 'custom',
          width : '130',
          prop:"testPaperPackageNumber"
        },
        {
          title:"评阅标记",
          sortable : 'custom',
          width : '110',
          prop:"markSet"
        },
        {
          title:"评阅状态",
          sortable : 'custom',
          width : '110',
          prop:"stateName"
        },
        {
          title:"质检状态",
          sortable : 'custom',
          width : '110',
          prop:"qualityStateName"
        },
        {
          title:"客观题分数",
          sortable : 'custom',
          width : '130',
          prop:"objectiveScore"
        },
        {
          title:"主观题分数",
          sortable : 'custom',
          width : '130',
          prop:"subjectiveScore"
        },
        {
          title:"总分",
          sortable : 'custom',
          fixed:'right',
          prop:"score"
        },
        {
          title:"操作",
          type:"buttons",
          align:"right",
          fixed:'right',
          width:'50',
          butList:[
            {
              title:"试卷",
              size : 'mini',
              disabled : false,
              onClick:this.textPaper
            }
          ]
        },

      ],
      functionalityBtnList:[
        {
          title:"成绩回传",
          disabled:true,
          funClick:this.resultsBack
        },
        {
          title:"导出成绩",
          disabled:true,
          funClick:this.exportScore
        },
        {
          title:"导出不及格率",
          disabled:true,
          funClick:this.exportFail
        },
        {
          title:"导出评阅标记考生",
          disabled:true,
          funClick:this.exportStu
        }
      ],  //功能按钮

      tableData: [],

      pageOptions: {
        small : false,
        pageSize : 30,
        total : 200,
        currentPage : 1,
        layout : 'total, sizes, prev, pager, next, jumper',
        pageSizes : [10,40,60]
      }
    };
  },
  methods: {
    search() {
      this.getscoreList()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getscoreList()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getscoreList()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              // 获取学习中心
              this.getExamStation()
              // 获取考试批次
              this.getExamBatch()
              // 获取层次
              this.getExamLevel()
              // 获取专业
              this.getExamSubject()
              // 获取考试科目
              this.getExamCourseCode()
              // 获取成绩查询列表
              this.getscoreList()
            }

        })
    },
    // 获取学习中心
    getExamStation() {
      this.$api.studentManage.getExamStation({examId:this.requestForm.examId}).then(res =>{
        let examStationList = [
          {
              key: -1,
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[1],'data',examStationList)
      })
    },
    // 获取考试批次
    getExamBatch() {
      this.$api.studentManage.getExamBatch({examId:this.requestForm.examId}).then(res =>{
        let examBatchList = [
          {
              key: -1,
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[2],'data',examBatchList)
      })
    },
    // 获取层次
    getExamLevel() {
      this.$api.studentManage.getExamLevel({examId:this.requestForm.examId}).then(res =>{
        let examLevelList = [
          {
              key: -1,
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[3],'data',examLevelList)
      })
    },
    // 获取层次
    getExamSubject() {
      this.$api.studentManage.getExamSubject({examId:this.requestForm.examId}).then(res =>{
        let examSubjectList = [
          {
              key: -1,
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[4],'data',examSubjectList)
      })
    },
    // 获取考试科目
    getExamCourseCode() {
      this.$api.studentManage.getExamCourseCode({examId:this.requestForm.examId}).then(res =>{
        let examCourseList = [
          {
              key: "",
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[5],'data',examCourseList)
      })
    },
    // 获取成绩查询列表
    getscoreList() {
      this.$api.inquiryStatistics.getScoreList(this.requestForm).then(res =>{
        this.tableData = res.data.rows
        this.pageOptions.total = res.data.records
        if(res.data.rows.length > 0) {

          this.functionalityBtnList = this.functionalityBtnList.map((item) => {
            item.disabled = false
            return item
          })
        }else {
          this.functionalityBtnList = this.functionalityBtnList.map((item) => {
            item.disabled = true
            return item
          })
        }
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getscoreList()
    },
    // 导出成绩
    exportScore() {
      let {examId,courseCode,paperType,batchId,levelId,subjectId,placeId,state,markType,studentInfo} = this.requestForm
      let requestStudentScore = {examId,courseCode,paperType,batchId,levelId,subjectId,placeId,state,markType,studentInfo}
      this.$api.inquiryStatistics.exportStudentScore(requestStudentScore).then(res =>{
         if(res.status) {
              window.open(res.data.fileName)
          }

      })
    },
    // 导出不及格率
    exportFail() {
      this.$api.inquiryStatistics.exportPassingRate({examId:this.requestForm.examId}).then(res =>{
        if(res.status) {
          this.$confirm(`剩余${res.data.notReview}份试卷未完成评阅，导出数据可能不是最终结果，是否确定导出?`, '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              roundButton:true,
              type: 'warning'
          }).then(() => {
            if(res.status) {
              window.open(res.data.fileName)
            }
          })
        }
      })
    },
    // 导出评阅标记考生
    exportStu() {
      let {examId,courseCode,paperType,batchId,levelId,subjectId,placeId,studentInfo} = this.requestForm
      let requestReadStudentScore = {examId,courseCode,paperType,batchId,levelId,subjectId,placeId,studentInfo}
      this.$api.inquiryStatistics.exportFeedBack(requestReadStudentScore).then(res =>{
         if(res.status) {
            window.open(res.data.fileName)
         }
      })
    },
    // 成绩回传
    resultsBack() {
      let {examId,courseCode,paperType,batchId,levelId,subjectId,placeId,state,studentInfo} = this.requestForm
      let requestScoreCallBack = {examId,courseCode,paperType,batchId,levelId,subjectId,placeId,state,studentInfo}
      this.$api.inquiryStatistics.exportScoreCallBack(requestScoreCallBack).then(res =>{
        console.log(res)
      })
    },
    textPaper(row){
      this.linkTo({
        path:"/inquirePaper",
        query: {
           examBarCode:row.row.examBarCode
        }
      })
    },

  },

  mounted() {
    this.pageTitle = this.$route.meta.childrenTitle
    this.getUseExamPlan()
  }
};
</script>

<style scoped>
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
</style>

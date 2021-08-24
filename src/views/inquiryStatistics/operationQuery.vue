<template>
  <div>
    <oms-table-group
      :selectList.sync="teaSelectList" @search="search"
      :title="pageTitle"
      :request-form='requestForm'
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
let queryJson ={}
export default {
  name: "operationQuery",
  components: {

  },
  data() {
    return {
      pageTitle:'',
      requestForm : {
        page:1,
        rows:30, //每页条数
        sord:"asc",
        sidx:"examId", // 排序字段
        examId:null,
        courseCode:"", //课程Id
        paperType:'', //卷别
        operateCode:'', //操作
        userId:'-1', //教师信息
        startTime :'', //开始时间
        endTime :'', //结束时间
        studentInfo:"", //学生信息
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
            this.getExamCourseCode()
          },
          data: [

          ],
        },
        {
          title: "课程名称",
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
          title: "教师信息",
          type: "select",
          isSearch: true,
          requestKey: "userId",
          label:"value",
          value: "key",
          data: [
              {
                key: '-1',
                value: "全部",
              },
          ],
        },
        {
          title: "操作类型",
          type: "select",
          isSearch: true,
          requestKey: "operateCode",
          label:"value",
          value: "key",
          data: [
              {
                key: '',
                value: "全部",
              },
              {
                key: 'txt',
                value: "文字",
              },
              {
                key: 'eraser',
                value: "橡皮擦",
              },
              {
                key: 'redraw',
                value: "撤销",
              },
              {
                key: 'clear',
                value: "清空",
              },
              {
                key: 'full',
                value: "全屏",
              },
              {
                key: 'b_close',
                value: "上关闭",
              },
              {
                key: 'b_submit"',
                value: "上提交",
              },
              {
                key: 'l_close',
                value: "下关闭",
              },
              {
                key: 'l_submit"',
                value: "下提交",
              },
              {
                key: 'slide"',
                value: "滑块",
              },
              {
                key: 'prev',
                value: "缩小",
              },
              {
                key: 'next',
                value: "放大",
              },
              {
                key: 'maxscore',
                value: "满分",
              },
              {
                key: 'minscore',
                value: "零分",
              },
              {
                key: 'addscore',
                value: "加分",
              },
              {
                key: 'subscore',
                value: "减分",
              },
          ],
        },
        {
          title: "开始时间",
          type: "data",
          isSearch: false,
          requestKey: "startTime",
          label:"value",
          value: "key",
          data: [
              {
                key: '',
                value: "全部",
              },
          ],
        },
        {
          title: "结束时间",
          type: "data",
          isSearch: false,
          requestKey: "endTime",
          label:"text",
          value: "id",
          data: [
              {
                id: 0,
                text: "全部",
              },
              {
                id: 1,
                text: "未扫描",
              },
              {
                id: 2,
                text: "缺考",
              },
          ],
        },
        {
          title : '学生信息',
          type : 'input',
          requestKey : 'studentInfo',
          placeholder : '请输入学生信息'
        }
      ],
      tableOption:{
        ismultiple:false,
        isShowCustom : false,
        defaultProp : 'examId',
        defaultSort : 'ascending'
      },
      tableHerder:[
        {
          title:"考试批次名称",
          sortable : 'custom',
          prop:"examName"
        },
        {
          title:"课程名称",
          sortable : 'custom',
          prop:"courseName"
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
          title:"学生姓名",
          sortable : 'custom',
          prop:"studentName"
        },
        {
          title:"条码号",
          sortable : 'custom',
          prop:"examBarCode"
        },
        {
          title:"教师用户名",
          sortable : 'custom',
          prop:"userName"
        },
        {
          title:"教师姓名",
          sortable : 'custom',
          prop:"realName"
        },
        {
          title:"操作类型",
          sortable : 'custom',
          prop:"buttonName"
        },
        {
          title:"操作时间",
          sortable : 'custom',
          prop:"startTime"
        }
      ],

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
      this.getReviewOperateGrid()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getReviewOperateGrid()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getReviewOperateGrid()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
          this.teaSelectList[0].data = res.data
          if(res.data.length > 0) {
            this.requestForm.examId = res.data[0].examId
            // 获取课程
            this.getExamCourseCode()
            this.getReviewOperateGrid()
          }

        })
    },
     // 获取课程
    getExamCourseCode() {
      this.$api.teacher.getExamCourseCode({examId:this.requestForm.examId}).then(res =>{
        let examCourseCodeList = [
          {
              key: "",
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[1],'data',examCourseCodeList)
      })
    },
    // 获取操作
    getTeacherJson() {
      this.$api.inquiryStatistics.getTeacherJson().then(res =>{
        let newTeaList = []
        res.data.forEach(item=> {
          newTeaList.push({
            key:item.userId,
            value: `${item.realName}(${item.userName})`
          })
        })
        let getTeaList = [
          {
              key:'-1',
              value: "全部",
          },
          ...newTeaList
        ]
        this.$set(this.teaSelectList[3],'data',getTeaList)
      })
    },

    // 获扫评阅操作列表
    getReviewOperateGrid() {
      let {page,rows,sord,sidx,examId,courseCode,paperType,operateCode,userId,startTime,endTime,studentInfo} = this.requestForm
      queryJson= {
        examId,courseCode,paperType,operateCode,userId,startTime,endTime,studentInfo
      }
      let requertObjForm = {
        page,rows,sord,sidx,
        queryJson
      }
      this.$api.inquiryStatistics.getReviewOperateGrid(requertObjForm).then(res =>{
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getReviewOperateGrid()
    },
  },

  mounted() {
    this.pageTitle = this.$route.meta.childrenTitle
    this.getUseExamPlan()
    this.getTeacherJson()

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
  .scoreTable table{
    background-color: transparent;
    border-spacing: 0;
    border-collapse: collapse;
  }
  .scoreTable table th,.scoreTable table td{
    border:1px solid #ddd;
    width:100px;
    height:30px;
    text-align:center
  }
  .deltilExplant div{
    margin-bottom: 10px;
  }
  .deltilCon {
    height: 300px;
    overflow-y: scroll;
  }
  .deltilCon::-webkit-scrollbar-track {
      background-color: transparent;
  }
  ::-webkit-scrollbar{
      width:6px;
  }
  ::-webkit-scrollbar-thumb {
      min-height: 20px;
      border-radius:10px;
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
      background:rgba(0,0,0,.2)
  }

</style>

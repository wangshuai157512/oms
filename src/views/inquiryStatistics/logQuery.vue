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
    <oms-custom-page :dialog.sync="deltilDialog" :title="deltilTitle">
      <template v-slot:content class="">
        <slot>
          <div class="deltilCon">
            <div class="deltilExplant">
              <div>考生条码号:<span>{{deltilMemo.examBarCode || deltilMemo.ExamBarCode }}</span></div>
              <div>总分:<span>{{deltilMemo.totalScore}}</span></div>
              <div>评分详情:</div>
            </div>
            <div class="scoreTable">
              <table v-if="questionSocreEntity.length > 0">
                <tbody>
                  <tr v-for="item in questionSocreEntity" :key='item.sequence'>
                    <th style="border:1px solid #ddd;width:100px;height:30px;text-align:center">第{{item.sequence || item.Sequence}}小题</th>
                    <td style="border:1px solid #ddd;width:100px;height:30px;text-align:center">{{(item.score || item.score == '0') ?item.score:item.Score}}分</td>
                    <td style="border:1px solid #ddd;width:100px;height:30px;text-align:center">{{!item.answer || !item.Answer? '无答案' : '答案'}}{{ item.answer || item.Answer}}</td>
                  </tr>
                </tbody>
              </table>
              <p v-else>该操作是释放试卷操作，成绩清除。</p>
            </div>
          </div>

        </slot>
      </template>
      <template v-slot:footer>
          <el-button type="primary" round @click="deltilDialog = false"
          >确定</el-button>
      </template>
    </oms-custom-page>

  </div>
</template>

<script>
let queryJson ={}
export default {
  name: "logQuery",
  components: {

  },
  data() {
    return {
      pageTitle:'',
      deltilDialog:false,
      deltilTitle:'查看详细',
      deltilMemo:{}, //弹窗数据
      questionSocreEntity:[],
      requestForm : {
        page:1,
        rows:30, //每页条数
        sord:"asc",
        sidx:"examId", // 排序字段
        examId:null,
        courseId:-1, //课程Id
        paperType:'', //卷别
        optType:'', //操作
        markStartTime :'', //开始时间
        markEndTime :'', //结束时间
        teacherInfo:"", //教师信息
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
          requestKey: "courseId",
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
          title: "操作",
          type: "select",
          isSearch: true,
          requestKey: "optType",
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
          title: "开始时间",
          type: "data",
          isSearch: false,
          requestKey: "markStartTime",
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
          requestKey: "markEndTime",
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
          title : '教师信息',
          type : 'input',
          requestKey : 'teacherInfo',
          placeholder : '请输入教师信息'
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
          title:"学生条码号",
          sortable : 'custom',
          prop:"examBarCode"
        },
        {
          title:"评分时间",
          sortable : 'custom',
          prop:"markTime"
        },
        {
          title:"操作描述",
          sortable : 'custom',
          prop:"operation"
        },
        {
          title:"操作",
          type:"buttons",
          width:"90",
          fixed:"right",
          align:"right",
          butList:[
            {
              title:"查看详细",
              size : 'mini',
              disabled : false,
              onClick:this.lookDeltil
            },
          ]
        },
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
      this.getMarkLog()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getMarkLog()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getMarkLog()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              // 获取课程
              this.getExamCourseCode()
              this.getMarkLog()
            }

        })
    },
     // 获取课程
    getExamCourseCode() {
      this.$api.teacher.getExamCourseCode({examId:this.requestForm.examId}).then(res =>{
        let examCourseCodeList = [
          {
              key: -1,
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[1],'data',examCourseCodeList)
      })
    },
    // 获取操作
    getLogOptType() {
      this.$api.inquiryStatistics.getLogOptType().then(res =>{
        let optTyperList = [
          {
              key:'',
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[3],'data',optTyperList)
      })
    },

    // 获扫描查询列表
    getMarkLog() {
      let {page,rows,sord,sidx,examId,courseId,paperType,optType,markStartTime,markEndTime,teacherInfo,studentInfo} = this.requestForm
      queryJson= {
        examId,courseId,paperType,optType,markStartTime,markEndTime,teacherInfo,studentInfo
      }
      let requertObjForm = {
        page,rows,sord,sidx,
        queryJson
      }
      this.$api.inquiryStatistics.getMarkLog(requertObjForm).then(res =>{
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getMarkLog()
    },
    lookDeltil(val) {
      this.deltilDialog = true
      this.deltilMemo = JSON.parse(val.row.memo)
      this.questionSocreEntity = this.deltilMemo.questionSocreEntity || this.deltilMemo.QuestionSocreEntity
    }
  },

  mounted() {
    this.pageTitle = this.$route.meta.childrenTitle
    this.getUseExamPlan()
    this.getLogOptType()

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

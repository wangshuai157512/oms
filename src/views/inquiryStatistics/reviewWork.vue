<template>
  <div>
    <oms-table-group
      :selectList.sync="teaSelectList" @search="search"
      :title="pageTitle"
      :request-form='requestForm'
      :functionalityBtn="functionalityBtnList"
      :tableList="tableData"
      :tableHeaderList="tableHerder"
      :option="tableOption"
      :paginationOptions="pageOptions"
       @changePage="changePage"
       @changeNum="changeNum"
       @sortChange="sortChange"
    >
    </oms-table-group>
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
import OmsCustomPage from '../../package/OmsCustomPage/OmsCustomPage.vue';
export default {
  name: "reviewWork",
  components: {
    OmsCustomPage

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
        userInfo:"", //教师信息
      },
      teaSelectList: [
        {
          title: "考试批次",
          type: "select",
          isSearch: true,
          requestKey: "examId",
          label:"examName",
          value: "examId",
          data: [

          ],
        },
        {
          title : '教师信息',
          type : 'input',
          requestKey : 'userInfo',
          placeholder : '请输入教师信息'
        }
      ],
      functionalityBtnList:[
        {
          title:"导出查询明细",
          disabled : this.isDisable,
          funClick:()=> {
            this.exportantDialog = true
          }
        }

      ],  //功能按钮
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
          prop:"examName"
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
          title:"待评阅",
          sortable : 'custom',
          prop:"waitJudgeNum"
        },
        {
          title:"已评阅",
          sortable : 'custom',
          prop:"teacherdoJudgeNum"
        },
        {
          title:"待质检",
          sortable : 'custom',
          prop:"waitQuality"
        },
        {
          title:"质检通过",
          sortable : 'custom',
          prop:"passQuality"
        },
        {
          title:"质检已订正",
          sortable : 'custom',
          prop:"editQuality"
        },
        {
          title:"质检不通过",
          sortable : 'custom',
          prop:"notPassQuality"
        },
        {
          title:"再质检",
          sortable : 'custom',
          prop:"reQuality"
        },

      ],

      tableData: [],

      pageOptions: {
        small : false,
        pageSize : 30,
        total : 0,
        currentPage : 1,
        layout : 'total, sizes, prev, pager, next, jumper',
        pageSizes : [10,40,60]
      },
      resultData :[],
      exportantDialog:false,
      exportForm: {
        checkeds: []
      }
    };
  },
  methods: {
    search() {
      this.isGetResult = false
      this.getReviewList()

      // this.reviewResult()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getReviewList()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getReviewList()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              this.getReviewList()
              this.reviewResult()
            }

        })
    },

    // 获取评阅工作量统计列表
    getReviewList() {
      this.$api.inquiryStatistics.reviewList(this.requestForm).then(res =>{
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
        this.isGetResult = false
        this.reviewResult()
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getReviewList()
    },
    // 获取统计数据
    reviewResult() {
      if (this.isGetResult) {
        this.sendSearchResult()
      } else {
        let { examId,userInfo } = this.requestForm
        this.$api.inquiryStatistics.reviewResult({examId,userInfo}).then(res =>{
        let { waitJudgeNum,teacherdoJudgeNum,waitQuality,passQuality,editQuality,notPassQuality,reQuality} = res.data
        let resultData = [
          {
            key:'待评阅',
            value:waitJudgeNum
          },
          {
            key:'已评阅',
            value:teacherdoJudgeNum
          },
          {
            key:'待质检',
            value:waitQuality
          },
          {
            key:'质检通过',
            value:passQuality
          },
          {
            key:'质检已订正',
            value:editQuality
          },
          {
            key:'质检不通过',
            value:notPassQuality
          },
          {
            key:'再质检',
            value:reQuality
          },
        ]
        this.resultData = resultData
        this.sendSearchResult()
        this.isGetResult = true
      })
      }

    },
    // 导出
    handleChange(value) {
      this.exportForm.checkeds = value
    },
    handleExport() {
      let { examId,userInfo } = this.requestForm
      let {checkeds} = this.exportForm
      this.$api.inquiryStatistics.exportReviewWork({ examId,userInfo,filed:checkeds + ''})
      .then(({ status, data : { fileName }}) => {
        if (status === 1) {
          window.open(fileName)
        }
      })
    }
    

  },
  mounted() {
    this.$event.$on('getResult',this.reviewResult)
    this.pageTitle = this.$route.meta.childrenTitle
    this.getUseExamPlan()

  },
  activated () {
    if(this.isGetResult) {
      this.reviewResult()
    }
  },
};
</script>

<style scoped lang="less">
  .logs /deep/ p{
    margin-bottom: 10px!important;
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

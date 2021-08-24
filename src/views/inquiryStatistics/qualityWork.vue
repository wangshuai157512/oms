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
  </div>
</template>

<script>
export default {
  name: "qualityWork",
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
          funClick:this.handleExport
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
        {
          title:"质检率",
          sortable : 'custom',
          prop:"qualityRate"
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
      }
    };
  },
  methods: {
    search() {
      this.getQualityList()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getQualityList()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getQualityList()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              this.getQualityList()
            }

        })
    },

    //质检列表
    getQualityList() {
      this.$api.inquiryStatistics.qualityList(this.requestForm).then(res =>{
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
        this.isGetResult = false
        this.qualityResult()
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getQualityList()
    },
    // 获取统计数据
    qualityResult() {
      if (this.isGetResult) {
        this.sendSearchResult()
      } else {
        let { examId,userInfo } = this.requestForm
        this.$api.inquiryStatistics.totalQualityData({examId,userInfo}).then(res =>{
          console.log(res,369)
        let {waitQuality,passQuality,editQuality,notPassQuality,reQuality,qualityRate} = res.data
        let resultData = [
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
          {
            key:'质检率',
            value:qualityRate
          },
        ]
        this.resultData = resultData
        this.sendSearchResult()
        this.isGetResult = true
      })
      }
    },
    // 导出
    handleExport() {
      this.$api.inquiryStatistics.exportQualityJudgeStatistics(this.requestForm)
          .then(({ status, data : { fileName }}) => {
            if (status === 1) {
              window.open(fileName)
            }
          })
    },


  },

  mounted() {
    this.pageTitle = this.$route.meta.childrenTitle
    this.getUseExamPlan()

  },
  activated () {
    if(this.isGetResult) {
      this.qualityResult()
    }
  }

};
</script>

<style scoped lang="less">
  .logs /deep/ p{
    margin-bottom: 10px!important;
  }

</style>

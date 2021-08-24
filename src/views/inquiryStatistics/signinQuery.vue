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
export default {
  name: "signinQuery",
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
        packageState:'-1', //状态
        packageInfo:"", //包信息
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
          title: "状态",
          type: "select",
          isSearch: true,
          requestKey: "packageState",
          label:"value",
          value: "key",
          data: [
              {
                key: '-1',
                value: "全部",
              },
              {
                key: '0',
                value: "未扫描",
              },
              {
                key: '1',
                value: "扫描中",
              },
              {
                key: '2',
                value: "已扫描",
              },
          ],
        },
        {
          title : '包信息',
          type : 'input',
          requestKey : 'packageInfo',
          placeholder : '请输入包序号或分包规则'
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
          title:"包序号",
          sortable : 'custom',
          prop:"packageIndex"
        },
        {
          title:"条码号",
          sortable : 'custom',
          prop:"packageNumber"
        },
        {
          title:"数量",
          sortable : 'custom',
          prop:"pageCount"
        },
        {
          title:"扫描数量",
          sortable : 'custom',
          prop:"scanCount"
        },
        {
          title:"分包规则",
          sortable : 'custom',
          prop:"packRole"
        },
        {
          title:"状态",
          sortable : 'custom',
          prop:"signinState"
        },
        {
          title:"操作",
          type:"buttons",
          width:"90",
          fixed:"right",
          align:"right",
          butList:[
            {
              title:"查看",
              size : 'mini',
              formatter : (scope)=> {
                return scope.row.state === 1 || scope.row.state === 2?false:true
              },
              onClick:this.lookSignin
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
      this.getSignInfo()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getSignInfo()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getSignInfo()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              this.getSignInfo()
            }

        })
    },

    // 获扫签到表查询列表
    getSignInfo() {
      this.$api.inquiryStatistics.getSignInfo(this.requestForm).then(res =>{
        res.data.rows.forEach(item=> {
          if(item.state === 2) {
            item.signinState = "已扫描"
          }else if(item.state === 1) {
            item.signinState = "扫描中"
          }else {
            item.signinState = "未扫描"
          }
        })
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getSignInfo()
    },
    lookSignin(row){
      this.linkTo({
        path:"/lookSigninDeltil",
        query: {
           examId:row.row.examId,
           packageNumber:row.row.packageNumber
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

<style scoped lang="less">
  .logs /deep/ p{
    margin-bottom: 10px!important;
  }

</style>

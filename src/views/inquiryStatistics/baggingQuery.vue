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
    <oms-custom-page :dialog.sync="logsDialog" :title="logsTitle">
            <template v-slot:content>
                <slot>
                  <div class="logs" v-html='logsContent'></div>
                </slot>
            </template>
            <template v-slot:footer>
                <el-button type="primary" @click="logsDialog = false" round>确定</el-button>
            </template>
    </oms-custom-page>
  </div>
</template>

<script>
let queryJson ={}
export default {
  name: "baggingQuery",
  components: {

  },
  data() {
    return {
      pageTitle:'',
      logsDialog:false,
      logsTitle:'查看日志',
      logsContent:'',
      requestForm : {
        page:1,
        rows:30, //每页条数
        sord:"asc",
        sidx:"examId", // 排序字段
        examId:null,
        packageType:'-1', //类型
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
          title: "试卷袋类型",
          type: "select",
          isSearch: true,
          requestKey: "packageType",
          label:"value",
          value: "key",
          data: [
              {
                key: '-1',
                value: "全部",
              },
              {
                key: '1',
                value: "试卷袋",
              },
              {
                key: '2',
                value: "答题卡袋",
              },
          ],
        },
        {
          title: "装袋状态",
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
                value: "未装袋",
              },
              {
                key: '1',
                value: "正常装袋",
              },
              {
                key: '2',
                value: "错误",
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
          title:"类型",
          sortable : 'custom',
          prop:"packType"
        },
        {
          title:"分包规则",
          sortable : 'custom',
          prop:"packRule"
        },
        {
          title:"装袋状态",
          sortable : 'custom',
          prop:"packState"
        },
        {
          title:"操作",
          type:"buttons",
          width:"90",
          fixed:"right",
          align:"right",
          butList:[
            {
              title:"查看日志",
              size : 'mini',
              formatter : (scope)=> {
                return scope.row.state === 1?false:true
              },
              onClick:this.lookLogs
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
      this.getExaminationGridJson()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getExaminationGridJson()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getExaminationGridJson()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              this.getExaminationGridJson()
            }

        })
    },

    // 获扫描装袋查询列表
    getExaminationGridJson() {
      let {page,rows,sord,sidx,examId,packageType,packageState,packageInfo} = this.requestForm
      queryJson= {
        examId,packageType,packageState,packageInfo
      }
      let requertObjForm = {
        page,rows,sord,sidx,
        queryJson
      }
      this.$api.examination.getExaminationGridJson(requertObjForm).then(res =>{
        res.data.rows.forEach(item=> {
          if(item.state === 1) {
            item.packState = '正常装袋'
            this.isLogs = false
          }else if(item.state === 2) {
            item.packState = '装袋错误'
          }else {
            item.packState = '未装袋'
            this.isLogs = true
          }
          if(item.type === 1) {
            item.packType = '试卷袋'
          }else if(item.type === 2) {
            item.packType = '答题卡袋'
          }else {
            item.packType = ''
          }
        })
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getExaminationGridJson()
    },
    lookLogs(val) {
      this.logsDialog = true
      let rowLog = val.row.log.split('\n')
      rowLog.forEach(item=> {
        this.logsContent += "<p>"+item+"</p>";
      })
    }

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

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
    ></oms-table-group>
  </div>
</template>

<script>
let queryJson ={}
export default {
  name: "scoreInquiry",
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
        placeId:0, //考点Id
        orderName:'', //场次
        className :'', //考场
        state:0, //状态
        packageNumber:'' //包序号
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
            this.getExamOrder()
            this.getExamClass()
          },
          data: [

          ],
        },
        {
          title: "考     点",
          type: "select",
          isSearch: true,
          requestKey: "placeId",
          label:"value",
          value: "key",
          data: [
              {
                key: 0,
                value: "全部",
              },
          ],
        },
        {
          title: "场     次",
          type: "select",
          isSearch: true,
          requestKey: "orderName",
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
          title: "考    场",
          type: "select",
          isSearch: true,
          requestKey: "className",
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
          title: "状     态",
          type: "select",
          isSearch: true,
          requestKey: "state",
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
                text: "已扫描",
              },
              {
                id: 3,
                text: "扫描中",
              }
          ],
        },
        {
          title : '包序号',
          type : 'input',
          requestKey : 'packageNumber',
          placeholder : '请输入包序号'
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
          title:"状态",
          prop:"stateName",
          fixed:"right",
          width:"120",
          align:"center",
          sortable:'custom'
        }
      ],
      functionalityBtnList:[
        {
          title:"导出",
          disabled:this.isDisable,
          funClick:this.exportScan
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
      this.getScanJson()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getScanJson()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getScanJson()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              // 获取学习中心
              this.getExamStation()
              // 获取场次
              this.getExamOrder()
              // 获取考场
              this.getExamClass()
              // 获取表头
              this.getHeader()
            }

        })
    },
    // 获取学习中心
    getExamStation() {
      this.$api.studentManage.getExamStation({examId:this.requestForm.examId}).then(res =>{
        let examStationList = [
          {
              key: 0,
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[1],'data',examStationList)
      })
    },
    // 获取场次
    getExamOrder() {
      this.$api.client.getExamOrder({examId:this.requestForm.examId}).then(res =>{
        let newOrder = []
        res.data.forEach(item => {
          newOrder.push({
            key : item,
            value :item,
          })
        });
        let examOrderList = [
          {
              key:'',
              value: "全部",
          },
          ...newOrder
        ]
        console.log(examOrderList)
        this.$set(this.teaSelectList[2],'data',examOrderList)
      })
    },
    // 获取考场
    getExamClass() {
      this.$api.client.getExamClass({examId:this.requestForm.examId}).then(res =>{
        let newClass = []
        res.data.forEach(item => {
          newClass.push({
            key : item,
            value :item,
          })
        });
        let examClassList = [
          {
              key: '',
              value: "全部",
          },
          ...newClass
        ]
        this.$set(this.teaSelectList[3],'data',examClassList)
      })
    },
    // 获取表头
    getHeader() {
      this.$api.client.getHeader({examId:this.requestForm.examId,key:"scanInfo"}).then(res=>{
        console.log(res)
        res.data.forEach(item => {
          item.title = item.colViewName
          item.prop = item.colName
          item.sortable = 'custom'
        })

        this.tableHerder = res.data.concat(this.tableHerder)
        this.getScanJson()
      })
    },
    // 获扫描查询列表
    getScanJson() {
      let {page,rows,sord,sidx,examId,placeId,orderName,className,state,packageNumber} = this.requestForm
      queryJson= {
        examId,placeId,orderName,className,state,packageNumber
      }
      let requertObjForm = {
        page,rows,sord,sidx,
        queryJson
      }
      this.$api.client.getScanJson(requertObjForm).then(res =>{
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestParams,order,prop,'examId')
      this.getScanJson()
    },
    // 导出
    exportScan() {
      let exportQueryJson = {
        queryJson
      }
      this.$api.client.exportScan(exportQueryJson).then(res=>{
        if(res.status) {
          window.open(res.data.fileName)
        }
      })
    }
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

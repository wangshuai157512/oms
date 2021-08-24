<template>
  <div>
    <oms-table-group
      :selectList.sync="teaSelectList" @search="search"
      :title="pageTitle"
      :request-form='requestForm'
      :tableList="tableData"
      :tableHeaderList="tableHerder"
      :functionalityBtn="functionalityBtnList"
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
    <oms-custom-page :dialog.sync="importantDialog" title="装袋日志导入">
      <template v-slot:content>
        <div class="packlogImport-container">
          
          <div class="content">
            <div class="top">
              <div style="font-size:14px;color:#626673;margin-bottom:8px">考试批次</div>
              <el-select size="medium"  v-model="examId" >
                  <el-option v-for="item in examPlans"
                  :value="item.examId"
                  :label="item.examName"
                  :key = "item.examId"
                    ></el-option>
              </el-select>
            </div>
            <div class="container" id="uploader" >
                  <div style="font-size:14px;color:#626673;margin-bottom:8px">导入文件</div>
                  <div>
                    <el-upload v-if="true"
                      class="upload"
                      ref="upload"
                      action=""
                      multiple
                      :limit="9999"
                      :auto-upload="false"
                      :on-change="change"	
                      :show-file-list="false"
                    >
                        <!-- <el-button slot="trigger" size="small" type="primary" ><i></i>选取文件</el-button> -->
                        <div class="default-upload-container" slot="trigger">请选择上传文件</div>
                        <div class="fileList" v-if="fileList.length>0">
                          <ul>
                            <li v-for="(item,i) in fileList">
                              <span class="fileName">{{item.name}}</span>
                              <span :class="{error:!status[i].state}" v-if="status.length>0 && status.length === fileList.length">{{status[i].state?"成功":"失败"}}</span>
                              <!-- <span v-if="status.length>0">{{status[i].error?status[i].error:""}}</span> -->
                              <span style="cursor:pointer;margin-right: 20px;" v-if="status.length>0 && status.length === fileList.length" @click="showMessage(status[i].error)"> 详情 </span>
                              <span v-if="status.length>0 && status.length === fileList.length && status[i].errorFile">{{status[i].errorFile}}</span>
                              <span class="del" @click="handleRemove(item)">x</span>

                            </li>
                          </ul>
                        </div>
                    </el-upload>
                  </div>
              </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
         <el-button @click="importantDialog = false" round>取 消</el-button>
          <el-button type="primary" round @click="submitUpload"
          >导入</el-button>
      </template>
    </oms-custom-page>
  </div>
</template>

<script>
export default {
  name: "encaseMentQuery",
  components: {

  },
  data() {
    return {
      pageTitle:'',
      logsDialog:false,
      importantDialog:false,
      logsTitle:'查看日志',
      logsContent:'',
      requestForm : {
        page:1,
        rows:30, //每页条数
        sord:"asc",
        sidx:"examId", // 排序字段
        examId:null,
        placeId:-1, //考点
        state:'-1', //状态
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
          change:()=> {
            this.getExamStation()
          },
          data: [

          ],
        },
        {
          title: "考点",
          type: "select",
          isSearch: true,
          requestKey: "placeId",
          label:"value",
          value: "key",
          data: [
              {
                key: -1,
                value: "全部",
              }
          ],
        },
        {
          title: "装箱状态",
          type: "select",
          isSearch: true,
          requestKey: "state",
          label:"value",
          value: "key",
          data: [
              {
                key: '-1',
                value: "全部",
              },
              {
                key: '0',
                value: "未装箱",
              },
              {
                key: '1',
                value: "装箱中",
              },
              {
                key: '2',
                value: "已完成",
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
       functionalityBtnList:[
        {
          title:"导入",
          funClick:this.handleImportant
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
          title:"考试批次名称",
          sortable : 'custom',
          prop:"examName"
        },
        {
          title:"考点名称",
          sortable : 'custom',
          prop:"placeName"
        },
        {
          title:"状态",
          sortable : 'custom',
          prop:"stateName"
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
                return scope.row.memo?false:true
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
      },
      examId:"",
      fileList:[],
      examPlans:[],
      files :[],
      status:[],
    };
  },
  methods: {
    search() {
      this.getPackageLogList()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getPackageLogList()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getPackageLogList()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              this.getExamStation()
              this.getPackageLogList()
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

    // 获取考点装箱查询列表
    getPackageLogList() {
      this.$api.inquiryStatistics.getPackageLogList(this.requestForm).then(res =>{
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getPackageLogList()
    },
    lookLogs(val) {
      this.logsDialog = true
      let rowLog = val.row.log.split('\n')
      rowLog.forEach(item=> {
        this.logsContent += "<p>"+item+"</p>";
      })
    },

    // 导入
    handleImportant() {
      this.fileList = []
      this.status = []
      this.importantDialog = true
    },

    getExamPlan(){
      this.$api.studentManage.getEnableExamJson().then(res=>{
        if(res.status==1){
          this.examPlans = res.data
          this.examId = res.data[0].examId
        }
      })
    },
    handleRemove(file) {
        this.fileList.forEach((item,i)=>{
          if(item.uid==file.uid){
            this.fileList.splice(i, 1)
          }
        })
        console.log(this.fileList);
        this.status = this.status.filter((item)=> {
          return item.fileName !== file.name
        })
        
    },  
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 9999 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    change(file,fileList){
      this.files = fileList
      this.fileList.push(file.raw)
    },	     
    showMessage(msg){
      this.$message({
        message: msg,
        type: 'error'
      })
    },
      submitUpload(){
        let formdata;
        let that = this;
        let fileMap = {
            examId : this.examId
        }
        this.fileList.forEach((item,index) => {
            fileMap['files'+index] = item
          })

        formdata = this.$tools.createFormData(fileMap)
        this.$api.system.uploadPackage(formdata).then(res=>{
          // console.log(res)
          if(res.data.length>0){
            this.status = []
            res.data.forEach((item,i)=>{ 
              this.status.push(item) 
            })
          }
        })
    },
    


  },

  mounted() {
    this.pageTitle = this.$route.meta.childrenTitle
    this.getUseExamPlan()
    this.getExamPlan()

  }
};
</script>

<style scoped lang="less">
  .logs /deep/ p{
    margin-bottom: 10px!important;
  }
  .default-upload-container {
      box-sizing: border-box;
      width: 240px;
      height: 36px;
      border-radius: 4px;
      border: 1px solid #DDDDDD;
      background: rgba(255, 255, 255, 0.35);
      color: #C2C4CC;
      font-size: 13px;
      line-height: 36px;
      text-align: left;
      padding-left: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
  }
  .content{
		background-color: #fff;
    min-height: 300px;
		overflow-y:auto 
	}
	.title{
	    font-size: 18px;
		color: #15151A;
		margin-bottom: 18px;
	}
  .top {
    margin-bottom: 16px;
  }
	.upload,.upload .el-upload {
    height: 36px;
    line-height: 36px;
  }
	.fileList{
		// margin:20px 0;	
		color:#606266;	
	}
  .fileName {
    width: 125px;
    margin-right: 10px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
	.fileList span{
		display: inline-block;
    vertical-align: middle;
		// margin-right:20px;
	}
	.error{color:red;margin-right: 20px;}
	.del{margin-right:0;cursor: pointer;}

</style>

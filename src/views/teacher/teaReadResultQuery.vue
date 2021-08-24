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
    <oms-custom-page :dialog.sync="uploadDialog" :title="uploadTitle" width="30%">
            <template v-slot:content class="uploadH">
                <slot>
                <el-form ref="uploadFrom" :model="requestForm" class="uploadFrom">
                    <el-form-item label="考试批次">
                        <el-select v-model="requestForm.examId" filterable class="uploadPlan">
                            <el-option v-for="(item) in teaSelectList[0].data" :key="item.examId" :label="item.examName" :value="item.examId" ></el-option>
                        </el-select>
                    </el-form-item>
                 </el-form>
                 <div class="imporFile">导入文件</div>
                </slot>
                <oms-upload-file re="upload" :http-request="handleImport" :accept="accept" :fileSize="upFileSize">
                </oms-upload-file>
            </template>
            <template v-slot:footer>
                <el-button @click="uploadDialog = false" round>取 消</el-button>
                <el-button type="primary" round @click="handleUpload"
                >导入</el-button>
            </template>
      </oms-custom-page>
      <oms-custom-page :dialog.sync="exportDialog" :title="exportTitle" width="30%">
            <template v-slot:content class="uploadH">
                <slot>
                  <div class="temState">
                    默认区隔：课程、卷别
                  </div>
                  <el-form :model="exportForm" class="uploadFrom">
                    <el-form-item label="可选区隔：">
                      <el-checkbox :label="item.colViewName" v-for="(item) in exportForm.colViewName" :key="item.colViewName" @change='exportChang($event,item.colName)' :true-label="item.colName" :false-label='0'></el-checkbox>
                    </el-form-item>
                  </el-form>
                </slot>
            </template>
            <template v-slot:footer>
                <el-button @click="exportDialog = false" round>取 消</el-button>
                <el-button type="primary" round @click="handleExport"
                >导出</el-button>
            </template>
      </oms-custom-page>
  </div>
</template>

<script>
export default {
  name: "teaReadResultQuery",
  components: {

  },
  data() {
    return {
      pageTitle:'',
      uploadDialog:false,
      uploadTitle:'评阅分配结果导入',
      exportDialog:false,
      exportTitle:'模板下载',
      splitFieldList:[],
      accept:"xls,xlsx",
      upFileSize:"2",
      importFile:null,
      requestForm : {
        page:1,
        rows:30, //每页条数
        sord:"asc",
        sidx:"examId", // 排序字段
        examId:null,
        courseCode: "",
        paperType:"",
        state:"-1",
        keyword:""
      },
      exportForm:{
        colViewName:[]
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
          title: "课程",
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
          isSearch: false,
          requestKey: "state",
          label:"text",
          value: "id",
          data: [
              {
                id: "-1",
                text: "全部",
              },
              {
                id: "0",
                text: "未分配",
              },
              {
                id: "1",
                text: "已分配",
              },
          ],
        },
        {
          title: "信息",
          type: "input",
          requestKey: "keyword",
          val: "",
          placeholder:"请输入序号或分包规则内容"
        },
      ],
      tableOption:{
        ismultiple:false,
        isShowCustom : false,
        defaultProp : 'userName',
        defaultSort : 'ascending'
      },
      tableHerder:[
        {
          title:"考试批次",
          width:"150",
          sortable : 'custom',
          prop:"examName"
        },
        {
          title:"课程编码",
          sortable : 'custom',
          prop:"courseCode"
        },
        {
          title:"课程名称",
          sortable : 'custom',
          prop:"courseName"
        },
        {
          title:"姓名",
          sortable : 'custom',
          prop:"studentName",
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
          title:"答题卡编号",
          sortable : 'custom',
          prop:"examBarCode"
        },
        {
          title:"分配教师",
          sortable : 'custom',
          prop:"realName"
        },

      ],
      functionalityBtnList:[
        {
          title:"模板下载",
          type:"text",
          disabled:false,
          funClick:()=> {
            this.exportDialog = true
            this.getImportArea()
            this.splitFieldList=[]
          }
        },
        {
          title:"评阅分配结果导入",
          disabled:false,
          funClick:()=> {
            this.uploadDialog = true
          }
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
      this.getTeaResultList()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getTeaResultList()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getTeaResultList()
    },
    // 获取考试批次
    getTestPlan() {
        this.$api.teacher.getTestPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              // 获取课程列表
              this.getExamCourseCode()
              // 表格查询结果
              this.getTeaResultList()
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
    // 获取教师列表
    getTeaResultList() {
      this.$api.teacher.getTeaResultList(this.requestForm).then(res =>{
        this.tableData = res.data.rows
        this.pageOptions.total = res.data.records
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'userName')
      this.getTeaResultList()
    },

    //导入
    async handleUpload () {
        if (!this.importFile) {
            this.$message.error('请选择文件')
            return
        }
        let formdata = new FormData()
        formdata.append('file',this.importFile)
        formdata.append('examId',this.requestForm.examId)
        let { status,data } = await this.$api.teacher.ImportTeaXls(formdata)
        if (status === 1) {
            this.$message.success('导入成功')
            this.importFile = null
            this.getReadList()
        }
        if(data !== null && data.fileName) {
            this.$confirm('部分数据导入失败！请下载查看。', '系统提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                roundButton:true,
                type: 'warning'
            }).then(() => {
                window.open(data.fileName)
            })
        }
    },
    async handleImport ({file}) {
        this.importFile = file
    },
      clearFile(val) {
        if(!val) {
            this.importFile && this.$refs.upload.clearFileName()
            this.importFile = null
        }
    },

    // 获取导出区格
    getImportArea() {
      this.$api.teacher.getImportArea({examId:this.requestForm.examId}).then(res =>{
        this.exportForm.colViewName = res.data
      })
    },
    exportChang(area,remove) {
      if(area && this.splitFieldList.indexOf(area) === -1) {
        this.splitFieldList.push(area)
      }else {
        this.splitFieldList=this.splitFieldList.filter(item=> {
          console.log(item,remove)
          return item != remove
        })
      }
    },
    // 文档导出
    handleExport() {
      this.$api.teacher.exportTeaTemplate({examId:this.requestForm.examId,splitField:this.splitFieldList+''}).then(res =>{
        console.log(res)
        if(res.status) {
          window.open(res.data)
        }
      })
    }

  },

  mounted() {
    this.pageTitle = this.$route.meta.childrenTitle
    this.getTestPlan()
  }
};
</script>

<style scoped lang="less">
  .downTemplate {
    display: block;
    padding: 10px 0 30px 0;
    color: #3388FF;
    font-size: 13px;
    text-decoration: none;
  }
  .imporFile {
    margin-bottom: 8px;
  }
  /deep/ .el-form-item__label{
        float: none;
        margin-bottom: 8px;
  }
  /deep/ .el-form-item__content {
        margin-left: 0!important;
  }
  .uploadPlan {
      width: 280px;
  }
  .temState {
    margin-bottom: 16px;
  }
  .uploadFrom /deep/ .el-form-item .el-form-item__content{
    line-height: 22px;
  }
  .uploadFrom /deep/ .el-form-item__label {
    display: inline-block;
    margin-bottom: 8px;
    padding-bottom: 0;
  }
</style>

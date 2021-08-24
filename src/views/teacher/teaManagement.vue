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
    <oms-custom-page :dialog.sync="uploadDialog" :title="uploadTitle">
      <template v-slot:content class="uploadH">
        <slot>
          <div class="upLoadExplain">
            <div>1.请按照模板格式准备需要导入的数据</div>
            <a href="/template/teacherimport.xls " class="downTemplate">下载教师导入数据模板</a>
            <div>2.请选择需导入的文件，支持xls、xlsx格式，文件不得大于2M</div>
          </div>

        </slot>
        <oms-upload-file ref="upload" :http-request="handleImport" :accept="accept" :fileSize="upFileSize">

        </oms-upload-file>
      </template>
      <template v-slot:footer>
         <el-button @click="uploadDialog = false" round>取 消</el-button>
          <el-button type="primary" round @click="handleUpload"
          >导入</el-button>
      </template>
    </oms-custom-page>

  </div>
</template>

<script>
export default {
  name: "teaManagement",
  components: {

  },
  data() {
    return {
      pageTitle:'',
      deleteList:[],
      requestForm : {
        page:1,
        rows:30, //每页条数
        sord:"asc",
        sidx:"userName", // 排序字段
        roleId: "-1",
        keyword:""
      },
      roleType: 2, // 1，管理员；  2，教师
      teaSelectList: [
        {
          title: "角色",
          type: "select",
          isSearch: false,
          requestKey: "roleId",
          label:"text",
          value: "id",
          data: [
            {
              id: "-1",
              text: "全部",
            }
          ],
        },
        {
          title: "教师信息",
          type: "input",
          requestKey: "keyword",
          val: "",
          placeholder:"请输入教师或课程信息"
        },
      ],
      functionalityBtnList:[
        {
          title:"新建",
          disabled:false,
          funClick:this.handleAdd
        },
        {
          title:"导入",
          disabled:false,
          funClick:()=> {
            this.uploadDialog = true
          }
        },
        {
          title:"导出",
          disabled:this.isDisable,
          funClick:this.handleExport
        }
      ],  //功能按钮
      tableOption:{
        ismultiple:false,
        isShowCustom : false,
        defaultProp : 'userName',
        defaultSort : 'ascending'
      },
      tableHerder:[
        {
          title:"教师用户名",
          sortable : 'custom',
          width:"150",
          prop:"userName"
        },
        {
          title:"教师姓名",
          width:"150",
          sortable : 'custom',
          prop:"realName"
        },
        {
          title:"角色",
          width:"300",
          sortable : 'custom',
          prop:"roleName"
        },
        {
          title:"课程名称",
          sortable : 'custom',
          prop:"courseName",
          align : 'left'
        },
        {
          title:"状态",
          type:"switch",
          width:"100",
          switchShow:1,
          switchHide:0,
          sortable : 'custom',
          prop:"state",
          change:this.switchChange
        },

        {
          title:"操作",
          type:"buttons",
          width:"200",
          fixed:"right",
          align:"right",
          butList:[
            {
              title:"修改",
              size : 'mini',
              disabled : false,
              onClick:this.handleAdd
            },
            {
              title:"删除教师",
              size : 'mini',
              disabled : false,
              delectType:1,
              onClick:this.onClickDelete
            },
            {
              title:"删除课程",
              size : 'mini',
              disabled : false,
              delectType:2,
              onClick:this.onClickDelete
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
      uploadDialog:false,
      uploadTitle:'导入教师信息',
      accept:"xls,xlsx",
      upFileSize:"2",
      importFile:null
    };
  },
  methods: {
    search() {
      this.getTeacherList()
    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getTeacherList()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getTeacherList()
    },
    // 获取查询角色
    getRoleType() {
      this.$api.teacher.getRoleType( { roleType : this.roleType}).then(res =>{
        let roleTypeList = [
          {
              id: "-1",
              text: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[0],'data',roleTypeList)
      })
    },
    // 获取教师列表
    getTeacherList() {
      this.$api.teacher.getTeacherList(this.requestForm).then(res =>{
        this.tableData = res.data.rows
        this.pageOptions.total = res.data.records
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'userName')
      this.getTeacherList()
    },
    switchChange(row) {
      let requestSwitch= {
        userId:row.userId,
        state :row.state
      }
       this.$api.teacher.teaSwitchState(requestSwitch).then(res =>{
        console.log(res)
      })
    },

    onClickDelete(row,item) {
      let requestDelete = {
        userId:row.row.userId,
        type:item.delectType
      }
      this.$confirm('确定要删除该项数据么?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        roundButton:true,
        type: 'warning'
      }).then(() => {
        this.$api.teacher.deleteTeacher(requestDelete).then(res =>{
          if(res.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTeacherList()
          }
        })

      }).catch(() => {

      });


    },
    // 新增修改
    handleAdd(row) {
      this.$router.push({name:'teaAdd',params:row})
    },

    //导入
    async handleUpload () {
      if (!this.importFile) {
        this.$message.error('请选择文件')
        return
      }
      let formdata = new FormData()
      formdata.append('file',this.importFile)
      let { status,data } = await this.$api.teacher.TeacherCourseImport(formdata)
      if (status === 1) {
          this.$message.success('导入成功')
          this.importFile = null
          this.getTeacherList()
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

    // 导出教师
    handleExport() {
      let requestExport = {
        roleId:this.requestForm.roleId,
        keyword:this.requestForm.keyword,
      }
      this.$api.teacher.exportTeacherCourse(requestExport).then(res =>{
        if(res.status) {
          window.open(res.data.fileName)
        }
      })
    },

   saveEdit (val,to) {
     if(to.path === '/teaAdd') {
        this.getTeacherList()
     }
   }

  },
  watch:{
    uploadDialog: {
      handler:'clearFile'
    },
    $route:{
      handler:'saveEdit'
    }
  },
  mounted() {
    this.pageTitle = this.$route.meta.childrenTitle
    this.getRoleType()
    this.getTeacherList()
  },
};
</script>

<style scoped lang='less'>
  .downTemplate {
    display: block;
    padding: 8px 0 32px 0;
    color: #3388FF;
    font-size: 13px;
    text-decoration: none;
  }
  .upLoadExplain {
    margin-bottom: 8px;
  }
  /deep/ .el-button--small {
      border-radius: 20px!important;
    }
</style>

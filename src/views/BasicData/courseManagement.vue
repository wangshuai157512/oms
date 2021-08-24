<template>
    <div>
        <oms-table-group
            title="课程管理"
            :selectList="queryList"
            :request-form="requestParams"
            :tableHeaderList="tableHeader"
            :tableList="tableData"
            :paginationOptions="pageOptions"
            :option="tableOption"
            :functionalityBtn="functionalityBtnList"
            @search="getTeacherCourseGridJson"
            @changePage="changePage"
            @changeNum="changeNum"
            @sortChange="sortChange"
        />
        <oms-custom-page
            :dialog.sync="customDialog"
            :title="getTitle"
        >
            <template v-slot:content>
               <div class="form-container">
                   <el-form ref="form" :rules='rules' :model="form" >
                       <el-form-item
                           label="课程编号"
                           prop="courseCode"
                       >
                           <el-input v-model="form.courseCode" placeholder="请输入课程编号" :disabled="true"></el-input>
                       </el-form-item>
                       <el-form-item
                           label="课程名称"
                           prop="courseName"
                       >
                           <el-input v-model="form.courseName" placeholder="请输入课程名称"></el-input>
                       </el-form-item>
                   </el-form>
               </div>
            </template>
            <template v-slot:footer>
                <el-button @click="customDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="confirm">确定</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  export default {
    name: "courseManagement",
    data () {
      return {
        form : {
          "courseId": "",
          "courseName": "",
          "courseCode": ""
        },
        queryList : [
          {
            title : '课程名称',
            type : 'input',
            placeholder : '请输入课程名称',
            requestKey : 'keyword'
          }
        ],
        requestParams : {
          "roleId": null,
          "keyword": "",
          "page": 1,
          "rows": 30,
          "sidx": "courseName",
          "sord": "asc"
        },
        tableHeader : [
          {
            title : '课程编号',
            prop : 'courseCode',
            sortable : 'custom'
          },
          {
            title : '课程名称',
            prop : 'courseName',
            sortable : 'custom'
          },
          {
            title: "操作",
            width: '100',
            type: "buttons",
            fixed: "right",
            fixedPos: "right",
            align: "center",
            butList: [
              {
                title: "修改",
                onClick: this.edit,
              },
              {
                title: "删除",
                onClick: this.delData,
              }
            ],
          }
        ],
        tableData : [],
        pageOptions : {
          pageSize : 30,
          total : 0
        },
        tableOption : {
          defaultProp : 'courseName',
          defaultSort : 'ascending'
        },
        functionalityBtnList : [
          {
            title : '新建',
            funClick : this.showCustom
          }
        ],
        customDialog : false,
        rules : {
          courseName : [
            { required : true, message : '请输入课程名称' , trigger : 'blur' }
          ],
          courseCode : [
            { required : true, message : '请输入课程编号' , trigger : 'blur' }
          ]
        }
      }
    },
    computed : {
      getTitle () {
        return this.form.courseId?'修改课程':'新增课程'
      }
    },
    methods : {
      //课程列表
      async getTeacherCourseGridJson () {
        this.requestParams.page = 1
        let { data } = await this.$api.basicData.getTeacherCourseGridJson(this.requestParams)
        this.pageOptions.total = data.records
        this.tableData = data.rows
      },
      changePage (p) {
        this.requestParams.page = p
        this.getTeacherCourseGridJson()
      },
      changeNum (n) {
        this.requestParams.rows = n
        this.getTeacherCourseGridJson()
      },
      sortChange ({prop,order}) {
        this.tableSort(this.requestParams,order,prop,'courseName')
        this.getTeacherCourseGridJson()
      },
      showCustom () {
        this.form = {
          "courseId": "",
          "courseName": "",
          "courseCode": ""
        }
        this.customDialog = true
      },
      async confirm () {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.createCourse()
          }
        });
      },
      async createCourse () {
        let { status } = await this.$api.basicData.submitFormCourse(this.form)
        if (status === 1) {
          this.customDialog = false
          this.$message.success('操作成功')
          this.getTeacherCourseGridJson()
        }
      },
      async edit ({row : { courseCode , courseId , courseName }} ) {
        this.form = {
            "courseId": courseId,
            "courseName": courseName,
            "courseCode": courseCode
        }
        this.customDialog = true
      },
      async delData ({row : { courseId , courseCode }}) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        }).then(async () => {
          let { status } = await this.$api.basicData.deleteCourseForm({
            courseId,
            courseCode
          })
          if (status === 1) {
            this.customDialog = false
            this.$message.success('删除成功')
            this.getTeacherCourseGridJson()
          }
        }).catch(() => {});
      }
    },
    mounted () {
      this.getTeacherCourseGridJson()
    }
  }
</script>

<style scoped lang="less">
    .form-container {
        width: 240px;
    }
</style>

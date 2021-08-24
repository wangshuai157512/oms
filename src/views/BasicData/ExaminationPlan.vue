<template>
    <div class="examination-plan-container">
        <oms-table-group
            title="考试批次"
            :selectList="queryList"
            :request-form="requestParams"
            :tableHeaderList="tableHeader"
            :tableList="tableData"
            :paginationOptions="pageOptions"
            :option="tableOption"
            :functionalityBtn="functionalityBtnList"
            @search="search"
            @changePage="changePage"
            @changeNum="changeNum"
            @sortChange="sortChange"
        />
        <oms-custom-page
            :dialog.sync="customDialog"
            width="620px"
            :title="getTitle"
        >
            <template v-slot:content>
                <div class="form-container">
                    <div class="form-item-container">
                        <div>
                            <span style="color: red;">*</span>
                            <span>考试批次名称</span>
                        </div>
                        <div class="form-item">
                            <el-input v-model="form.examName" placeholder="请输入考试批次名称"></el-input>
                        </div>
                    </div>
                    <div>
                        <div v-if="showExamCode">
                            <span>考试批次编号</span>
                        </div>
                        <div class="form-item">
                            <el-input v-if="showExamCode" :disabled="true" v-model="form.ExamCode" placeholder="请输入考试批次名称"></el-input>
                        </div>
                    </div>
                    <div class="form-item-container">
                        <div>
                            <span>评阅开始时间</span>
                        </div>
                        <div class="form-item">
                            <el-date-picker
                                v-model="form.judgeStartTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>评阅结束时间</span>
                        </div>
                        <div class="form-item">
                            <el-date-picker
                                v-model="form.judgeEndTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                default-time="23:59:59"
                                placeholder="选择日期"
                                :picker-options="pickerOptionsEnd"
                            >
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="form-item-container">
                        <div>
                            <span>考试类型</span>
                        </div>
                        <div class="form-item">
                            <el-select :disabled="isDisabledExamType" v-model="form.examTypeId" placeholder="请选择">
                                <el-option
                                    v-for="item in examTypeList"
                                    :key="item.examTypeId"
                                    :label="item.examTypeName"
                                    :value="item.examTypeId">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>备注</span>
                        </div>
                        <div class="form-item">
                            <el-input v-model="form.memo" placeholder="请输入备注"></el-input>
                        </div>
                    </div>
                </div>
                <div class="checkbox-container">
                    <div>
                        <span>显示考生信息</span>
                        <div class="checkbox">
                            <el-checkbox
                                v-model="form.viewStudentInfo"
                                :true-label="1"
                                :false-label="0"
                            >允许</el-checkbox>
                        </div>
                    </div>
                    <div style="margin:0 20px;">
                        <span>重复评阅</span>
                        <div class="checkbox">
                            <el-checkbox
                                v-model="form.reJudge"
                                :true-label="1"
                                :false-label="0"
                            >允许</el-checkbox>
                        </div>
                    </div>
                    <div>
                        <span>状态</span>
                        <div class="checkbox">
                            <el-checkbox
                                v-model="form.state"
                                :true-label="1"
                                :false-label="0"
                            >启用</el-checkbox>
                        </div>
                    </div>
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
    name: "ExaminationPlan",
    data () {
      return {
        pickerOptionsEnd : {
          disabledDate : time => {
            if (this.form.judgeStartTime) {
              return time.getTime() < new Date(this.form.judgeStartTime).getTime()
            }
          }
        },
        functionalityBtnList : [
          {
            title : '新建',
            funClick : this.showCustom
          }
        ],
        queryList : [
          {
            title : '考试批次名称',
            type : 'input',
            placeholder : '请输入考试批次名称',
            requestKey : 'keyword'
          }
        ],
        requestParams : {
          "keyword": "",
          "page": 1,
          "rows": 30,
          "sidx": "createDate",
          "sord": "desc"
        },
        tableOption : {},
        tableHeader : [
          {
            title : '考试批次名称',
            prop : 'examName',
            sortable : 'custom'
          },
          {
            title : '考试类型',
            prop : 'examTypeName',
            sortable : 'custom'
          },
          {
            title : '考试批次编码',
            prop : 'examCode',
            sortable : 'custom'
          },
          {
            title : '评阅开始时间',
            prop : 'judgeStartTime',
            sortable : 'custom'
          },
          {
            title : '评阅结束时间',
            prop : 'judgeEndTime',
            sortable : 'custom'
          },
          {
            title : '考生信息',
            prop : 'viewStudentInfo',
            sortable : 'custom',
            formatter : ({row}) => {
              return row.viewStudentInfo === 1?'显示':'不显示'
            }
          },
          {
            title : '重复评阅',
            prop : 'reJudge',
            sortable : 'custom',
            formatter : ({row}) => {
              return row.reJudge === 1?'允许':'不允许'
            }
          },
          {
            title : '状态',
            prop : 'state',
            type : 'switch',
            sortable : 'custom',
            switchShow : 1,
            switchHide : 0,
            change : this.changeExamStatus
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
          },
        ],
        tableData : [],
        pageOptions : {
          total : 0,
          pageSize: 30,
        },
        customDialog : false,
        examTypeList : [],
        form : {
          examId : '',
          examName : '',
          judgeStartTime : '',
          judgeEndTime : '',
          examTypeId : '',
          memo : '',
          viewStudentInfo : 0,
          reJudge : 0,
          state : 0
        },
        confirmType : 1,
        isDisabledExamType : false,
        showExamCode : false
      }
    },
    computed : {
      getTitle () {
        return this.showExamCode ? '修改考试批次':'新增考试批次'
      }
    },
    methods : {
      //考试批次列表
      getGridJson () {
        this.$api.basicData.getGridJson(this.requestParams)
          .then(({data}) => {
            this.pageOptions.total = data.records
            this.tableData = data.rows
          })
      },
      search () {
        this.getGridJson()
      },
      //考试类型
      async getExamTypeList () {
        this.$api.basicData.getExamTypeList()
          .then(({data}) => {
            this.examTypeList = data
          })
      },
      async delData ({row : {examId}}) {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        }).then(async () => {
          let { status } = await this.$api.basicData.deleteExamPlanForm({
            examId
          })
          if (status === 1) {
            this.$message.success('删除成功')
            this.getGridJson()
          }
        }).catch(() => {});
      },
      changePage (p) {
        this.requestParams.page = p
        this.getGridJson()
      },
      changeNum (n) {
        this.requestParams.rows = n
        this.getGridJson()
      },
      sortChange ({prop,order}) {
        this.tableSort(this.requestParams,order,prop,'createDate')
        this.getGridJson()
      },
      showCustom () {
        this.form = {
          examId : '',
          examName : '',
          judgeStartTime : '',
          judgeEndTime : '',
          examTypeId : '',
          memo : '',
          viewStudentInfo : 0,
          reJudge : 0,
          state : 0
        }
        this.customDialog = true
        this.isDisabledExamType = false
        this.showExamCode = false
      },
      createPlanTimeCheck () {
        return new Date(this.form.judgeEndTime).getTime() < new Date(this.form.judgeStartTime).getTime()
      },
      createPlanCheck () {
        if (!this.form.examName) {
          this.$message.error('请输入考试批次名称')
          return false
        }
        if (this.createPlanTimeCheck()) {
          this.$message.error('结束时间不能小于开始时间')
          return false
        }
        return true
      },
      async confirm () {
        if (!this.createPlanCheck()) return;
        let { status } = await this.$api.basicData.submitForm(this.form)
        if (status === 1) {
          this.customDialog = false
          this.getGridJson()
        }
      },
      async edit ({row}) {
        this.customDialog = true
        let { data } = await this.$api.basicData.getExamPlanFormJson({
          examId : row.examId
        })
        this.form = {
          examId : data.examId,
          examName : data.examName,
          judgeStartTime : data.judgeStartTime,
          judgeEndTime : data.judgeEndTime,
          examTypeId : data.examTypeId,
          memo : data.memo,
          viewStudentInfo : data.viewStudentInfo,
          reJudge : data.reJudge,
          state : data.state,
          ExamCode : data.examCode
        }
        this.isDisabledExamType = true
        this.showExamCode = true
      },
      async changeExamStatus ({state,examId}) {
        let { status } = await this.$api.basicData.enabledExam({
          examId,
          state
        })
        if (status === 1) {
          this.$message.success('状态修改成功')
        } else {
          this.getGridJson()
        }
      }
    },
    mounted () {
      this.getGridJson()
      this.getExamTypeList()
    }
  }
</script>

<style scoped lang="less">
    .form-item-container {
        margin-right: 58px;
    }
    .form-item {
        width: 240px;
        margin-top: 8px;
        margin-bottom: 16px;
        /deep/.el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 100%;
        }
        /deep/.el-select {
            width: 100%;
        }
    }
    .form-container {
        display: flex;
        /*justify-content: space-between;*/
        flex-wrap: wrap;
    }
    .checkbox {
        display: inline-block;
        margin-left: 7px;
    }
    .checkbox-container {
        display: flex;
    }
</style>

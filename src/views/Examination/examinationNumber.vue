<template>
    <div>
        <oms-table-group
            :selectList="teaSelectList"
            :functionality-btn="functionalityBtn"
            :request-form="queryJson"
            :tableHeaderList.sync="tableHeader"
            :option="tableOptions"
            :tableList="tableList"
            :paginationOptions="pageOptions"
            title="试卷袋号码管理"
            @search="getExaminationGridJson"
            @sortChange="sortChange"
            @handleSelectionChange="handleSelectionChange"
            @changePage="changePage"
            @changeNum="changeNum"
        />
        <oms-custom-page :dialog.sync="pageageRuleDialog" title="分包规则设置">
            <template v-slot:content>
                <div class="rules">
                    <div class="rule-item">
                        <p class="title">分包类型</p>
                        <div>
                            <el-checkbox-group v-model="packageRuleForm.packageType">
                                <el-checkbox :label="1">试卷袋</el-checkbox>
                                <el-checkbox :label="2">答题卡袋</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                    <div class="rule-item">
                        <p class="title">
                            <span>分包规则</span>
                            <span class="tips">在下方依次按照排序优先级，选择【区隔字段】</span>
                        </p>
                        <div>
                            <div class="mb16 pcakage-fileds">
                                <span
                                    class="tag"
                                    v-for="item in rule.isDisplay"
                                    :key="item"
                                    @click="setRule(item)"
                                >【#{{item}}#】</span>
                            </div>
                            <div class="mb16 txt-package-rule">
                                <el-input v-model="packageRuleForm.packageRule" type="text" class="__input" readonly="readonly" />
                                <el-button type="text" size="mini" @click="clearPackageRule" >清空</el-button>
                            </div>
                            <div class="mb16 count-num">
                                <span>容量限制</span>
                                <el-input size="mini" v-model.number="packageRuleForm.maxNumber"></el-input>
                                <span>份</span>&nbsp;&nbsp;&nbsp;
                                <span>初始化序号</span>
                                <el-input size="mini" v-model.number="packageRuleForm.startIndex"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="rule-item">
                        <p class="title">
                            <span>条码号编码规则</span>
                            <span class="tips">不足最小位数时，补零</span>
                        </p>
                        <div class="pcakage-fileds mb16">
                            <span
                                class="tag"
                                v-for="item in rule.numberDisplay"
                                :key="item"
                                @click="setPackageNumRule(item)"
                            >【#{{item}}#】</span>
                        </div>
                        <div class="txt-package-rule">
                            <el-input v-model="packageRuleForm.packageNumberRule" type="text" class="__input" />
                            <input type="text" class="package-num" disabled value="包序号">
                            <el-button type="text" size="mini" @click="clearPackageNumRule">清空</el-button>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="pageageRuleDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="packageRuleConfirm">确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="createPackageNumDialog"
            title="生成包序号"
        >
            <template v-slot:content>
                <span>请选择范围</span>
                <div class="row-radio">
                    <el-radio-group v-model="createPackageForm.rangeType">
                        <el-radio :label="0">为全部考生重新生成</el-radio>
                        <el-radio :label="1">只为无包序号的考生生成</el-radio>
                    </el-radio-group>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="createPackageNumDialog = false" round>关闭</el-button>
                <el-button type="primary" round @click="createPackageConfirm">确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="copyNumDialog"
            title="复制号码"
        >
            <template v-slot:content>
                <div class="copy-item">
                    <p class="title">请选择范围</p>
                    <div>
                        <el-radio-group v-model="copyForm.rangeType">
                            <el-radio :label="0">全部查询结果</el-radio>
                            <el-radio :label="1">选择的查询结果</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="copy-item">
                    <p class="title">请选择</p>
                    <div>
                        <el-select v-model="copyForm.numberType" placeholder="请选择">
                            <el-option
                                v-for="item in numberTypeList"
                                :key="item.title"
                                :label="item.title"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="copy-item">
                    <p class="title">复制到</p>
                    <div>
                        <el-checkbox-group v-model="copyForm.copyTo">
                            <el-checkbox
                                :label="item.value"
                                v-for="item in numberTypeList"
                                :key="item.value"
                                :disabled="item.value === copyForm.numberType"
                            >试卷包序号</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="copyNumDialog = false" round>关闭</el-button>
                <el-button type="primary" round @click="copyConfirm">确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page
            :dialog.sync="delNumDialog"
            title="批量删除考生"
        >
            <template v-slot:content>
                <span>删除范围</span>
                <div class="del-status">
                    <el-radio-group v-model="delForm.rangeType">
                        <el-radio :label="1">删除选中的数据</el-radio>
                        <el-radio :label="0">删除全部数据</el-radio>
                    </el-radio-group>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="delNumDialog = false" round>关闭</el-button>
                <el-button type="primary" round @click="delNumConfirm">确认</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  export default {
    name: "examinationNumber",
    data () {
      return {
        teaSelectList : [
          {
            title: "考试批次",
            type: "select",
            isSearch: true,
            requestKey: "examId",
            label: 'examName',
            value: 'examId',
            data: [],
          },
          {
            title: "类型",
            type: "select",
            requestKey: "packageType",
            label: 'key',
            value: 'value',
            data: [
              {
                key : '全部',
                value : '-1'
              },
              {
                key : '试卷袋',
                value : '1'
              },
              {
                key : '答题卡袋',
                value : '2'
              },
            ],
          },
          {
            title : '包信息',
            type : 'input',
            requestKey : 'packageInfo',
            placeholder : '请输入包信息'
          }
        ],
        functionalityBtn : [
          {
            title : '分包规则',
            type : 'text',
            funClick : this.showPackageRuleDialog
          },
          {
            title : '生成包序号',
            funClick : this.showCreatePackageNumDialog
          },
          {
            title : '复制号码',
            funClick : this.showCopyDialog,
            disabled : this.isDisable
          },
          {
            title : '删除号码',
            funClick : this.showDelNumDialog,
            disabled : this.isDisable
          },
          {
            title : '数据检查',
            funClick : this.checkData
          }
        ],
        queryJson : {
          examId : '',
          packageType : '-1',
          packageInfo : '',
          page : 1,
          rows : 30,
          sidx : 'packageIndex',
          sord : 'asc'
        },
        tableHeader : [
          {
            title : '考试批次',
            prop : 'examName',
            sortable: 'custom'
          },
          {
            title : '包序号',
            prop : 'packageIndex',
            sortable: 'custom'
          },
          {
            title : '条码号',
            prop : 'packageNumber',
            sortable: 'custom'
          },
          {
            title : '类型',
            prop : 'type',
            formatter : ({row : {type}}) => {
              return type === 1?'试卷袋':'答题卡袋'
            },
            sortable: 'custom'
          },
          {
            title : '内容数量',
            prop : 'studentCount',
            sortable: 'custom'
          },
          {
            title : '规则',
            prop : 'packRule',
            sortable: 'custom'
          }
        ],
        tableOptions : {
          ismultiple : true
        },
        tableList : [],
        pageOptions : {
          total : 0,
          pageSize : 30
        },
        pageageRuleDialog : false,
        packageRuleForm : {
          packageType : [],
          packageRule : '',
          maxNumber : 0,
          startIndex : 0,
          packageNumberRule : ''
        },
        createPackageNumDialog : false,
        createPackageForm : {
          rangeType : 1,
          examId : null
        },
        copyNumDialog : false,
        numberTypeList : [
          {
            title : '试卷包序号',
            value : 3
          },
          {
            title : '答题卡包序号',
            value : 1
          },
          {
            title : '试卷条码号',
            value : 4
          },
          {
            title : '答题条码号',
            value : 2
          }
        ],
        copyForm : {
          examId : null,
          rangeType : 0,
          numberType : 3,
          copyTo : [],
          ids : ''
        },
        delNumDialog : false,
        delForm : {
          rangeType : 1
        },
        rule : {},
        selectList : []
      }
    },
    methods : {
      //考试批次
      async getEnableExamJson() {
        let {data} = await this.$api.studentManage.getEnableExamJson()
        this.$set(this.teaSelectList[0], 'data', data)
        this.queryJson.examId = data[0].examId
      },
      //列表
      async getExaminationGridJson () {
        let { data } = await this.$api.examination.getPaperPackageInfo(this.queryJson)
        this.tableList = data.rows
        this.pageOptions.total = data.records
      },
      sortChange ({prop,order}) {
        this.tableSort(this.requestParams,order,prop,'packageIndex')
        this.getExaminationGridJson()
      },
      changePage (p) {
        this.queryJson.page = p
        this.getExaminationGridJson()
      },
      changeNum (n) {
        this.queryJson.rows = n
        this.getExaminationGridJson()
      },
      //分包规则
      async showPackageRuleDialog () {
        this.pageageRuleDialog = true
        let { data } = await this.$api.examination.getPackageRule()
        this.rule = data
        let { packageNumberRule } = data
        this.packageRuleForm.startIndex = packageNumberRule.startIndex
        this.packageRuleForm.maxNumber = packageNumberRule.maxCount
        this.$set(this.packageRuleForm,'packageType',packageNumberRule.packageType)
      },
      setRule (item) {
        this.packageRuleForm.packageRule += `【${item}】`
      },
      setPackageNumRule (item) {
        this.packageRuleForm.packageNumberRule += `【${item}】`
      },
      clearPackageRule () {
        this.packageRuleForm.packageRule = ''
      },
      clearPackageNumRule () {
        this.packageRuleForm.packageNumberRule = ''
      },
      //保存分包规则
      async packageRuleConfirm () {
        let {
          packageType,
          packageRule,
          maxNumber,
          startIndex,
          packageNumberRule
        } = this.packageRuleForm
        if (packageType.length < 1) {
          this.$message.warning('请选择分包类型')
          return
        }
        if (!packageRule) {
          this.$message.warning('分包规则不能为空')
          return
        }
        if (maxNumber < 1) {
          this.$message.warning('容量限制不能为0')
          return
        }
        if (startIndex < 1) {
          this.$message.warning('初始序号不能为0')
          return
        }
        if (!packageNumberRule) {
          this.$message.warning('条码号规则不能为空')
          return
        }
        let { status } = await this.$api.examination.setPackageRule(this.packageRuleForm)
        if (status === 1) {
          this.$message.success('设置成功')
          this.pageageRuleDialog = false
        }
      },
      showCreatePackageNumDialog () {
        this.createPackageNumDialog = true
      },
      //生成序号包
      async createPackageConfirm () {
        this.createPackageForm.examId = this.queryJson.examId
        let { status } = await this.$api.examination.createPackageNumber(this.createPackageForm)
        if (status === 1) {
          this.$message.success('生成成功')
          this.createPackageNumDialog = false
          this.getExaminationGridJson()
        }
      },
      showCopyDialog () {
        this.copyNumDialog = true
      },
      //复制号码
      async copyConfirm () {
        this.copyForm.examId = this.queryJson.examId
        let ids = []
        let copyForm = this.copyForm
        let { rangeType } = copyForm
        if (rangeType === 1 && this.selectList.length < 1) {
          this.$message.warning('请先选择复制的数据')
          return
        }
        if (copyForm.copyTo.length < 1) {
          this.$message.warning('请选择复制到的包序号')
          return
        }
        if (rangeType === 1) {
          this.selectList.forEach(item => {
            ids.push(item.id)
          })
          copyForm.ids = ids.toString()
        } else {
          copyForm.ids = ''
        }
        let { status } = await this.$api.examination.copyPackageNumber(this.copyForm)
        if (status === 1) {
          this.$message.success('复制成功')
          this.copyNumDialog = false
          this.copyForm = {
            examId : null,
            rangeType : 0,
            numberType : 3,
            copyTo : [],
            ids : ''
          }
        }
      },
      showDelNumDialog () {
        this.delNumDialog = true
      },
      //删除号码
      async delNumConfirm () {
        let rangeType = this.delForm.rangeType
        if (rangeType === 1 && this.selectList.length < 1) {
          this.$message.warning('请选择删除的数据')
          return
        }
        let len = rangeType === 1 ? this.selectList.length : this.pageOptions.total
        this.$confirm(`确定要删除选中的${len}条考生数据？删除后将不可恢复！`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          roundButton:true,
          type: 'warning'
        }).then(async () => {
          let requestParams;
          let selectPackageIds = []
          if (rangeType === 1) {
            this.selectList.forEach(item => {
              selectPackageIds.push(item.id)
            })
            requestParams = {
              packageId : selectPackageIds.toString(),
              rangeType : this.delForm.rangeType
            }
          } else {
            requestParams = {
              rangeType : this.delForm.rangeType,
              examId : this.queryJson.examId,
              packageType : this.queryJson.packageType,
              keyword : this.queryJson.keyword
            }
          }
          let { status } = await this.$api.examination.deletePackageNumber(requestParams)
          if (status === 1) {
            this.delNumDialog = false
            this.$message.success('删除成功')
            this.getExaminationGridJson()
          }
        }).catch(() => {})
      },
      handleSelectionChange (val) {
        this.selectList = val
      },
      async checkData () {
        let { status,message } = await this.$api.examination.checkPackageInfo({
          examId : this.queryJson.examId
        })
        if (status === 1) {
          this.$message.success(message)
        }
      }
    },
    async mounted () {
      await this.getEnableExamJson()
      this.getExaminationGridJson()
    }
  }
</script>

<style scoped lang="less">
    .rule-item {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 32px;
        .title {
            margin-bottom: 16px;
            .tips {
                font-size: 14px;
                color: #999;
                margin-left: 6px;
            }
        }
        .el-tag {
            margin-right: 5px;
        }
        .txt-package-rule {
            .__input {
                width: 360px;
                padding: 5px;
                margin-right: 4px;
            }
        }
        .count-num {
            span {
                font-size: 12px;
                color: #999;
            }
            /deep/.el-input {
                width: 50px;
                margin: 0 6px;
            }
        }
        .package-num {
            width: 50px;
            text-align: center;
            background-color: #e7e7e7;
            border: 1px solid #e7e7e7;
            margin: 0 5px;
            color: #999;
        }
    }
    .row-radio {
        box-sizing: border-box;
        /deep/.el-radio-group {
            display: flex;
            flex-direction: column;
        }
        /deep/.el-radio {
            margin-top: 8px;
        }
    }
    .copy-item {
        .title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin: 16px 0;
        }
        /deep/.el-select {
            width: 280px;
        }
    }
    .del-status {
        box-sizing: border-box;
        padding-left: 30px;
        padding-top: 15px;
        /deep/.el-radio-group {
            display: flex;
            flex-direction: column;
        }
        /deep/.el-radio {
            margin-top: 8px;
        }
    }
    .m10 {
        margin: 10px 0;
    }
    .el-button--text {
        padding: 0!important;
        min-width: auto!important;
    }
</style>

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
            @handleSelectionChange ="delIdList"
            @changePage="changePage"
            @changeNum="changeNum"
            @sortChange="sortChange"
        ></oms-table-group>
        <oms-custom-page :dialog.sync = "taskRuleDialog" :title="taskRuletitle" width="30%">
            <template v-slot:content>
                <el-form ref="requestSetRule" :model="requestSetRule">
                    <el-form-item label="评阅上限（多人评阅）" class="cor">
                        <el-radio-group v-model="requestSetRule.markSetRule">
                            <el-radio :label= "0">无限制</el-radio>
                            <el-radio :label= "1">按考生总数平均分配</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="分配范围" class="colum">
                        <el-radio-group v-model="requestSetRule.markSetRange">
                            <el-radio :label="0">教师范围不变：按当前计划已分配教师</el-radio>
                            <el-radio :label="1">增加教师范围：已分配教师+教师库教师</el-radio>
                            <el-radio :label="2">教师库：按教师库中启用教师</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <el-button @click="taskRuleDialog = false" round>关闭</el-button>
                <el-button type="primary" @click="saveMarkRule" round>确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page :dialog.sync="uploadDialog" :title="uploadTitle">
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
                <oms-upload-file ref="upload" :http-request="handleImport" :accept="accept" :fileSize="upFileSize">

                </oms-upload-file>
                <div class="import-tips">
                    <p class="tips">导入说明:</p>
                     <ul>
                        <li class="tip-item">
                            <div>(1)</div>
                            <div>请先导出分配结果，如需按题目分配评阅教师时，导出时“是否导出题号”请选择“是”，否则按整卷分配评阅教师；</div>
                        </li>
                        <li class="tip-item">
                            <div>(2) 导出文档中：</div>
                        </li>
                        <ul class="childBox">
                            <li class="tip-item">
                                <!-- <div>a.</div> -->
                                <div>以下字段为试卷信息，请不要编辑，如需分配多人，可复制多行：课程名称、课程编码、卷别、题号；</div>
                            </li>
                            <li class="tip-item">
                                <!-- <div>b.</div> -->
                                <div>以下字段为分配信息，可按需填写：用户名、教师姓名、密码、最大评阅数；</div>
                            </li>
                            <li class="tip-item">
                                <!-- <div>c.</div> -->
                                <div>导入已有教师时，必填项：用户名、教师姓名；</div>
                            </li>
                            <li class="tip-item">
                                <!-- <div>d.</div> -->
                                <div>导入新增教师时，必填项：用户名、教师姓名、密码(必须以字母开头，长度在6-12之间，只能包含字符、数字和下划线)；</div>
                            </li>
                            <li class="tip-item">
                                <!-- <div>e.</div> -->
                                <div>最大评阅数为该教师分配当前试卷评阅上限，请填写数字，为空则不限制；</div>
                            </li>
                        </ul>
                        <li class="tip-item">
                            <div>(3)  导入时，请选择导出的考试批次。</div>
                        </li>
                    </ul>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="uploadDialog = false" round>取 消</el-button>
                <el-button type="primary" round @click="handleUpload"
                >导入</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page :dialog.sync = "exportDialog" :title="exportTitle" width="30%">
            <template v-slot:content>
                <el-form ref="requestExport" :model="requestExport">
                    <el-form-item label="导出范围" class="cor">
                        <el-radio-group v-model="requestExport.exportRange">
                            <el-radio :label= "0">选择的查询结果</el-radio>
                            <el-radio :label= "1">全部查询结果</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否导出题号" class="cor">
                        <el-radio-group v-model="requestExport.exportQuestionNumber">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <el-button @click="exportDialog = false" round>关闭</el-button>
                <el-button type="primary" @click="handleExport" round>确认</el-button>
            </template>
        </oms-custom-page>
        <oms-custom-page :dialog.sync ="assignSetDialog" :title="assignSettitle" :isFullScreen="isFullScreen">
            <template v-slot:content>
                <oms-table
                    :functionalityBtn="detailFunctionalityBtnList"
                    :tableList="detailTableData"
                    :tableHeaderList="detailTableHerder"
                    :option="detailTableOption"
                    :title="detailPageTitle"
                    :explain="detailPageExplain"
                ></oms-table>
            </template>
        </oms-custom-page>
        <oms-custom-page :dialog.sync ="addDetailDialog" :title="detailRealName?'修改教师分配': '新增教师分配'" width="30%">
            <template v-slot:content>
                <el-form :model="requestDetailAdd" :rules="rules" ref="requestDetailAdd"  class="addForm">
                        <el-form-item label="教师名称" prop="userId" v-if="!detailRealName" >
                                <el-select v-model="requestDetailAdd.userId" :multiple="addTeaList.length > 1" filterable placeholder="搜索关键字或ID">
                                    <el-option v-for="(item,index) in addTeaList" :key="index" :label="item.name" :value="item.id" ></el-option>
                                </el-select>
                        </el-form-item>
                        <el-form-item label="教师名称" v-else>
                            <el-input v-model="detailRealName" disabled></el-input>
                        </el-form-item>
                    <el-form-item label="最大评阅数量">
                        <el-input v-model="unlimited" v-if="requestDetailAdd.maxNumber === -1"></el-input>
                        <el-input v-model="requestDetailAdd.maxNumber" v-else></el-input>
                    </el-form-item>
                     <el-form-item label="题号" class="equence" prop="sequence">
                        <el-checkbox :indeterminate="isIndeterminate" :disabled="!sequenceList" :true-label="1" :false-label="0" v-model="requestDetailAdd.setPaper" @change="handleCheckAllChange" class="allSequence">整卷</el-checkbox>
                        <el-checkbox-group v-model="requestDetailAdd.sequence" @change="sequenceChange">
                            <el-checkbox v-for="item in sequenceList " :key="item" :label="item" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template v-slot:footer>
                <el-button @click="addDetailDialog = false" round>关闭</el-button>
                <el-button type="primary" @click="handleDetailAdd('requestDetailAdd')" round>确认</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
export default {
    name: "teaRead",
    components: {

    },
    data() {
        return {
            pageTitle:"",
            paperIds:"", // 批量选择的试卷ID
            taskRuleDialog:false,
            taskRuletitle:"自动分配规则",
            assignSetDialog:false,
            uploadDialog:false,
            uploadTitle:'导入教师评阅设置',
            accept:"xls,xlsx",
            upFileSize:"2",
            importFile:null,
            exportTitle:"评阅分配导出",
            exportDialog:false,
            assignSettitle:"分配设置",
            detailPageTitle:"评阅分配明细",
            detailPageExplain:"",
            isFullScreen:true,
            unlimited:'无限制',
            paperIdList:[],
            requestForm: {
                examId: null, //考试批次
                markSetState: "-1", // 分配状态
                page:1,
                rows:30, //每页条数
                sord:"asc",
                sidx:"userName", // 排序字段
                keyword:""
            },
            requestSetRule: {
                examId: 1,
                markSetRule: 1,
                markSetRange: 1
            },
            requestExport: {
                exportRange:1,
                exportQuestionNumber:0
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
                    title: "分配状态",
                    type: "select",
                    isSearch: false,
                    requestKey: "markSetState",
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
                            text: "未完成",
                        },
                        {
                            id: "2",
                            text: "分配完成",
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
                    title:"自动分配规则",
                    type:"text",
                    disabled:this.isDisable,
                    funClick:this.automaticRule
                },
                {
                    title:"自动分配",
                    type:"primary",
                    disabled:this.isDisable,
                    funClick:this.automatic
                },
                {
                    title:"批量删除",
                    disabled:this.isDisable,
                    funClick:this.batchDelete
                },
                {
                    title:"导入分配结果",
                    disabled:false,
                    funClick:() => {
                        this.uploadDialog = true
                    }
                },
                {
                    title:"导出分配",
                    disabled:this.isDisable,
                    funClick:() => {
                        this.exportDialog = true
                    }
                },
            ],  //功能按钮
            tableOption:{
                ismultiple:true,
                isShowCustom : false,
                defaultProp : 'userName',
                defaultSort : 'ascending'
            },
            tableHerder:[
                {
                    title:"课程名称",
                    sortable : 'custom',
                    prop:"courseName",
                },
                {
                    title:"卷别",
                    sortable : 'custom',
                    prop:"paperType"
                },
                {
                    title:"分配教师",
                    sortable : 'custom',
                    prop:"realName"
                },
                {
                    title:"评阅方式",
                    type:"switch",
                    switchShow:1,
                    switchHide:0,
                    isDisabled:true,
                    sortable : 'custom',
                    prop:"multiMark",
                    change:this.multiMarkChange
                },
                {
                    title:"是否显示考生信息",
                    type:"switch",
                    sortable : 'custom',
                    switchShow:1,
                    switchHide:0,
                    prop:"viewStudentInfo",
                    change:this.studentInfoChange
                },
                {
                    title:"是否允许重复评阅",
                    type:"switch",
                    sortable : 'custom',
                    switchShow:1,
                    switchHide:0,
                    prop:"reJudge",
                    change:this.reJudgeChange
                },
                {
                    title:"分配状态",
                    sortable : 'custom',
                    prop:"markSetStateText",
                },
                {
                    title:"操作",
                    type:"buttons",
                    width:"80",
                    fixed:"right",
                    align:"right",
                    butList:[
                        {
                        title:"分配设置",
                        disabled : false,
                        onClick:this.handleMarkSet
                        }
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
            // 二级页面
            requestDetail: {
                paperId: 1,
                page: 1,
                rows: 10,
                sidx: "userName",
                sord: "asc"
            },
            requestDetailAdd: {
                setPaper: 1, //整卷
                sequence: [],
                userId: '', //新增的教师id
                maxNumber: ""
            },
            rules: {
                userId: [
                    { required: true, message: '请选择评阅教师', trigger: 'blur' }
                ],
                sequence: [
                    { required: true, message: '请选择题目', trigger: 'change',validator:(rule,value,callback)=>{
                        if(!this.requestDetailAdd.setPaper && value.length < 1) {
                            callback(new Error('请选择题目'))
                        }else {
                            callback()
                        }
                    } }
                ]

            },
            detailRealName:'',
            addDetailDialog:false,
            addDeletTitle:"新增分配教师",
            addDeletTitle:"修改分配教师",
            detailFunctionalityBtnList:[
                {
                    title:"新增",
                    type:"primary",
                    disabled:false,
                    funClick:this.addTeaNum
                }
            ],  //功能按钮
            detailTableOption:{
                ismultiple:false,
                isShowCustom : false
            },
            detailTableHerder:[
                {
                    title:"教师姓名",
                    prop:"realName"
                },
                {
                    title:"用户名",
                    prop:"userName"
                },
                {
                    title:"评阅方式",
                    type:"switch",
                    switchShow:1,
                    switchHide:0,
                    isDisabled:true,
                    prop:"multiMark",
                    change:this.detailMultiMarkChange
                },
                {
                    title:"是否显示考生信息",
                    type:"switch",
                    switchShow:1,
                    switchHide:0,
                    prop:"viewStudentInfo",
                    change:this.detailStudentInfoChange
                },
                {
                    title:"是否允许重复评阅",
                    type:"switch",
                    switchShow:1,
                    switchHide:0,
                    prop:"reJudge",
                    change:this.detailReJudgeChange
                },
                {
                    title:"最大评阅数",
                    prop:"maxNumberChinese"
                },
                {
                    title:"题号",
                    prop:"questionNumber"
                },
                {
                    title:"操作",
                    type:"buttons",
                    width:"100",
                    align:"center",
                    butList:[
                        {
                        title:"设置",
                        disabled : false,
                        onClick:this.getTeaInfo
                        },
                        {
                        title:"删除",
                        disabled : false,
                        onClick:this.detailDelete
                        },
                    ]
                },
            ],
            detailTableData: [],
            addTeaList: [],
            isIndeterminate: false,
            sequenceList: [], //题号
        }

    },
    methods: {
        validateName (rule,value,callback) {
            if (!value) {
                callback(new Error('请选择教师名称'))
            } else {}
        },
        // 获取考试批次
        getTestPlan() {
            this.$api.teacher.getTestPlan().then(res =>{
                this.teaSelectList[0].data = res.data
                 if(res.data.length > 0) {
                    this.requestForm.examId = res.data[0].examId
                    // 获取评阅列表
                    this.getReadList()
                }

            })
        },
        getReadList() {
            this.$api.teacher.getReadList(this.requestForm).then(res =>{
                this.pageOptions.total = res.data.records
                res.data.rows.forEach(item => {
                    if(item.markSetState === 0) {
                        item.markSetStateText = '<span class="unDistributed">未分配</span>'
                    }else if(item.markSetState === 1) {
                        item.markSetStateText = '<span class="unFinish">未完成</span>'
                    }else if(item.markSetState === 2) {
                        item.markSetStateText = '<span class="finish">已完成</span>'
                    }
                })
                this.tableData = res.data.rows
            })
        },
        sortChange ({prop,order}) {
          this.tableSort(this.requestForm,order,prop,'userName')
          this.getReadList()
        },
        search() {
            this.getReadList()
        },
        multiMarkChange(row) {
            console.log(row)
        },
        // 是否显示考试信息
        studentInfoChange(row) {
            let studentInfoChangerequest = {
                paperId:row.paperId,
                userId:row.userId,
                editType:2,
                state:row.viewStudentInfo
            }
            this.$api.teacher.editSwitch(studentInfoChangerequest).then(res => {
                if(res.status) {
                    this.getReadList()
                }
            })
        },
        // 是否允许重复评阅
        reJudgeChange(row) {
            let reJudgeChangerequest = {
                paperId:row.paperId,
                userId:row.userId,
                editType:1,
                state:row.reJudge
            }
            this.$api.teacher.editSwitch(reJudgeChangerequest).then(res => {
                if(res.status) {
                    this.getReadList()
                }
            })
        },
        // 详情列表是否显示考试信息
        detailStudentInfoChange(row) {
            let detailStudentInfoChangerequest = {
                paperId:row.paperId,
                userId:row.userId,
                editType:2,
                state:row.viewStudentInfo
            }
            this.$api.teacher.editSwitch(detailStudentInfoChangerequest).then(res => {
                if(res.status) {
                    this.getDetailList()
                }
            })
        },
        // 详情列表是否允许重复评阅
        detailReJudgeChange(row) {
            let detailReJudgeChangerequest = {
                paperId:row.paperId,
                userId:row.userId,
                editType:1,
                state:row.reJudge
            }
            this.$api.teacher.editSwitch(detailReJudgeChangerequest).then(res => {
                if(res.status) {
                    this.getDetailList()
                }
            })
        },

        // 第几页
        changePage(page) {
        this.requestForm.page = page
        this.getReadList()
        },
        // 每页多少条
        changeNum(pageSize) {
        this.requestForm.rows = pageSize
        this.getReadList()
        },
        // 自动分配规则
        automaticRule() {
            this.taskRuleDialog = true
            this.$api.teacher.GetMarkRule({examId:this.requestForm.examId}).then(res => {
                this.requestSetRule.examId = this.requestForm.examId
                this.requestSetRule.markSetRange = res.data.markSetRange
                this.requestSetRule.markSetRule = res.data.markSetRule
            })
        },
        // 保存自动分配规则
        saveMarkRule() {
            this.$api.teacher.saveMarkRule(this.requestSetRule).then(res => {
                this.$message({
                    message:'设置成功',
                    type: 'success'
                });
                this.taskRuleDialog = false
            })
        },
        // 自动分配
        automatic() {
            let {examId,keyword} = this.requestForm
            let allocationData = {examId,keyword}
            this.$api.teacher.allocation(allocationData).then(res => {
                if(res.status) {
                    this.$message({
                        message:'分配成功',
                        type: 'success'
                    });
                }
                this.getReadList()

            })
        },
        batchDelete() {
            if(!this.paperIds) {
                this.$message({
                    message: '请选择要删除的数据',
                    type: 'warning'
                });
                return
            }else {
                this.operations(this.paperIdList.length).then(() => {
                    this.$api.teacher.batchTeaDelete({paperIds:this.paperIds}).then(res =>{
                        this.getReadList()
                        if(res.status === 1) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    }).catch((err) => {
                        console.log(err)
                    });

                }).catch((err) => {
                        console.log(err)
                });
            }

        },
        delIdList(val) {
            let newDelList = []
            val.forEach(item => {
                newDelList.push(item.paperId)
            })
            this.paperIdList = newDelList
            this.paperIds = this.paperIdList + ''

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
            let { status,data } = await this.$api.teacher.ImportTeacherMark(formdata)
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

          // 导出教师
        handleExport() {
            if(!this.requestExport.exportRange && !this.paperIds) {
                this.$message({
                    message:'请选择需要导出的试卷！',
                    type: 'warning'
                });
                this.exportDialog = false
            }else {
                let {examId, keyword, markSetState} = this.requestForm
                let requestExportData = {
                    examId,
                    keyword,
                    markSetState,
                    paperIds:this.paperIds,
                   ...this.requestExport
                }
                this.$api.teacher.exportMarkSet(requestExportData).then(res =>{
                    this.exportDialog = false
                    if(res.status) {
                        window.open(res.data.fileName)
                    }
                })
            }

        },
        // 分配设置
        handleMarkSet(rowData) {
            this.assignSetDialog = true
            let {row} = rowData
            this.requestDetail.paperId = row.paperId
            this.getDetailList()
            this.getNotSetSequence()
        },


        // 二级页面
        // 获取详情
        getDetailList() {
                this.$api.teacher.getDetailList(this.requestDetail).then(res => {
                    res.data.rows.forEach(item=> {
                        if(item.maxNumber === -1) {
                            item.maxNumberChinese = '无限制'
                        }else {
                            item.maxNumberChinese = item.maxNumber
                        }
                    })
                this.detailTableData = res.data.rows
            })
        },
        // 获取分配结果
        getNotSetSequence() {
            this.detailPageExplain = ""
            this.$api.teacher.notSetSequence({paperId:this.requestDetail.paperId}).then(res => {
                if(res.data.value.length > 1) {
                    this.detailPageExplain = `第${res.data.value}大题仍未分配`
                }
            })
        },
        // 新增按钮
        addTeaNum() {
             // 清空数据
            this.requestDetailAdd = {
                setPaper: 1, //整卷
                sequence: [],
                userId: '', //新增的教师id
                maxNumber: ""
            }
            this.isIndeterminate = false
            this.detailRealName = ''
            this.addDetailDialog = true
            this.getPaperBindInfo()
        },
        // 获取试卷信息新增用
        getPaperBindInfo() {
            let paperId = {paperId:this.requestDetail.paperId}
            this.$api.teacher.getPaperBindInfo(paperId).then(res =>{
                this.sequenceList =res.data.sequenceInfo
                this.requestDetailAdd.sequence =res.data.sequenceInfo
                if (res.data.teacher.length > 1) {
                    this.requestDetailAdd.userId  = []
                }
                this.addTeaList = res.data.teacher
            })
        },
        handleCheckAllChange(val) {
           this.requestDetailAdd.sequence = val ? this.sequenceList : [];
           this.isIndeterminate = false;
        },
        sequenceChange(value) {
            let checkedCount = value.length;
            this.requestDetailAdd.setPaper = checkedCount === this.sequenceList.length;
            this.requestDetailAdd.setPaper = this.requestDetailAdd.setPaper*1
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.sequenceList.length;
        },
        // 新增详情
        handleDetailAdd(requestDetailAdd) {
            if(this.detailRealName) {
                this.$refs[requestDetailAdd].validate(valid=> {
                     if (valid) {
                        // 保存编辑
                        this.requestDetailAdd.sequence = this.requestDetailAdd.sequence + ''
                        if(this.requestDetailAdd.maxNumber === -1) {
                            this.requestDetailAdd.maxNumber = this.unlimited
                        }
                        let requestDetaileditData = {
                            paperId: this.requestDetail.paperId,
                            ...this.requestDetailAdd
                        }
                        this.$api.teacher.editSetDetail(requestDetaileditData).then(res =>{
                            if(res.status) {
                                this.$message({
                                    type: 'success',
                                    message: '编辑成功!'
                                });
                                this.getDetailList()
                            }
                            this.addDetailDialog = false
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            }else {
                // 新增
                this.$refs[requestDetailAdd].validate(valid=> {
                     if (valid) {
                        this.requestDetailAdd.userId = this.requestDetailAdd.userId + ''
                        this.requestDetailAdd.sequence = this.requestDetailAdd.sequence + ''
                        let requestDetailAddData = {
                            paperId: this.requestDetail.paperId,
                            ...this.requestDetailAdd
                        }
                        this.$api.teacher.addSetDetail(requestDetailAddData).then(res =>{
                            if(res.status) {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                });
                                this.getDetailList()
                            }
                            this.addDetailDialog = false

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            }



        },

        // 获取教师详情编辑用
        getTeaInfo(row) {
            this.unlimited = '无限制'
            this.addDetailDialog = true
            this.requestDetailAdd.userId =row.row.userId
            let paperTeaData = {paperId:this.requestDetail.paperId,userId:this.requestDetailAdd.userId}
            this.$api.teacher.getTeaInfo(paperTeaData).then(res =>{
                if(res.status) {
                    this.detailRealName =res.data.paperInfo.realName
                    this.sequenceList =res.data.sequenceInfo
                    this.requestDetailAdd.sequence = res.data.setSequence
                    this.requestDetailAdd.maxNumber = res.data.paperInfo.maxNumber
                    if(this.sequenceList.length == this.requestDetailAdd.sequence.length) {
                        this.requestDetailAdd.setPaper = 1
                        this.isIndeterminate = false;
                    }else {
                        this.requestDetailAdd.setPaper = 0
                        this.isIndeterminate = true;
                    }
                }

            })
        },
        // 确定编辑
        // 删除单条详情数据
        detailDelete(row) {
            let {userId,paperId} = row.row
            let deleteData = {
                userId,
                paperId
            }
            this.$confirm('确定要删除该项数据么?', '系统提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                roundButton:true,
                type: 'warning'
            }).then(() => {
                 this.$api.teacher.deleteMarkSet(deleteData).then(res =>{
                if(res.status) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getDetailList()
                    this.getReadList()
                }
                })

            }).catch(() => {

            });
        }
    },
    watch:{
        uploadDialog: {
            handler:'clearFile'
        },
        addDetailDialog(val) {
            if(!val) {
               this.$refs.requestDetailAdd.clearValidate()
            }
        }
    },
    mounted() {
        this.pageTitle = this.$route.meta.childrenTitle
        this.getTestPlan()
    }
}
</script>

<style scoped lang="less">
    .addForm {
        width: 280px;
    }
    .addForm /deep/ .el-select {
        width: 280px;
    }
    /deep/ .el-form-item__label{
        float: none;
    }
    .cor .el-radio {
        margin-right: 48px;
    }
    .colum .el-radio {
        margin-bottom: 16px;
    }
    .cor /deep/ .el-form-item__content, .colum /deep/ .el-form-item__content {
        line-height: 20px!important;
    }
    .cor /deep/ .el-form-item__label, .colum /deep/ .el-form-item__label {
        display: inline-block;
        margin-bottom: 8px!important;
        padding-bottom: 0!important;
    }
    .uploadFrom /deep/ .el-form-item__label {
        display: inline-block;
        margin-bottom: 8px!important;
        padding-bottom: 0!important;
    }
    /deep/ .el-form-item__content {
        margin-left: 0!important;
        line-height: 40px;
    }
    /deep/ .equence .el-form-item__content {
        display: flex;
    }
    /deep/ .allSequence {
        margin-right: 28px;
    }
    .uploadPlan {
        width: 280px;
    }
    .import-tips {
        .tips {
            color: #363940;
            font-size: 14px;
            font-weight: bold;
            margin-top: 20px;
        }
    }
    .tip-item {
        display: flex;
        color: #9599A6;
        font-size: 13px;
        margin-top: 8px;
        line-height: 1.5;
    }
    .imporFile {
        margin-bottom: 8px;
    }
    .childBox {
        margin-left: 18px;
    }
    .tip-item div:first-child {
        margin-right: 5px;
    }
    /deep/ .unDistributed {
        position: relative;
        margin-left: 10px;
        &:after {
            content: ' ';
            position: absolute;
            left: -10px;
            top: 7px;
            width: 5px;
            height: 5px;
            background-color: #F27900;
            border-radius: 50%;
        }
    }
    /deep/ .unFinish {
        position: relative;
        margin-left: 10px;
        &:after {
            content: ' ';
            position: absolute;
            left: -10px;
            top: 7px;
            width: 5px;
            height: 5px;
            background-color: #C2C4CC;
            border-radius: 50%;
        }
    }
    /deep/ .finish {
        position: relative;
        margin-left: 10px;
        &:after {
            content: ' ';
            position: absolute;
            left: -10px;
            top: 7px;
            width: 5px;
            height: 5px;
            background-color: #13CE66ed;
            border-radius: 50%;
        }
    }
    .addForm .allSequence {
        margin-right: 16px;
    }
    .addForm .el-checkbox {
        width: 64px;
    }
    .addForm /deep/ .el-form-item__label {
        display: inline-block;
        margin-bottom: 8px;
        padding-bottom: 0!important;
    }
</style>

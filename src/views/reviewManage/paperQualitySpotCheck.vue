<template>
	<div class="paperQualitySpotCheck-container">
		<div class="table-top">
			<el-breadcrumb separator-class="el-icon-arrow-right">
			    <el-breadcrumb-item >{{examName}}</el-breadcrumb-item>
			    <el-breadcrumb-item>
			    	<el-dropdown @command="handleCommand">
					  <span class="el-dropdown-link currentItem" :value="queryJson.currentPaperId">
					    {{currentPaperName}} <i v-if="papers.length>1" class="el-icon-arrow-down el-icon--right down"></i>
					  </span>
					  <el-dropdown-menu slot="dropdown" x-placement="bottom">
					    <el-dropdown-item v-for="item in papers"
					    	:command ="{paperId:item.key,paperName:item.value}"
						>{{item.value}}</el-dropdown-item>

					  </el-dropdown-menu>
					</el-dropdown>
				  <!--  <el-select size="medium" v-model="queryJson.currentPaperId" >
					   	<el-option v-for="item in papers"
							:value="item.key"
							:label="item.value"
							:key = "item.key"
		        		></el-option>
				   </el-select> -->
			    </el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<oms-table-group
			:title="pageTitle"
			:functionality-btn="functionalityBtn"
            :selectList="paperSelect"
            :request-form="queryJson"
            :tableList="tableData"
            :tableHeaderList="tableHerder"
            :option="tableOption"
            :paginationOptions="pageOptions"
            @changePage="changePage"
            @changeNum = "changeNum"
            @search="search"
            @handleSelectionChange = "selectChange"
        ></oms-table-group>
        <oms-custom-page
            :dialog.sync="isShowReview"
            title="批量打回重评"
        >
        	 <template v-slot:content>
        	 	<p>请选择打回重评的原因</p>
        	 	<el-radio-group v-model="reviewReason">
			      <el-radio-button label="1" >无评阅痕迹</el-radio-button>
			      <el-radio-button label="2" >评阅标准不当</el-radio-button>
			      <el-radio-button label="3" >问题试卷未标记</el-radio-button>
			      <el-radio-button label="4" >其他</el-radio-button>
			    </el-radio-group>
			    <el-input
				  type="textarea"
				  :rows="2"
				  resize="none"
				  v-model="memo">
				</el-input>

        	 </template>
        	  <template v-slot:footer>
                <el-button @click="isShowReview = false" round>取消</el-button>
                <el-button type="primary" round @click="batchRemark">确认</el-button>
            </template>
        </oms-custom-page>
	</div>
</template>
<script>
	export default	{
		name:"paperQualitySpotCheck",
		data(){
			return {
				examId:this.$route.params.examId,
				examName:this.$route.params.examName,
				isShowReview:false,
				pageTitle:"质检查询",
				reviewReason:"noMark",
				currentPaperName:"全部",
				memo:"",
				papers:[],
				paperSelect:[
					{
			        	title : '评阅标记',
			            type : 'select',
			            requestKey : 'feedbackType',
			            label : 'text',
			            value : 'id',
			            data : [
			            	{
				              id: "-1",
				              text: "全部",
				            },
				            {
				              id: "1",
				              text: "有",
				            },
				            {
				              id: "0",
				              text: "无",
				            },
				            {
				              id: "2",
				              text: "答案雷同",
				            },
				            {
				              id: "3",
				              text: "笔迹雷同",
				            },
				            {
				              id: "4",
				              text: "多种笔迹",
				            },
				            {
				              id: "5",
				              text: "作答与考题不符",
				            },
				            {
				              id: "6",
				              text: "其它",
				            },
			            ]
			        },
			        {
			        	title : '质检状态',
			            type : 'select',
			            requestKey : 'qualityType',
			            label : 'text',
			            value : 'id',
			            data : [
			            	{
				              id: "-1",
				              text: "全部",
				            },
				            {
				              id: "0",
				              text: "未质检",
				            },
				            {
				              id: "1",
				              text: "已通过",
				            },
				            {
				              id: "2",
				              text: "已订正",
				            },
				            {
				              id: "3",
				              text: "需重评",
				            },
				            {
				              id: "4",
				              text: "再质检",
				            },
			            ]
			        },
			        {
		          	 	title : '考生信息',
			            type : 'input',
			            requestKey : 'studentInfo',
			            val:"",
            			placeholder : '请输入学生信息'
			        },
			        {
		          	 	title : '教师信息',
			            type : 'input',
			            requestKey : 'teacherInfo',
			            val:"",
            			placeholder : '请输入教师信息'
			        }
				],
				functionalityBtn:[
					{
			            type: 'primary',
			            title: '批量打回重评',
			            plain: true,
			            size: 'small',
			            funClick: this.showReview
			          }
				],
				tableHerder:[
					{
			    		title:"考生批次",
			        	align:"center",
			        	prop:"examName",
			        	width:"180",
			        },
			        {
			    		title:"课程名称",
			        	align:"center",
			        	prop:"courseName",
			        },
			        {
			    		title:"卷别",
			        	align:"center",
			        	prop:"paperType",
			        },
			        {
			    		title:"考生姓名",
			    		fixed: "left",
			        	align:"center",
			        	prop:"studentName",
			        },
			        {
			    		title:"考生学号",
			        	align:"center",
			        	prop:"studentId",
			        },
			        {
			    		title:"考生层次",
			        	align:"center",
			        	prop:"levelName",
			        },
			        {
			    		title:"考点",
			        	align:"center",
			        	prop:"placeName",
			        },
			          {
			    		title:"客观题分数",
			        	align:"center",
			        	prop:"objectiveScore",
			        },
			        {
			    		title:"主观题分数",
			        	align:"center",
			        	prop:"subjectiveScore",
			        },
			        {
			    		title:"总分",
			        	align:"center",
			        	prop:"score",
			        },
			          {
			    		title:"评阅教师",
			        	align:"center",
			        	prop:"judgeUser",
			        },
			          {
			    		title:"最后评阅时间",
			        	align:"center",
			        	prop:"markDate",
			        },
			          {
			    		title:"评阅标记",
			        	align:"center",
			        	prop:"feedback",
			        },
			          {
			    		title:"质检状态",
			        	align:"center",
			        	prop:"qualityInfo",
			        	type:"tag",
			        },
			          {
			    		title: "操作",
			    		width:"180",
				        type: "buttons",
				        fixed: "right",
				        align: "center",
				        butList: []
			        },
				],
				tableData:[],
				queryJson:{
					currentPaperId:"-1",
					examId:this.examId,
					paperId:"-1",
					feedbackType: "-1",
					qualityType:"-1",
					studentInfo:"",
					teacherInfo:""
				},
				requestParams : {
		          _search : false,
		          nd : new Date().getTime(),
		          rows: 30,
		          page: 1,
		          sidx: 'markDate',
		          sord: 'asc'
		        },
		        tableOption : {
		          ismultiple : true,
		          // defaultProp : 'userName',
		          // defaultSort : 'ascending'
		        },
		        pageOptions : {
		          page : 1,
		          total : 0,
		          pageSize : 30
		        },
		        selectList:[],
			}
		},
		methods:{
		 	async	getExamMarkSetPaper(){
		 		let that = this;
		 		that.examId = that.$route.params.examId
				let data = {examId:that.examId }
				that.$api.reviewManage.getExamMarkSetPaper(data).then(res => {
					that.papers = [
						  {
				            value : '全部',
				            key : '-1'
				          },
				          ...res.data
					]
				})
			},
			handleCommand(command){
				this.queryJson.currentPaperId = command.paperId
				this.currentPaperName = command.paperName
				this.search()
			},
			changePage(p){
				this.$set(this.requestParams,'page',p)
		        this.search()
			},
			changeNum (n) {
		        this.requestParams.rows = n
		        this.search()
	      	},
			selectChange(rows){
				console.log(rows)
				this.selectList = [];
				rows.forEach(item => {
					this.selectList.push(item.examBarCode)
				})
			},
			search(){
				this.queryJson.paperId = this.currentPaperId
				let data = {
					examId:this.examId,
					paperId:this.queryJson.currentPaperId,
					feedbackType:this.queryJson.feedbackType ,
					qualityType:this.queryJson.qualityType,
					studentInfo:this.queryJson.studentInfo,
					teacherInfo:this.queryJson.teacherInfo,
				   ...this.requestParams,

				}
	        	this.$api.reviewManage.getPaperQualityDetailData(data).then(res=>{
	        		if(res.status==1){
						this.$set(this.pageOptions,'total',res.data.records)
						if(res.data.rows.length>0){
							res.data.rows.forEach(item => {
			                    if(item.qualityInfo === "已通过") {
			                        item.tagType = 'success'
			                        item.qualityInfo = '过'
			                    }else if(item.qualityInfo === "需重评") {
			                        item.tagType = 'danger'
			                        item.qualityInfo = '重'
			                    }else if(item.qualityInfo === "已订正") {
			                        item.tagType = 'success'
			                        item.qualityInfo = '订'
			                    }else if(item.qualityInfo === "未质检") {
			                        item.tagType = 'info'
			                        item.qualityInfo = '未'
			                    }else if(item.qualityInfo === "再质检") {
			                        item.tagType = 'info'
			                        item.qualityInfo = '再'
			                    }
			                    if(item.needQuality==1){
			                    	item.butList = [{
						        		title: "质检",
						                onClick: this.toQuality
						        	}]
			                    }else if(item.canSetBack==1){
			                    	item.butList = [{
						        		title: "查看",
						                onClick: this.toView
						        	},{
						        		title: "取消质检",
						                onClick: this.cancelQuality
						        	},]
			                    }else{
			                    	item.butList = [{
						        		title: "查看",
						                onClick: this.toView
						        	}]
			                    }
			                })

							this.examName = res.data.rows[0].examName

						}
						this.tableData = res.data.rows

					}
	        	})
			},
			batchRemark(){
				let that = this

				let data = {
					setType:that.reviewReason,
					setMemo:that.memo,
					examBarCode:that.selectList.join(",")
				}
				that.$api.reviewManage.saveBulkQuality(data).then(res => {
					if(res.status==1){
						this.$message({
				            type: 'success',
				            message: '设置成功!'
			          	});
					}
					this.isShowReview = false;
					this.search();
				})
				// this.isShowReview = true;

			},
			showReview(){
				if(this.selectList.length>0){
					this.memo="",
					this.reviewReason = 1;
					this.isShowReview = true;
				}else{
					this.$alert('请选择需要打回重评的数据', '提示', {
				        confirmButtonText: '确定',
				        roundButton:true,
				        callback: action => {
				            this.$message({
				              type: 'info',
				              message: `action: ${ action }`
				            });
			          	}
			        });
				}


			},
			cancelQuality(row){
				let that = this
				console.log(row)
				let data= {"examBarCode": row.row.examBarCode}
				that.$confirm('确认要取消质检吗?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          roundButton:true,
		          type: 'warning'
		        }).then(()=>{
		        	that.$api.reviewManage.cancelPaperQuality(data).then(res => {

		        		if(res.status==1){
		        			that.$message({
					            type: 'success',
					            message: '操作成功!'
				          	});
		        			that.search()
		        		}

		        	})
		        }).catch(() => {

		        });
			},
			toView(row){
				console.log(row)
				let routeUrl = this.$router.resolve({
				    path: "/Detail",
				    query: {ExamID:row.row.examId,CourseCode:row.row.courseCode,PaperID:row.row.paperId,ExamBarCode:row.row.examBarCode,paperType:row.row.paperType}
				});
				window.open(routeUrl.href,"_blank")
			},
			toQuality(row){
				console.log(row)
				let routeUrl = this.$router.resolve({
				    path: "/qualityDetail",
				    query: {ExamID:row.row.examId,CourseCode:row.row.courseCode,PaperID:row.row.paperId,ExamBarCode:row.row.examBarCode}
				});
				window.open(routeUrl.href,"_blank")
			}
		},
		mounted(){
			// this.examId = this.$route.params.examId

			this.getExamMarkSetPaper()
			this.search()
		}
	}
</script>
<style lang="less">
	.el-dialog__body{
		padding:10px 20px;
	}
	.el-breadcrumb{line-height:40px;}
	.table-top {margin-bottom:10px;}
	.el-radio-group{
		margin:10px 0;
		.el-radio-button__inner {
			border:1px dashed #DCDFE6
		}
	}
	.currentItem{
		font-size:22px;
		color:#15151A;
		font-weight: 500;
	}
	.down{
		display:inline-block;
		width:20px;
		height:20px;
		background: #FFFFFF;
		border-radius: 2px;
		line-height:20px;
		text-align:center;
		color:#9599A6;
		font-size:13px;
	}
</style>

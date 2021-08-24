<template>
    <div v-if="isShow">
		<el-tabs style="height: 100%;" @tab-click="changeTab" stretch>
			<el-tab-pane   v-for="(item,index) in tabList" :key="index" :label="item.examName" v-model="item.examId"  :value="item.examId" >
				<el-row :gutter="20" :name="item.examId">
				  <el-col  :xl="6"  :lg="12" >
					  	<el-card class="paperTemplate">
					  		  <div class="clearfix  header">
							    <span>试卷模板</span>
							  </div>
							  <div class="text card-con">
							    <span>默认模板</span> <a style="color:#3388FF">{{PaperTemplateSettingInfo.defaultTemplate}}</a>
							    <p v-if="PaperTemplateSettingInfo.templateSettingState!='未设置'">
									<span v-if="PaperTemplateSettingInfo.isOnlyDefaultTemplate">尚未使用其他试卷模板，请进行试卷模板分配</span>
									<span v-else>考试批次共关联模板 <span style="font-size:20px;color:#3388FF">{{PaperTemplateSettingInfo.totalTemplate}}</span> 个</span>
							    </p>
							    <p v-else>尚未使用其他试卷模板，请进行试卷模板分配</p>

							  </div>
							  <div class="clearfix btngroup">
							  		<el-button v-if="privilege.paperTemplateSet.privilege" @click="toPaperTemplate">模板管理</el-button>
							  		<el-button v-if="privilege.scanTemplate.privilege">变更模板</el-button>
							  </div>
					  	</el-card>
				  	</el-col>
				  <el-col   :xl="6"  :lg="12" >
				  		<el-card class="studentInfo">
					  		 <div  class="clearfix  header">
							   <span>考生信息</span>
							 </div>
							 <div class="card-con">
							  	<el-row v-if="StudentInfo.studentImportState!='未导入'" :gutter="20">
							  		 <el-col :span="8">
							  		 	<div>考生</div>
							  		 	<div><span class="num">{{StudentInfo.totalStudent}} </span> 人</div>
							  		 </el-col>
							  		 <el-col :span="8">
							  		 	<div>课程</div>
							  		 	<div><span class="num">{{StudentInfo.totalCourse}} </span> 门</div>
							  		 </el-col>
							  		 <el-col :span="8">
							  		 	<div>试卷</div>
							  		 	<div><span class="num">{{StudentInfo.totalPaper}} </span> 张</div>
							  		 </el-col>
							  	</el-row>
							  	<p v-else>还未导入考生信息，请导入</p>
							 </div>
							 <div class="clearfix btngroup">
						 		<el-button v-if="privilege.studentInfo.privilege" @click="toStuManage">考生管理</el-button>
						 		<el-button v-if="privilege.studentImport.privilege">导入考生</el-button>
							 </div>
					  	</el-card>
				  </el-col>
				  <el-col   :xl="6"  :lg="12" >
				  	<el-card class="examAnswer">
				  		<div  class="clearfix header">
						  <span>考卷答案</span>
						</div>
						<div class="card-con">
							<div v-if="StudentInfo.studentImportState=='未导入'">
								<span >考试批次未导入考生，无试卷需要设置答案</span>
						  		<p >完成设置才能进行试卷扫描 </p>
							</div>
							<div v-else>
								<span v-if="PaperAnswerSettingInfo.paperAnswerSettingState=='未设置'">未完成 完成设置才能进行试卷扫描 </span>
						  		<span v-else>设置完成 已导入全部答案</span>
								<p style="margin-top:8px;">试卷:<span class="num"> {{PaperAnswerSettingInfo.totalPaper}}</span> 份 未导入答案<span class="num"> {{PaperAnswerSettingInfo.unSettingPaper}}</span> 份</p>
							</div>
						  <span ></span>

						</div>
						<div class="clearfix btngroup">
							<el-button v-if='privilege.paperAnswer.privilege' @click="toSetAnswer">答案设置</el-button>
							<el-button v-if='privilege.importPaperAnswer.privilege'>批量导入</el-button>
						</div>
				  	</el-card>
				  </el-col>
				  <el-col  :xl="6"  :lg="12" >
				  	<el-card class='reviewRssignment '>
				  		<div  class="clearfix header">
						  <span>评阅分配</span>
						</div>
						<div class="card-con">
							<el-row v-if="StudentInfo.studentImportState!='未导入'" :gutter="20">
						  		<el-col :span="8">
						  			<div>未分配试卷</div>
						  			<div><span class="num">{{markSettingInfo.unSetPaper}}</span> 份</div>
						  		</el-col>
						  		<el-col :span="8">
						  			<div>已分配试卷</div>
						  			<div><span class="num">{{markSettingInfo.totalPaper}}</span> 张</div>
						  		</el-col>
						  		<el-col :span="8">
						  			<div>已分配评阅教师</div>
						  			<div><span class="num">{{markSettingInfo.totalTeacher}}</span> 人</div>
						  		</el-col>
						  	</el-row>
						  <p v-else>考试批次未导入考生，无试卷需要分配评阅教师</p>
						</div>
						<div class="clearfix btngroup">
							<el-button v-if="privilege.teacherManage.privilege" @click="toTeaManage">教师管理</el-button>
							<el-button v-if='privilege.teacherMark.privilege' @click="toTeaRead">分配评阅教师</el-button>
							<el-button v-if='privilege.teacherMarkImport.privilege'>分配结果导入</el-button>
						</div>
				  	</el-card>
				  </el-col>
				</el-row>
				<el-row :gutter="20" :name="item.examId" :key = "item.examId" v-if="item.examId==examId">
				  	<el-col :span="12"  >
					  	<div  class="chartItem" id="miss_chart"></div>
				  	</el-col>
				  	<el-col :span="12">
					  	<div  class="chartItem" id="scan_chart"></div>
				  	</el-col>
				  	<el-col :span="12">
					  	<div class="chartItem" id="review_chart"></div>
				  	</el-col>
				  	<el-col :span="12">
					  	<div class="chartItem" id="score_chart"></div>
				  	</el-col>
				</el-row>
			</el-tab-pane>

		    <!-- <el-tab-pane label="用户管理">用户管理</el-tab-pane>
		    <el-tab-pane label="配置管理">配置管理</el-tab-pane>
		    <el-tab-pane label="角色管理">角色管理</el-tab-pane>
		    <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane> -->
		</el-tabs>

    </div>


</template>
<script>
export default {
    name:"index",
    data(){
    	return {
    		examId:"",
    		tabList:[],
    		isShow:1,
			markSettingInfo: {
				MarkSettingState: "",
				TotalPaper: 0,
				UnSetPaper: 0,
				TotalTeacher: 0
			},
			PaperAnswerSettingInfo: {
				paperAnswerSettingState: "",
				totalPaper: 0,
				unSettingPaper: 0
			},
			PaperTemplateSettingInfo: {
				TemplateSettingState: "",
				DefaultTemplate: "",
				IsOnlyDefaultTemplate: "",
				TotalTemplate:0
			},
			StudentInfo: {
				studentImportState: "",
				TotalStudent: 0,
				TotalCourse: 0,
				TotalPaper: 0
			},
			privilege:{},
			attendanceInfo: {
				totalAttendance: 0,
				illegalCount: 0,
				missCount: 0
			},
			gradeInfo: {
				eighty: 0,
				fifty: 0,
				forty: 0,
				hundred: 0,
				ninety: 0,
				seventy: 0,
				sixty: 0,
				ten: 0,
				thirty: 0,
				twenty: 0,
				zero: 0
			},
			onlineReviewInfo: {
				courseMarkInfo: {
					courseCount: 0,
					reviewCourseCount: 0
				},
				paperMarkInfo: {
					normalStudentCount: 0,
					reviewStudentCount: 0
				}
			},
			scanInfo: {
				scannedCount: 0,
				unscannedCount: 0
			},
			miss_chart :"",
			scan_chart :"",
			review_chart:"",
			score_chart :"",
	    }
    },
    methods:{
    	getControlPanelData(){
    		let that = this;

    		that.$api.index.getControlPanelData().then(res => {
    			if(res.status==1){
    				if(res.data.haveExam){
    					that.tabList = res.data.examList
		    			that.examId = res.data.examSettingInfo.examId
		    			that.markSettingInfo  = res.data.examSettingInfo.markSettingInfo
						that.PaperAnswerSettingInfo = res.data.examSettingInfo.paperAnswerSettingInfo
						that.PaperTemplateSettingInfo = res.data.examSettingInfo.paperTemplateSettingInfo
						that.StudentInfo = res.data.examSettingInfo.studentInfo
						that.privilege = res.data.privilege
						this.getStatistics()
    				}else{

    				}

    			}
    		})


    	},
    	getStatistics(){

    		let that = this
    		let data = {examId:this.examId }
    		that.$api.index.getStatistics(data).then(res => {
    			that.attendanceInfo = res.data.statisticsInfo.attendanceInfo
				that.gradeInfo = res.data.statisticsInfo.gradeInfo
				that.onlineReviewInfo = res.data.statisticsInfo.onlineReviewInfo
				that.scanInfo = res.data.statisticsInfo.scanInfo

				setTimeout(function(){
					 that.drawChars()
				},500)

    		})
    	},
    	//模板管理
    	toPaperTemplate(){
    		this.$router.push({path:'/examination-template'})
    	},
    	toStuManage(){
    		this.$router.push({path:'/stuManagement'})
    	},
    	toSetAnswer(){
    		this.$router.push({path:'/examination-answer'})
    	},
    	toTeaManage(){
    		this.$router.push({path:'/teaManagement'})
    	},
		toTeaRead(){
			this.$router.push({path:'/teaRead'})
		},
    	changeTab(e){
    		this.examId = e.$attrs.value
    		let that = this
    		let data = {examId:this.examId }

    		this.$api.index.getExamPlanSettingInfo(data).then(res => {
    			that.markSettingInfo  = res.data.markSettingInfo
				that.PaperAnswerSettingInfo = res.data.paperAnswerSettingInfo
				that.PaperTemplateSettingInfo = res.data.paperTemplateSettingInfo
				that.StudentInfo = res.data.studentInfo

    		})
    		this.getStatistics()
    	},
    	drawChars(){
    		this.miss_chart.dispose()
			this.scan_chart.dispose()
			this.review_chart.dispose()
			this.score_chart.dispose()
    		this.miss_chart = this.$echarts.init(document.getElementById("miss_chart"))
    		this.scan_chart = this.$echarts.init(document.getElementById("scan_chart"))
    		this.review_chart = this.$echarts.init(document.getElementById("review_chart"))
    		this.score_chart = this.$echarts.init(document.getElementById("score_chart"))

    		let miss_option = {
    			color: ['#6cd39d'],
	            title: {
	                text: '缺考违纪统计'
	            },
	            grid: {
	                left: '3%',
	                right: '4%',
	                bottom: '3%',
	                containLabel: true
	            },
	            tooltip: {
	                trigger: 'axis',
	                axisPointer: {
	                    type: 'shadow'
	                }
	            },
	            xAxis: [
		            {
		            	type: 'category',
	                	data: ['缺考', '违纪'],//, '停考'
                	  	axisLabel: {
				            textStyle: {
				                color: '#fff'
				            },
				            interval:0,//横轴信息全部显示
				        },
	                  	axisLine: {
				            show: true,
				            lineStyle:{
	                            color:'#cccccc',
	                        }

				        },
		            }
	            ],
	            yAxis: {},
	            series: [
	                {
	                    name: '人数',
	                    type: 'bar',
	                    barWidth: '60',
	                    label: {
			                show: true,
			                position: 'inside',
			                color:"rgba(255,255,255,0.75)"
			            },
	                    data: [this.attendanceInfo.missCount, this.attendanceInfo.illegalCount],
                        itemStyle: {
			                color: new this.$echarts.graphic.LinearGradient(
			                    0, 0, 0, 1,
			                    [
			                        {offset: 0, color:  '#1FCCAF'},
			                        {offset: 1, color: '#16B8D9'}
			                    ]
			                )
			            }
	                }
	            ]
    		}
    		let scan_option = {
			    color: ['#6bd29e', '#74a0f6'],
	            title: {
	                text: '扫描统计'
	            },
	            tooltip: {
	                trigger: 'item',
	            },
	            legend: {
	                orient: 'vertical',
	                x: 'right',
	                data: ['已扫描', '未扫描']
	            },
	            series: [
	                {
	                    name: '数量',
	                    type: 'pie',
	                    radius: ['50%', '70%'],
	                    avoidLabelOverlap: false,
	                  	label: {
	                  		formatter: '{b}：{c} ',
			                show:true,
			            },
			            labelLine: {
			                lineStyle: {
			                    color: 'rgba(0, 0, 0, 0.3)'
			                },
			                smooth: 0.2,
			                length: 10,
			                length2: 20
			            },
	                    data: [
	                        {
	                        	value:this.scanInfo.scannedCount,
                        		name: '已扫描',
                        		itemStyle: {
					                color: new this.$echarts.graphic.LinearGradient(
					                    0, 0, 0, 1,
					                    [
					                        {offset: 0, color:  '#26DFB4'},
					                        {offset: 1, color: '#16B8D9'}
					                    ]
					                ),
					                borderRadius:2
					            }
                         	},
	                        {
	                        	value: this.scanInfo.unscannedCount,
	                        	name: '未扫描',
	                        	itemStyle: {
					                color: new this.$echarts.graphic.LinearGradient(
					                    0, 0, 0, 1,
					                    [
					                        {offset: 0, color:  '#4552E6'},
					                        {offset: 1, color: '#9130F2'}
					                    ]
					                )
					            }
					        },
	                    ]
	                }
	            ]
    		}
    		let review_option = {
	            title: {
	                text: '评阅统计'
	            },
	            tooltip: {
	                trigger: 'axis',
	                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
	                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	                }
	            },
	            legend: {
	                data: ['已评(%)', '未评(%)'],
	            },
	            grid: {
	                left: '3%',
	                right: '4%',
	                bottom: '3%',
	                containLabel: true
	            },
	            xAxis: [
	                {
	                    type: 'category',
	                    data: ['课程', '试卷'],
	                    axisLabel: {
				            textStyle: {
				                color: '#363940'
				            },
				            interval:0,//横轴信息全部显示
				        },
                    	axisLine: {
				            show: true,
				            lineStyle:{
	                            color:'#cccccc',
	                        }

				        },
	                }
	            ],
	            yAxis: [
	                {
	                    type: 'value',
	                    axisLabel: {
	                        formatter: '{value} %'
	                    }
	                }
	            ],
	            series: [
	                {
	                    name: '已评',
	                    type: 'bar',
	                    barWidth: '60',
	                    label: {
			                show: true,
			                position: 'inside',
			                color:"rgba(255,255,255,0.75)"
			            },
	                    itemStyle: {
	                        normal: {
	                            label: {
	                            	show:true,
	                                formatter: '{a}\n{c}%',

	                            },
	                            color: new this.$echarts.graphic.LinearGradient(
				                    0, 0, 0, 1,
				                    [
				                        {offset: 0, color:  '#26DFB4'},
				                        {offset: 1, color: '#16B8D9'}
				                    ]
				                )
	                        },


	                    },
	                    data: [Math.round(this.onlineReviewInfo.courseMarkInfo.reviewCourseCount * 100 / this.onlineReviewInfo.courseMarkInfo.courseCount), Math.round(this.onlineReviewInfo.paperMarkInfo.reviewStudentCount * 100 / this.onlineReviewInfo.paperMarkInfo.normalStudentCount)]

	                },
	                {
	                    name: '未评',
	                    type: 'bar',
	                    barWidth: '60',
	                    itemStyle: {
	                        normal: {
	                            label: {
	                            	show:true,
	                                formatter: '{a}\n{c}%'
	                            },
	                            color: new this.$echarts.graphic.LinearGradient(
				                    0, 0, 0, 1,
				                    [
				                        {offset: 0, color:  '#4552E6'},
				                        {offset: 1, color: '#9130F2'}
				                    ]
				                )
	                        },
	                    },
	                    label: {
			                show: true,
			                position: 'inside',
			                color:"rgba(255,255,255,0.75)"
			            },
	                    data: [100 - Math.round(this.onlineReviewInfo.courseMarkInfo.reviewCourseCount * 100 / this.onlineReviewInfo.courseMarkInfo.courseCount), 100 - Math.round(this.onlineReviewInfo.paperMarkInfo.reviewStudentCount * 100 / this.onlineReviewInfo.paperMarkInfo.normalStudentCount)]
	                },

	            ]
    		}
    		let score_option = {
    			color: ['#688cfa'],
	            title: {
	                text: '成绩分布'
	            },
	            tooltip: {
	                trigger: 'axis'
	            },
	            grid: {
	                left: '3%',
	                right: '4%',
	                bottom: '3%',
	                containLabel: true
	            },
	            xAxis: {
	                type: 'category',
	                boundaryGap: true,
	                data: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100']
	            },
	            yAxis: {
	                name: '人',
	                type: 'value'
	            },
	            series: [
	                {
	                    name: '人数',
	                    // symbol: 'none',
	                    smooth: 0.4,
	                    type: 'line',
	                    lineStyle: {
			                width: 5
			            },
	                    label: {
			                show: true,
			                position: 'top'
			            },
	                    data: [this.gradeInfo.zero, this.gradeInfo.ten, this.gradeInfo.twenty, this.gradeInfo.thirty, this.gradeInfo.forty, this.gradeInfo.fifty, this.gradeInfo.sixty, this.gradeInfo.seventy, this.gradeInfo.eighty, this.gradeInfo.ninety, this.gradeInfo.hundred],
	                    itemStyle: {
			                color: new this.$echarts.graphic.LinearGradient(
			                    0, 0, 0, 1,
			                    [
			                        {offset: 0, color:  '#58CA8A'},
			                        {offset: 0.5, color:  '#0EB4DB'},
			                        {offset: 1, color: '#198CFF'}
			                    ]
			                )
			            }
	                }
	            ]
    		}
    		this.miss_chart.setOption(miss_option);
    		this.scan_chart.setOption(scan_option);
    		this.review_chart.setOption(review_option);
    		this.score_chart.setOption(score_option);

    		window.addEventListener('resize', () => {
		        this.miss_chart.resize();
		        this.scan_chart.resize();
		        this.review_chart.resize();
		        this.score_chart.resize();
		    });

    	}
    },
    async mounted(){

    	await this.$api.index.getShowClient().then(res=>{
    		let that = this
    		console.log(res)
    		if(!res.data.showFirstPage){
             	that.isShow = 0;
             }
		})
		if(this.isShow){
			this.getControlPanelData()
		}

    	let that = this;
    	setTimeout(() => {


			that.miss_chart = that.$echarts.init(document.getElementById("miss_chart"),'light')
			that.scan_chart = that.$echarts.init(document.getElementById("scan_chart"),'light')
			that.review_chart = that.$echarts.init(document.getElementById("review_chart"),'light')
			that.score_chart = that.$echarts.init(document.getElementById("score_chart"),'light')
	      	that.getStatistics()
	    },1000)



    }
}

</script>
<style lang="less"  scoped>
    .index-content {
        height: 1900px;
    }
    /deep/ .el-button+.el-button{margin-left:20px;}
	/deep/ .el-tabs__nav-wrap {
		padding-bottom: 12px;
	}
    /deep/ .el-tabs__nav-wrap::after{
    	height:0;
    }

    /deep/ .el-tabs__item{
    	font-size: 20px;
    	font-weight: 400;
		color: #626673;
    }
    /deep/ .el-tabs__item.is-active{
    	font-size: 28px;
    	font-weight: 600;
		color: #15151A;
    }
	/deep/ .el-tabs__nav-scroll {
		width:50%;
		margin:0 auto
	}
	.btngroup button{
		width:120px;
		height:40px;
	}
   	.paperTemplate{
   		color:#626673;
   		p{margin-top:8px;}
   		background: linear-gradient(180deg, #E7F1FF 0%, #CCE1FF 100%);
   		.btngroup button{
   			background: #3388FF;
   			border:0;
			color:#fff
   		}
   	}
   	.studentInfo{
   		.card-con{
   			span,p{
   				color:#597980;
   			}
   			.num{
	   			font-size:20px;
	   			color:#0996B3
	   		}
   		}

   		background: linear-gradient(180deg, #DCF1F5 0%, #BAEDF7 100%);
   		.btngroup button{
   			background: #0AACCC;
   			border:0;
			color:#fff
   		}
   	}
   	.examAnswer{
		.card-con{
			span{
				color:#708C83;
			}
			p{
	   			color:#708C83;
	   			margin-top:8px;
	   		}
   			.num {font-size:20px;color:#12B37D;font-weight:500}
		}
   		background: linear-gradient(180deg, #DBF2EA 0%, #B6F2DE 100%);
   		.btngroup button{
   			background: #12B37D;
   			border:0;
			color:#fff
   		}
   	}
   	.reviewRssignment {
   		.card-con{
   			p{
				color:#797C96;
   			}
   			.num {font-size:20px;color:#6673FF}
   		}

   		background: linear-gradient(180deg, #E7EAFF 0%, #CCD1FF 100%);
   		.btngroup button{
   			background: #6673FF;
   			border:0;
			color:#fff;
			width:auto;
   		}
   	}
    /deep/ .el-card{
    	height:200px;
		border-radius: 6px;
		margin-bottom:15px;
		border: 0;
    	/deep/ .el-card__header {
			padding:22px 24px 0;
			border-bottom:0 none;
    	}
    	.header{
    		font-size:18px;
    		color:#363940;
    		font-weight:500;
    	}
    	/deep/ .el-card__body{

    	}
    	.card-con{
    		padding:18px 0 24px;
    		height:93px;
    		box-sizing:border-box;
    		font-size:14px;
    		color:#626673
    	}
    	.btngroup{
    		text-align:center;

    	}
    }
    .chartItem{
    	/*width:782px;*/
    	padding:16px 24px;
    	margin-top:20px;
    	height:238px;
    	background:#fff
    }
</style>

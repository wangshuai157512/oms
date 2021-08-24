<template>
	<div class="teacherQuality-container">
			<div class="table-top">
	       <el-dropdown @command="handleCommand">
			  <span class="el-dropdown-link currentItem" :value="currentExamId">
			    {{currentExamName}} <i v-if="exams.length>1" class="el-icon-arrow-down el-icon--right down"></i>
			  </span>
			  <el-dropdown-menu slot="dropdown" x-placement="bottom">
			    <el-dropdown-item v-for="item in exams" 
			    	:command ="{examId:item.examId,examName:item.examName}"
				>{{item.examName}}</el-dropdown-item>
			 
			  </el-dropdown-menu>
			</el-dropdown>    
			<div class="btngroup">
		        <el-button><i class="btnItem refresh" @click="getQualityPaperData"></i></el-button>
				<el-button><i class="btnItem sort" @click="resort"></i></el-button>
				<el-button><i class="btnItem list" @click="showCard('list')" :class="{active:isshowList}"></i></el-button>
				<el-button><i class="btnItem card" @click="showCard('card')" :class="{active:isshowCard}"></i></el-button>
	        </div>

		</div>
		<div>
			<template v-if="!isshowCard">
				<el-card class="paperItem" v-for="item in paperData">
					<div class="left">
						<div class="paperName">{{item.courseName}} <el-tag style="margin-left:10px;" size="mini" >{{item.paperType}}卷</el-tag></div>
						<div class="qualityNum">
							质检通过: <span class="qualityPassCount">{{item.qualityPassCount}}</span>
							质检订正: <span class="qualityNoPassCount">{{item.qualityNoPassCount}}</span>
							未质检: <span class="doReviewSum">{{item.doReviewSum}}</span>
							质检未通过: <span class="backReview">{{item.backReview}}</span>
							再质检: <span class="reBackReview">{{item.reBackReview}}</span>
						</div>
					</div>
					<div class="right btnGroup">
						<!-- <el-button type="text" href=""  v-if="item.otsPaperId">查看原卷</el-button>
						<el-button type="text"  v-else-if="item.localAddress" :href="item.localAddress" :download="item.courseName">下载原卷</el-button>
						<el-button type="text"  :href="item.localAnswerAddress" v-if="item.localAnswerAddress" :download="item.courseName">下载答案</el-button> -->
						<el-button size="mini" round :examId='item.examId' :CourseCode='item.courseCode' :PaperID='item.paperId' :PaperType='item.paperType' type="primary" @click="toQuality($event)">质检</el-button>

					</div>

				</el-card>
			</template>

			<template v-else>
				<el-row :gutter="10">
			 		<el-col :span="6" v-for = "item in paperData">
			 			<el-card class="paperItem mini" >

					  		<div  class="clearfix  paperName">
							 	<div class="left nameCon">{{item.courseName}}<el-tag size="mini" >{{item.paperType}}卷</el-tag></div>

							 <!-- 	<div class="right">
							 		<el-dropdown>
									  <span class="el-dropdown-link">
									    ...
									  </span>
									  <el-dropdown-menu slot="dropdown">



									    <el-dropdown-item><el-button class="" type="text" v-if="item.otsPaperId">查看原卷</el-button>
											<el-button class="" type="text" v-else-if="item.localAddress">下载原卷</el-button></el-dropdown-item>
									    <el-dropdown-item  v-if="item.localAnswerAddress"><el-button type="text">下载答案</el-button></el-dropdown-item>

									  </el-dropdown-menu>
									</el-dropdown>
							 	</div>					  -->
							</div>
							<div class="line"></div>
							<div class="card-con">
							 	<el-row :gutter="20">

							 		<el-col :span="8">
							 			<div class="paperStatus">质检通过</div>
							 			<div class="qualityPassCount">{{item.qualityPassCount}}</div>
							 		</el-col>
							 		<el-col :span="8">
							 			<div class="paperStatus">质检订正</div>
							 			<div class="qualityNoPassCount">{{item.qualityNoPassCount}}</div>
							 		</el-col>
							 		<el-col :span="8">
							 			<div class="paperStatus">未质检</div>
							 			<div class="doReviewSum">{{item.doReviewSum}}</div>
							 		</el-col>
							 		<el-col :span="8">
							 			<div class="paperStatus">质检未通过</div>
							 			<div class="backReview">{{item.backReview}}</div>
							 		</el-col>
							 		<el-col :span="8">
							 			<div class="paperStatus">再质检</div>
							 			<div class="reBackReview">{{item.reBackReview}}</div>
							 		</el-col>
							 	</el-row>
							</div>
							<div class="footer">
								<el-button size="mini" round :examId='item.examId' :CourseCode='item.courseCode' :PaperID='item.paperId' :PaperType='item.paperType' type="primary" @click="toQuality($event)">质检</el-button>

							</div>
						</el-card>
			 		</el-col>

			 	</el-row>

			</template>
		</div>

	</div>
</template>
<script>
	export default{
		name:"teacherQuality",
		data(){
			return {
				isshowCard:false,
				isshowList:true,
				orderType:0,
				paperData:[],
				exams:[],
				currentExamId:"",
				currentExamName:"",

			}
		},
		methods:{
			async getQualityExamPlan(){

				let that = this
				that.$api.reviewManage.getQualityExamPlan().then(res => {
					if(res.status==1){
						that.exams = res.data
						that.currentExamId = res.data[0].examId
						that.currentExamName = res.data[0].examName
						that.getQualityPaperData()
					}

				})

			},
			getQualityPaperData(){
				let that = this;
				let data = {
					orderType : this.orderType,
					examId : this.currentExamId,
					// examId:2180
				}
				that.$api.reviewManage.getQualityPaperData(data).then(res => {
					console.log(res)
					this.paperData = res.data
				})
			},
			handleCommand(command){
				this.currentExamId = command.examId
				this.currentExamName = command.examName
				this.getQualityPaperData()
			},
			search(e){
				console.log(e)
				this.currentExamId = e;

				this.getQualityPaperData()
			},
			showCard(item){
				console.log(item)
				if(item=="list"){
					this.isshowCard = false
					this.isshowList = true
				}else{
					this.isshowCard = true
					this.isshowList = false
				}
			},
			resort(){
				this.orderType = this.orderType == 1 ? 0:1
				this.getQualityExamPlan()
			},
			toQuality(e){
				this.$router.push({
					name:'paperQualitySpotCheck',
					params:{
						examId: this.currentExamId,
						examName:this.currentExamName
					}
				})
				
			}
		},
		mounted(){
			this.getQualityExamPlan()
		}
	}
</script>
<style lang="less" scoped>
	.left{float:left}
	.right{float:right}
	.el-button{
		min-width:0!important;
		padding:0 !important
	}
	.table-top{
		padding-top:16px;
		margin-bottom:24px;
		.btngroup{
			float:right;
			.el-button{
				min-width:0 !important;
				width:44px !important;
				height:32px;
				background:#fff;
				border-radius: 3px;
				border: 1px solid #E1E3E8;
				padding:4px 10px !important
			}
			.btnItem{
				height:24px;
				width:24px;
				display:inline-block
			}
			.refresh {background:url("/img/refresh.png")}
			.sort {background:url("/img/sort.png")}
			.list.active {background:url("/img/list.png")}
			.list {background:url("/img/listg.png")}
			.card {background:url("/img/card.png")}
			.card.active {background:url("/img/carda.png")}
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
	}
	.paperItem{
		height:82px;
		border:0;
		border-radius: 4px;
		box-shadow:none;
		margin-bottom:12px;
		/deep/ .el-card__body{
			padding:16px 24px;
		}
		.reviewBtn{
			min-width:64px !important;
			height:24px;
			line-height:24px;
			padding:0 !important;

		}
		.el-tag--mini{margin-left:4px;}
		font-weight:400;
		.downTemplate {
	        display: inline-block;
	        margin-right:20px;
	        color: #3388FF;
	        font-size: 13px;
	        text-decoration: none;
	    }
		.paperName{
			font-size:16px;
			color: #363940;
			margin-bottom:16px;
			height:18px;
		}
		.paperStatus{
			margin-bottom:11px;
		}
		.qualityNum{
			font-size:13px;
			color: #9599A6;		
			height:18px;
			.qualityPassCount,.qualityNoPassCount{
				color: #12B355;
				font-size:16px;
				padding:0 50px 0 5px;
			}
			.doReviewSum{				
				color: #3388FF;
				font-size:16px;
				padding:0 50px 0 5px;
			}
			.backReview{
				color: #FE5958;
				font-size:16px;
				padding:0 50px 0 5px;
			}
			.reBackReview{
				color: #FF860D;
				font-size:16px;
				padding:0 50px 0 5px;
			}
		}
		.btnGroup{
			line-height:52px;
			.el-button{
				width:64px;
				height:24px;
				padding:0;
				line-height:24px
			}
		}
	}
	.paperItem.mini{		
		height:285px;
		.paperName{
			height:40px;
			margin-bottom:0;
			.nameCon{
				width:290px;
				white-space:nowrap;
				overflow:hidden;
				text-overflow:ellipsis
			}			
		}
		.line{
			
			margin-left:-24px;
			height:1px;
			background:#EBEEF5;
		}
		.card-con{
			text-align:center;
			margin-top:20px;
			margin-bottom:8px;
			font-size:14px;
			color:#9599A6;
			.el-col{margin-bottom:20px;text-align:center;}
			.qualityPassCount,.qualityNoPassCount{
				color: #12B355;
				font-size:16px;
				
			}
			.doReviewSum{				
				color: #3388FF;
				font-size:16px;

			}
			.backReview{
				color: #FE5958;
				font-size:16px;

			}
			.reBackReview{
				color: #FF860D;
				font-size:16px;

			}
		}
		.footer{
			text-align:center;
			/deep/ .el-button{
				width:90px;
				height:30px;
				font-size:14px;
				font-weight:600;
			}
		}

	}
</style>

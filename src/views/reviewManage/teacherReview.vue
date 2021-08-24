<template>
	<div class="teacherReview-container">
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
	       <!--  <el-select size="medium" :value="currentExamId" @change="search">
	        	<el-option v-for="item in exams"
					:value="item.examId"
					:label="item.examName"
					:key = "item.examId"
	        	></el-option>
	        	
	        </el-select> -->
			<div class="btngroup">
				<el-button><i class="btnItem refresh" @click="getReviewList"></i></el-button>
				<el-button><i class="btnItem sort" @click="resort"></i></el-button>
				<el-button><i class="btnItem list" @click="showCard('list')" :class="{active:isshowList}"></i></el-button>
				<el-button><i class="btnItem card" @click="showCard('card')" :class="{active:isshowCard}"></i></el-button>
		      <!--   <el-button
		          v-for="(item, index) in functionalityBtnList"
		          :key="index"
		          :value="item.value"
		          :type="item.type || 'primary'"
		          :disabled="item.disabled"
		          :plain="item.plain || true"
		          :size="item.size || 'mini'"
		          round
		          @click="item.funClick && item.funClick(item)"
		          ><i   :style="{backgroundImage : `url(${item.src})`,height:'24px',width:'24px',display:'inline-block'}"></i>
		          
		        </el-button>	   -->
	        </div>
	      
		</div>
		<div>
			<template v-if="isshowList">
				<el-card class="paperItem" v-for="item in paperData">
					<div class="left">
						<div class="paperName">{{item.courseName}} <el-tag size="mini" >{{item.paperType}}卷</el-tag></div>
						<div class="reviewNum">
							已评阅: <span class="doReview">{{item.doReview}}</span> 未评阅:<span class="waitReview">{{item.waitReview}}</span> 需重评: <span class="waitReReview">{{item.waitReReview}}</span>
						</div>
					</div>
					<div class="right btnGroup">
					
						<el-button type="text" @click="viewOtsPaper($event)" :otsPaperId="item.otsPaperId" :examId="item.examId" v-if="item.otsPaperId">查看原卷</el-button>
							
					 	<a :href="item.localAddress" v-else-if="item.localAddress" class="downTemplate">下载原卷</a>				
								 
					 	<a :href="item.localAnswerAddress" v-if="item.localAnswerAddress" class="downTemplate">下载答案</a>	
						
						<el-button class="reviewBtn" round :examId='item.examId' :CourseCode='item.courseCode' :PaperID='item.paperId' :PaperType='item.paperType' type="primary" @click="toReview($event)">评阅</el-button>
						
					</div>

				</el-card>
			</template>

			<template v-else>
				<el-row :gutter="10">
			 		<el-col :span="6" v-for = "item in paperData">
			 			<el-card class="paperItem mini" >

					  		<div  class="clearfix  paperName">
							 	<div class="left nameCon">{{item.courseName}}<el-tag style="margin-left:10px;" size="mini" >{{item.paperType}}卷</el-tag></div>	
							 	
							 	<div class="right" v-if="item.otsPaperId || item.otsPaperId || item.localAnswerAddress">
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
							 	</div>					    
							</div>
							<div class="line"></div>
							<div class="card-con">
							 	<el-row :gutter="20">
							 		<el-col :span="8">
							 			<div class="paperStatus">已评阅</div>
							 			<div class="doReview">{{item.doReview}}</div>
							 		</el-col>
							 		<el-col :span="8">
							 			<div class="paperStatus">未评阅</div>
							 			<div class="waitReview">{{item.waitReview}}</div>
							 		</el-col>
							 		<el-col :span="8">
							 			<div class="paperStatus">需重评</div>
							 			<div class="waitReReview">{{item.waitReReview}}</div>
							 		</el-col>
							 	</el-row>
							</div>	
							<div class="footer">
								<el-button size="mini" round :examId='item.examId' :CourseCode='item.courseCode' :PaperID='item.paperId' :PaperType='item.paperType' type="primary" @click="toReview($event)">评阅</el-button>
								
							</div>				
						</el-card>
			 		</el-col>
			 		
			 	</el-row>
				
			</template>
		</div>
		
	</div>
</template>
<script>
	export default {
		name:"teacherReview",
		data(){
			return {
				pageTitle:"",
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
			getReviewList(){
			
				let that = this
				let data = {orderType:this.orderType}
				that.$api.reviewManage.getOnlineReviewExamPlan().then(res => {
					if(res.status==1){
						that.exams = res.data.examList
						that.currentExamId = res.data.examList[0].examId
						that.currentExamName = res.data.examList[0].examName
						that.getOnlineReviewData()

					}
					
				})

			},
			getOnlineReviewData(){
				let that = this;
				let data = {
					orderType : this.orderType,
					examId : this.currentExamId,
					// examId:2180
				}
				that.$api.reviewManage.getOnlineReviewData(data).then(res => {
					console.log(res)
					this.paperData = res.data
				})
			},
			handleCommand(command){
				this.currentExamId = command.examId
				this.currentExamName = command.examName
				this.getOnlineReviewData()
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
				this.getOnlineReviewData()
			},
			toReview(e){	
				console.log(e)		
				let examId = e.currentTarget.getAttribute("examid")
				let courseCode = e.currentTarget.getAttribute("courseCode")
				let paperId = e.currentTarget.getAttribute("paperId")
				let paperType = e.currentTarget.getAttribute("paperType")				
				
				let {href} = this.$router.resolve({
					name: "onlineReview",
					query: {
						examId:examId,
						courseCode:courseCode,
						paperID:paperId,
						paperType:paperType,
						examBarCode:"-1",
						key:"0"
					}

				});
				console.log(href)
				 window.open(href,"_blank")
				// this.$router.push({
				// 	name: "onlineReview",
				//     params: {examId:examId,CourseCode:courseCode,PaperID:paperId,PaperType:paperType,ExamBarCode:"-1",key:"0"}
				// })
			},
			search(e){
				console.log(e)
				this.currentExamId = e;
				
				this.getOnlineReviewData()
			},
			viewOtsPaper(e){
				let examId = e.currentTarget.getAttribute("examid")
				let otsPaperId = e.currentTarget.getAttribute("otspaperid")
				
				let href="/PaperAnswer/PreviewOTSPaper?paperid="+otsPaperId+"&examId="
				+examId+""
				window.open(href,"_blank")
			}
		},
		mounted(){
			this.getReviewList()
			// this.getOnlineReviewData()
		}

	}
</script>

<style lang="less" scoped>
	.left{float:left}
	.right{float:right}

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
		.reviewNum{
			font-size:13px;
			color: #9599A6;		
			height:18px;
			.doReview{
				color: #12B355;
				font-size:16px;
				padding:0 50px 0 5px;
			}
			.waitReview{				
				color: #3388FF;
				font-size:16px;
				padding:0 50px 0 5px;
			}
			.waitReReview{
				color: #FE5958;
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
		
		height:216px;
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
			width:390px;
			margin-left:-24px;
			height:1px;
			background:#EBEEF5;
		}
		.card-con{
			text-align:center;
			margin-top:20px;
			margin-bottom:25px;
			font-size:14px;
			color:#9599A6;
			.doReview{
				color: #12B355;
				font-size:24px;
				
			}
			.waitReview{				
				color: #3388FF;
				font-size:24px;

			}
			.waitReReview{
				color: #FE5958;
				font-size:24px;
			}
		}
		.footer{
			text-align:center;
			/deep/ .el-button{
				width:90px;
				font-size:14px;
				font-weight:600;
			}
		}

	}
</style>
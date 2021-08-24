<template>
	<div class="Detail-container">
		<el-container>
			<el-header class="header" style="height:52px;line-height:52px;">
				<p class="left">
					您正在查看 {{examName}}   {{courseName}} {{paperType}}卷
				</p>
				<p class="left" style="margin-left:25%">质检状态：<span style="font-size:16px;">{{qualityState}}</span> <span v-if="backReviewReason" class="backReviewReason" v-popover:popover> ? 
					<template>
						<el-popover  ref="popover" trigger="hover" placement="bottom">
				          <p>试卷条码:{{examBarcode}}</p>
				          <p>重评原因:<span style="color:#3388FF">{{ backReviewReason.split(';')[0] }}</span>	</p>
				         
				        </el-popover>
					</template>
					</span>
				</p>
				<p class="right studentInfo"  v-for="item in studentInfo">
					<span class="infoT">{{item.key}}: </span> <span class="infoC"> {{item.value}}</span>
				</p>
		    </el-header>
			<el-main>
				<div class="left paper" >
					<div v-for="(item,index) in studentAnswerPaperList"  >
						<img @load="loadImg(item.sequence)"  class="markImg" v-for="(e,i) in teacherMarkImgList[index]"  v-if="teacherMarkImgList[index].length>0" :src="e" :data-index="item.sequence" style="display:none">
						<img  @load="loadImg(item.sequence)" :src="item.address" class="paperImg" :class="{show:teacherMarkImgList[index].length>0}">
						<canvas
						v-if="teacherMarkImgList[index].length>0"
						 :id="item.sequence"
                        width="774"
                        ref="chalkboard"
                        class="chalkboard"
                        height="1540px"
						 :style="{backgroundImage : `url(${item.address})`}"></canvas>
					</div>
				</div>
				<div class="right scoreBox">
					<div>
						<div class="scoreInfo">
							<p style="font-size:15px;color:#363940;font-weight:500" class="left">总成绩</p>
							<p class="right"> <span class='score'> {{paperObjectiveScore+totalPaperSubjectiveScore}} </span> 分</p>
						</div>
						<div class="scoreInfo">
							<p style="font-size:15px;color:#626673;" class="left">客观题成绩</p>
							<p class="right"><span class="score">{{paperObjectiveScore}} </span> 分</p>
						</div>
						<div class="scoreInfo">
							<p style="font-size:15px;color:#626673;" class="left">主观题成绩</p>
							<p class="right"><span class="score">{{subjectiveScore}} </span> 分</p>
						</div>
					</div>
					<div >
						<el-table
							:data = "tabelData"
							style="width: 100%"
							highlight-current-row
							max-height="550"
							stripe
			 			>
			 			  	<el-table-column
							    prop="questionNum"
							    label="题号"
						    	align="center"
							>
						    </el-table-column>
						    <el-table-column
							    prop="questionScore"
							    label="分值"
						    	align="center"
							>
						    </el-table-column>
						    <el-table-column
							   	prop="score"
							    label="得分"							
								align="center"
							>
							</el-table-column>
						</el-table>
					</div>
				</div>
			</el-main>
		</el-container>
	</div>
</template>
<script>
	export default{
		name:"Detail",
		data(){
			return {
				examBarcode:this.$route.query.ExamBarCode,
				paperId:this.$route.query.PaperID,
				tabelData:[],
				qualityState:"",
				examName:"",
				courseName:"",
				paperType:this.$route.query.paperType,
				studentInfo:[],
				studentAnswerPaperList:[],
				totalPaperSubjectiveScore:0,
				paperObjectiveScore:0,
				teacherMarkImgList:[],
				listStudentSubjective:[],
				img:{},
				backReviewReason:"",
				subjectiveScore:0,
			}
		},
		methods:{
			getStudentPaperInfo(){
				let that = this;
				let data= {
					examBarcode:that.examBarcode,
					paperId:that.paperId
				}
				this.$api.reviewManage.getStudentPaperInfo(data).then(res => {
					console.log(res)
					let json = res.data
					that.qualityState = json.qualityState;
					that.examName = json.examInfo.examName;
					that.courseName = json.examInfo.courseName;
					that.studentInfo = json.studentInfo
					that.backReviewReason = json.backReviewReason
					// that.backReviewReason.backReviewReason = json.backReviewReason.split(',')[0]
					// that.backReviewReason.memo = json.backReviewReason.split(',')[1]
					
					that.paperObjectiveScore = json.paperObjectiveScore
					that.totalPaperSubjectiveScore = json.totalPaperSubjectiveScore
					that.subjectiveScore = json.subjectiveScore
					json.listStudentSubjective.forEach(item=>{
						let questionNum = ""
						if(item.structureId != null && item.structureId != undefined && item.structureId != ""){
							questionNum += item.structureId
						}
						if (item.questionId != null && item.questionId != undefined && item.questionId != "") {
	                        questionNum += "." + item.questionId
	                    }
	                    if (item.subQuestionId != null && item.subQuestionId != undefined && item.subQuestionId != "") {
	                        questionNum += "." + item.subQuestionId
	                    }
	                    if(item.studentScore==null){
	                    	item.studentScore=0;
	                    }
	                    this.stuSubjectiveScore += item.studentScore
						this.tabelData.push(
							{
								questionNum:questionNum,
								questionScore:item.score,
								score:item.studentScore,
								sequence:item.sequence
							},
						)
					})
					
					json.studentAnswerPaperList.forEach(item => {
			        	item.address = item.address.replace(/\\/g, '/')
			        })
					that.studentAnswerPaperList = json.studentAnswerPaperList
					
			      	json.teacherMarkImgList.forEach(item => {
			      		if(item.length>0){
			      			item.forEach(e => {
			      				e = e.replace(/\\/g, '/')
			      			})
			      		}
			          
			        })
			       that.teacherMarkImgList = json.teacherMarkImgList
				})
			},
			loadImg(index){
				let img = document.getElementsByClassName("markImg");
				this.img[index] = [];
				img.forEach(item => {
					if(item.dataset.index == index){
						document.getElementById(index).getContext("2d").drawImage(item, 0, 0);
					}
					
					
				})	
			},
			
		},
		mounted(){
			this.getStudentPaperInfo()
		}
	}
</script>
<style lang="less" scoped>
	.left{float:left;}
	.right{float:right;}
	.el-container{height:100%}
	.Detail-container{
		height:100%;
		background:#EDEFF2;
		.el-button{
			min-width:0px!important;
			padding:0 !important;
		}	
	}
	.header{
		width:100%;
		background:#363940;
		color:#C2C4CC;
		font-size:13px;
		
	}
	.el-main {
		background:#EDEFF2

	}
	.paper{
		text-align:center;
		height:100%;
		overflow-y:auto

	}
	
	@media screen and (max-width:1366px) {
	  .paper{width:75%}
	}
	@media screen and (min-width:1366px) {
	  .paper{width:80%}
	}
	.scoreInfo{
		height:40px;
		padding:0 16px;
		line-height:40px;
		.score{color:#3388FF;}
	}
	.scoreBox{background:#fff}
	.studentInfo{
		font-size:13px;
		margin-right:33px;
		.infoT{color:#9599A6}
		.infoC{color:#C2C4CC}
	}
	.show{display:none;}
	.el-table__row{
		height:44px;
		td{
			border:0;
			padding:0;
		}
	}
	.backReviewReason{
		display: inline-block;
	    width: 14px;
	    height: 14px;
	    border: 1px solid #fff;
	    line-height: 14px;
	    text-align: center;
	    border-radius: 50%;
	}
	.el-popover{
		background:#fff;
		margin-top:12px;
	}
</style>
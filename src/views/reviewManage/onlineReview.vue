<template>
	<div class="onlineReview-container" @mouseup="mouseUp($event)">
		<el-container>
		  <el-header class="header" style="height:52px;">

			<p class="left" v-if="isBackReview">此试卷为重评试卷，原因：{{backReviewReason}} <span class=""></span></p>
			<p class="left" v-else>
				您正在评阅{{courseName}} {{paperType}}卷 第<span class="paperNum"> {{doReview}} </span>份,剩余<span class="surplusNum"> {{waitReview}} </span>份
			</p>
			<p class="right studentInfo" v-if="viewStudentInfo==1" v-for="item in studentInfo">
					<span class="infoT">{{item.key}}: </span> <span class="infoC"> {{item.value}}</span>
			</p>
		  </el-header>
		  <el-main style="height:100%" > 
		 	<el-button   style="color:#fff;" type="" class="sugCon" @click="showSign"><i class="sign"></i>标记</el-button>
			<div class="left toolbar">
				<el-button  @click="traggleFuc('pencil')" :class="{active:pencil}" type="text"><i class="pencil" :class="{active:pencil}"></i>画笔</el-button>
				<el-button @click="traggleFuc('drawTxt')" :class="{active:drawTxt}" type="text"><i class="addTxt" :class="{active:drawTxt}"></i>文字
					<div style="display:none;position:absolute;" class="txtBox">
						<textarea v-model="textSign" autofocus="autofocus" type="text" style="text-align:left" class="txt"></textarea><br>
						<el-button type="primary" @click="addText($event)" size="mini" class="addText right" >确定</el-button >
						<el-button size="mini" @click="closeText" class="closeText right">取消</el-button >

					</div>
				</el-button>

				<el-button @click="traggleFuc('eraser')"  :class="{active:eraser}" type="text"><i class="eraser" :class="{active:eraser}"></i>擦除</el-button>
				<el-button @click="redraw" type="text"><i class="redraw"></i>撤销</el-button>
				<el-button @click="clear" type="text"><i class="clear"></i>清除</el-button>
				<el-button @click="full" type="text"><i class="full"></i>全屏</el-button>
				<!-- <el-button type="text">设置</el-button> -->
				<div class="paperBtn">
					<el-button v-if="otsPaperId || localAddress" type="text" @click='openOriginal'><i class="original"></i>原卷</el-button>
					</el-button>
					<el-button v-if="localAnswerAddress" type="text" @click="showAnswer"><i class="answer"></i>答案</el-button>
				</div>

			</div>
			<div class="left paper">
				<div v-for="(item,index) in StudentAnswerPaperList"  >

						<img v-if="markImgList[index]" @load="loadImg(item.sequence)"  class="markImg" :data-index="item.sequence" :src="markImgList[index]" width='774px' style="display:none">
						<img  @load="loadImg(item.sequence)" :src="item.address" class="paperImg" style="display:none">
						<canvas
						 :id="item.sequence"
                        :width="w"
                        ref="chalkboard"
                        class="chalkboard"
                        :height="h"

						 :style="{backgroundImage : `url(${item.address})`,height:H + 'px',width:W + 'px'}" @mouseenter='mouseENTER($event)' @mouseleave='mouseLEAVE($event)'   ></canvas>


				</div>

			</div>
			<div class="right scoreBox">
				<div class="objectiveBox"  v-if="isDisplayObjectiveScore==1">
				<!-- 	客观题 <span class="right" style="font-size:18px;color:#9599A6"><span style="color:#3891FF">{{stuObjectiveScore}}</span> / <span style="color:#363940">{{objectiveScore}}</span>分</span> -->
					<span class="left">总成绩：<span style="color:#363940;font-size:18px">{{stuObjectiveScore+stuSubjectiveScore}} </span> 分</span>
					<span class="right">客观题：<span style="color:#363940;font-size:18px">{{stuObjectiveScore}} </span> 分</span>
				</div>
				<div class="subjectiveBox">
				 	<div style="font-weight:500">主观题</div>
				 	<div style="margin-top:13px;">
				 		<div class="left">
				 			<el-button round type="danger" @click="allZero" size="mini">全零</el-button>
							<el-button round type="success" @click="allFull" size="mini">全满</el-button>
				 		</div>
				 		<span class="right" style="font-size:18px;color:#9599A6;"><span style="color:#3891FF">{{stuSubjectiveScore}}</span> / <span style="color:#363940">{{score-objectiveScore}}</span>分</span>
				 	</div>

				</div>
				<div class="subjectiveScore" >
			 		<el-table
						:data = "tabelData"
						style="width: 100%"
						highlight-current-row
						max-height="550"
						@cell-mouse-leave="leaveCell"
						@cell-mouse-enter="enterCell"
						stripe
			 		>
		 			  	<el-table-column
						    prop="questionNum"
						    label="题号"
					    	align="center"
						    width="60">
					    </el-table-column>
					    <el-table-column
						    prop="questionScore"
						    label="分值"
					    	align="center"
						    width="50">
					    </el-table-column>
					    <el-table-column
						   	prop="score"
						    label="得分"
							width="160"
							align="center"

						    >
						    <template  slot-scope="scope" >

						    	<el-button @click="zeroScore(scope.row)"  v-show="scope.row.isActive" type="danger">零</el-button>
						    	<el-button @click="reduce(scope.row)" v-show="scope.row.isActive"  type="primary">－</el-button>
						    	<el-input v-model="scope.row.score" :class="{active: scope.row.isActive,'current-row':scope.row.isActive}"  prop="score" @focus="scope.row.isActive=true" @change="changeScore" :max="scope.row.questionScore" min="0"></el-input>
						    	<el-button @click="plus(scope.row)" v-show="scope.row.isActive" type="primary">+</el-button>
						    	<el-button @click="fullScore(scope.row)" v-show="scope.row.isActive" type="success">满</el-button>

						    </template>
					    </el-table-column>
			 		</el-table>
			 		<div class="footerBtn">

			 			<el-button  round style="color:#363940;margin-right:20px;" @click="close">关闭</el-button>
			 			<el-button type="primary" round @click="save">提交</el-button>
			 		</div>
			 	</div>
			</div>
		  </el-main>
		  <el-footer style="height:40px;">
  			<el-button type="text" v-if="key != 0 && beforeCode != 0 && isRejudge != 0 && !isBackReview"  @click="openLastOne" class=""><i class="lastone"></i>上一份</el-button>

			<el-button type="text" @click="big" class=""><i  class="big"></i></el-button>
			<el-button type="text" @click="samll" class=""><i  class="small"></i></el-button>
			<el-button type="text" @click="reduction" class=""><i  class="reduction"></i></el-button>
			<el-button v-if="checkoutCode" type="text" @click="toRealPaper" class="realPaper left"><i class="realPaper"></i>答卷</el-button>

		  </el-footer>
		</el-container>

		<oms-custom-page
    	:dialog.sync="isshowSign"
        title="标记试卷">
	        <template v-slot:content>
	        	<el-radio-group v-model="feedBack">
				    <el-radio-button label="1" >答案雷同</el-radio-button>
				    <el-radio-button label="2" >笔迹雷同</el-radio-button>
				    <el-radio-button label="3" >多种笔迹</el-radio-button>
				    <el-radio-button label="4" >作答与考题不符</el-radio-button>
				    <el-radio-button label="5" >其它</el-radio-button>
			    </el-radio-group>
			    <el-input v-model="feedBackMemo" type="textarea" :rows="2" resize="none" v-if="feedBack"></el-input>
	        </template>
	    	<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button v-if="feedBack==0" @click="isshowSign = false" round>取 消</el-button>
		            <el-button v-else  @click="delFeedBack" round>删除</el-button>
		            <el-button type="primary" @click="saveFeedback" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>

	    <oms-custom-page :dialog.sync="isshowOffice" title="查看原卷">
	    	 <template v-slot:content>
	    	 	<iframe :src="localAddress" frameborder="0"></iframe>
	    	 </template>
    		<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button  @click="isshowOffice = false">关闭</el-button>

		          </div>
		        </div>
		    </template>
	    </oms-custom-page>

	    <oms-custom-page :dialog.sync="ishowSave" title="提示"  width="30%">
	    	 <template v-slot:content>
	    	 	您尚未完成本卷的评阅，是否暂存评阅结果?
	    	 </template>
    		<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button round @click="closeSave">直接关闭</el-button>
		            <el-button type="primary" round  @click="tempSave">保存并关闭</el-button>
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>
	</div>


</template>

<script>
	import  * as echarts from 'jquery';
	export default{
		name:"onlineReview",
		data(){
			return {
				value:0,
				key:this.$route.query.key,
				isshowSign:false,
				isshowOffice:false,
				ishowSave:false,
				officeTitle:"",
				feedBack:0,
				objectiveScore:0, //客观题总分
				stuObjectiveScore:0, //客观题得分
				// subjectiveScore:0,
				stuSubjectiveScore:0,
				viewStudentInfo:0,
				studentInfo:[],
				isDisplayObjectiveScore:0,
				isBackReview:0,
				isRejudge:0,
				courseName:"",
				paperType:"",
				backReviewReason:"",
				score:0,//试卷总分
				examBarCode:"",
				feedBackMemo:"",
				checkoutCode:"",
				otsPaperId:"",
				localAddress:"",
				paperInfo:{},
				tabelData:[

				],
				answerImgList:[],
				StudentAnswerPaperList:[],
				markImgList:[],
				canvas:"",
				ctx:"",
				w : 774,
			    h : 1540,
			    H : 1540,
			    W : 774,
			    mouseD:false,
				eraser:false,
				pencil:true,
				drawTxt:false,
				img:{},
				index:0,
				xLast:0,
			    yLast:0,
			    sX : 0,
			    sY : 0,
			    eX : 0,
			    eY : 0,
			    brushDiameter : 3,
			    eraserWidth : 30,
			    eraserHeight : 40,
			    height:0,
			    width:0,
			    hasmove : false,
			    currentX:0,
    			currentY:0,
    			localAnswerAddress:"",
    			textSign:"",
    			beforeCode:"",
    			doReview:0,
    			waitReview:0,
    			optLog:[],
    			markStartTime:this.$tools.format(),
    			record:{ eraser: 0, redraw: 0, clear: 0, full: 0, close: 0, submit: 0,   slide: 0, prev: 0, next: 0, maxscore: 0, minscore: 0, addscore: 0, subscore: 0 },
    			isFullScore:0,
			}
		},
		methods:{
			getPaper(){
				let that = this
				console.log(this.$route.query)

				this.paperInfo = this.$route.query
				let data = {
					examId:this.paperInfo.examId,
					courseCode:this.paperInfo.courseCode,
					paperId:this.paperInfo.paperID,
					paperType:this.paperInfo.paperType,
					examBarCode:this.paperInfo.examBarCode,
					isRejudge:""
				}
				this.$api.reviewManage.getStudentPaper(data).then(res => {
					if(res.status==1){
						let json = res.data
						this.isFullScore = json.paperInfo.initScore
						this.beforeCode =json.teacherReviewInfo.beforeCode
						let maxNumber = json.teacherReviewInfo.judgeStatInfo.maxNumber
						let waitReview = json.teacherReviewInfo.judgeStatInfo.waitReview
						this.doReview = waitReview!= 0 &&this.paperInfo.examBarCode == "-1" ?  json.teacherReviewInfo.judgeStatInfo.doReview + 1 :  json.teacherReviewInfo.judgeStatInfo.doReview;
						waitReview =  (maxNumber != -1 && maxNumber <waitReview) ? maxNumber - json.teacherReviewInfo.judgeStatInfo.doReview : waitReview;
						
						this.waitReview =waitReview != 0 && this.paperInfo.examBarCode == "-1" ? waitReview - 1 : waitReview;
						this.courseName =json.paperInfo.courseName
						this.paperType =json.paperInfo.paperType
						this.isRejudge = json.paperInfo.isRejudge
						this.isBackReview = json.studentPaperInfo.isBackReview
						this.backReviewReason = json.studentPaperInfo.backReviewReason
						this.checkoutCode = json.paperInfo.checkoutCode
						this.otsPaperId = json.paperInfo.otsPaperId
						this.localAddress = json.paperInfo.localAddress
						this.localAnswerAddress = json.paperInfo.localAnswerAddress
						this.isDisplayObjectiveScore = json.paperInfo.isDisplayObjectiveScore
						this.score = json.paperInfo.score
						this.viewStudentInfo = json.paperInfo.viewStudentInfo
						this.studentInfo = json.studentPaperInfo.studentInfo
						this.objectiveScore = json.paperInfo.objectiveScore
						this.stuObjectiveScore = json.studentPaperInfo.objectiveScore
						this.examBarCode = json.studentPaperInfo.examBarCode
						json.studentPaperInfo.studentAnswer.forEach(item=>{
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
		                    	if(this.isFullScore==1){
		                    		item.studentScore = item.score
		                    	}
		                    }
		                    this.stuSubjectiveScore += item.studentScore
							this.tabelData.push(
								{
									isActive:false,
									questionNum:questionNum,
									questionScore:item.score,
									score:item.studentScore==0 ? "" : item.studentScore,
									sequence:item.sequence
								},
							)
						})

						json.studentPaperInfo.answerImgList.forEach(item => {
				        	item.address = item.address.replace(/\\/g, '/')
				        })
						this.StudentAnswerPaperList = json.studentPaperInfo.answerImgList
				        json.teacherReviewInfo.markImgList.forEach(item => {

				           item = item.replace(/\\/g, '/')
				        })
				        this.markImgList = json.teacherReviewInfo.markImgList
						
					}else{						
						// this.$alert(res.message, "", {
				  //         confirmButtonText: '确定',
				  //         callback: action => {
				  //         	window.close();
				  //         }
						// })	
					}				
				})

			},
			showSign(){
				this.isshowSign = true;
				let data = {
					examBarCode: this.examBarCode
				}
				this.$api.reviewManage.getFeedBack(data).then(res => {
					if(res.status==1){
						if(res.data){
							this.feedBack = res.data.setType
							this.feedBackMemo = res.data.memo
						}
					}
				})
			},
			big(){
				this.W += this.w/100 * 4
				this.H += this.h/100 * 4
				if(this.ctx){

					// this.ctx.scale(this.W/774,this.H/1540)
				}
				this.optLog.push("next," + this.$tools.format());
				// this.changeCanvasSize()
			},
			samll(){
				this.W -= this.w/100 * 4
				this.H -= this.h/100 * 4
				if(this.ctx){
					// this.ctx.scale(this.W/774,this.H/1540)
				}
				this.optLog.push("prev," + this.$tools.format());
              	// this.changeCanvasSize()
			},
			reduction(){
				this.W = 774
				this.H = 1540
              	// this.changeCanvasSize()
			},
			allFull(){
				console.log("全满")
				this.tabelData.forEach(item=>{
					item.score=item.questionScore
				})
				this.changeScore()
			},
			allZero(){
				this.tabelData.forEach(item=>{
					item.score=0;
				})
				this.changeScore()
			},
			reduce(row){
				console.log(row)
				if (row.score == "") {
		            row.score = 0;
		        } else {
		            row.score--;
		        }
				if(row.score < 0){
					return false
				}
				this.changeScore(row.score)
			    this.optLog.push("subscore," + this.$tools.format()); 
			},
			plus(row){
				console.log(row)
				if (row.score == "") {
		            row.score = 0;
		            row.score++
		        } else {
		            row.score++;
		        }
				if(row.score > row.questionScore){
					row.score = row.questionScore
					return false
				}
				this.changeScore(row.score)
				this.optLog.push("addscore," + this.$tools.format());

			},
			zeroScore(row){
				row.score = 0;
				this.changeScore(row.score)
				this.optLog.push("minscore," + this.$tools.format());

			},
			fullScore(row){
				row.score = row.questionScore
				this.changeScore(row.score);
				this.optLog.push("maxscore," + this.$tools.format());

			},
			leaveCell(row){
				row.isActive = false
				this.changeScore(row.score);
			},
			enterCell(row){
				row.isActive = true
				// this.changeScore(row.score);
			},
			delFeedBack(){
				this.$api.reviewManage.delFeedBack(
					{examBarCode:this,examBarCode}
				).then(res=>{
					if(res.status==1){
						this.$message({
				            type: 'success',
				            message: '操作成功!'
			          	});
			          	this.isshowSign = false
					}
				})
			},
			saveFeedback(){
				let data = {
					examBarCode: this.examBarCode,
					setType: this.feedBack,
					memo:this.feedBackMemo
				}
				this.$api.reviewManage.saveFeedBack(data).then(res => {
					if(res.status==1){
						this.$message({
				            type: 'success',
				            message: '操作成功!'
			          	});
		  	          	this.isshowSign = false
					}
				})

			},
			openOriginal(){
				if(this.otsPaperId!=""){
					let href= "/Paper/PreviewOTSPaper?paperid=" +this.otsPaperId + "&examId=" + this.paperInfo.examId + ""
					window.open(href,"_blank")
				}else{
					if(this.localAddress!=""){
						this.isshowOffice = true
						this.officeTitle = "查看原卷"
					}
				}
			},
			showAnswer(){
				// $("#answer").find("iframe").attr("src", "http://oweb.chinaedu.net/?furl=" + data.data.localAnswerAddress)
				this.isshowOffice = true
				this.officeTitle = "查看答案"
			},
			toRealPaper(){
				 let href = "/OnlineReview/ShowRealPaper?ExamBarCode=" +this.examBarCode+ "&CheckoutCode=" + this.checkoutCode
				 window.open(href,"_blank")
			},
			changeScore(val){
				let that = this;
				console.log(val)
				this.stuSubjectiveScore=0;
				if(val && isNaN(Number(val))){
					// that.stuSubjectiveScore+=0;
		                // item.score=0;
		              	that.$message({
				          message: '请输入正确数字',
				          type: 'warning'
				        });
				}
				this.tabelData.forEach(item=>{
					if(Number(item.score)>Number(item.questionScore)){		            
		            	item.score=item.questionScore;
		              	that.$message({
				          message: '评分超过最大分值',
				          type: 'warning'
				        });
		            }else if(isNaN(Number(item.score)) || item.score==""){
		            	that.stuSubjectiveScore += 0
		            }else{
		            	that.stuSubjectiveScore += parseFloat(item.score)
		            }
					
				})

				// this.subjectiveScore =
			},
			loadImg(index){
				let img = document.getElementsByClassName("markImg");
				this.img[index] = [];
				img.forEach(item => {
					// item.onload = ()=>{

					// }
					if(item.dataset.index == index){
							document.getElementById(index).getContext("2d").drawImage(item, 0, 0);
						}
				})
			},
			traggleFuc(txt){
				if(txt=="pencil"){
					this.pencil = true
					this.drawTxt = false
					this.eraser = false
				}else if (txt=="drawTxt") {
					this.pencil = false
					this.drawTxt = true
					this.eraser = false
					txt = "txt"

				}else if(txt == "eraser"){
					this.pencil = false
					this.drawTxt = false
					this.eraser = true

				}
				if(txt!="pencil"){
					this.optLog.push(txt +","+ this.$tools.format());

				}

			},
			redraw(){
				let that = this
				console.log(this.img)
	           if (that.img[that.index].length > 0) {
                	that.ctx.putImageData(that.img[that.index].pop(), 0, 0);
	            }
	            else {
	                this.$message({
				        message: '不能在撤销了',
				        type: 'warning'
			        });
	            }
        		this.optLog.push("redraw," + this.$tools.format());

			},
			clear(){
			   	this.eraser = false;
	            this.pencil = true;
	            this.drawTxt = false
	            this.ctx.clearRect(0, 0, this.W, this.H)
	            this.optLog.push("clear," + this.$tools.format());

			},
			full(){
				console.log(1)
				this.optLog.push("full," + this.$tools.format());

			},
			openLastOne(){
				console.log()
				let ExamID =this.paperInfo.examId;
	            let CourseCode = this.paperInfo.courseCode;
	            let PaperID = this.paperInfo.paperId
	            let PaperType = this.paperInfo.paperType
	            let beforeCode = this.beforeCode
	            if(this.$route.query.key == 0 || befreCode == 0 || this.isRejudge == 0 || this.isBackReview){

	            }else{
	            	 let href = "/OnlineReview/NewDetails?ExamBarCode=" + beforeCode + "&ExamID=" + ExamID + "&CourseCode=" + CourseCode + "&PaperID=" + PaperID + "&PaperType=" + PaperType + "&key=0"
	            	window.open(href, "_blank");
	            }

			},
			addText(event){
				console.log(event)
				let conTxt = this.textSign;
	            this.ctx.font = "24px Georgia";
	            this.ctx.fillStyle = "red";
	            if (conTxt) {
	                let Y = event.pageY - this.canvas.offsetTop + document.querySelector('.paper').scrollTop-95
	                let imgData = this.ctx.getImageData(0, 0, this.W, this.H);
	                this.img[this.index].push(imgData)
	                let rw =document.getElementsByClassName("txt")[0].style.width
		        // document.getElementsByClassName("txt")[0].style.height="50px"
	                let conTxtWidth = 0;
	                let lastSubStrIndex = 0
	                for (var i = 0; i < conTxt.length; i++) {
	                    conTxtWidth += this.ctx.measureText(conTxt[i]).width;
	                    if (conTxtWidth > parseFloat(rw)) {
	                        this.ctx.fillText(conTxt.substring(lastSubStrIndex, i), this.xLast - 5, Y);//绘制截取部分
	                        conTxtWidth = 0;
	                        Y += 25;
	                        lastSubStrIndex = i;
	                    }
	                    if (i == conTxt.length - 1) {
	                        this.ctx.fillText(conTxt.substring(lastSubStrIndex, i + 1), this.xLast - 5, Y); //绘制剩余部分
	                    }
                	}
	                //ctx.fillText(conTxt, xLast-5, yLast+10,maxW);
	               	document.getElementsByClassName("txtBox")[0].style.display ="none"
					this.textSign = ""
					document.getElementsByClassName("txt")[0].style.width=0
			        document.getElementsByClassName("txt")[0].style.height=0
			        document.getElementsByClassName("txtBox")[0].style.left=0
			        document.getElementsByClassName("txtBox")[0].style.top=0
	                this.eX = this.eY = this.sX = this.sY = 0;

	            } else {
	                document.getElementsByClassName("txtBox")[0].style.display ="none"
					this.textSign = ""
	                this.eX = this.eY = this.sX = this.sY = 0;
	            }

	            document.removeEventListener('mousewheel',function(){});
			},
			closeText(){
				document.getElementsByClassName("txtBox")[0].style.display ="none"
				this.textSign = ""
			},
          changeCanvasSize () {
            let cans = document.getElementsByClassName("chalkboard")
            cans.forEach(item => {
              let ctx = item.getContext("2d");
              let imageData = ctx.getImageData(0,0,this.W,this.H);
              item.setAttribute("width",this.W)
              item.setAttribute("height",this.H)
              ctx.putImageData(imageData,0,0);
            })
          },
			mouseENTER(e){
				e.stopPropagation()

	            let mouseX = e.pageX;
		        let mouseY = e.pageY;
		        let _mouseX;
		        let _mouseY;
		        this.canvas = e.target;
		        this.ctx = this.canvas.getContext("2d");
		        this.index = this.canvas.id
		      	let cans = document.getElementsByClassName("chalkboard")

		      	let that = this;

		        cans.forEach(function (item) {
		        	let currentCtx = item.getContext("2d")
                  	let currentImgData = currentCtx.getImageData(0, 0,  that.W, that.H)
				    item.width = that.w;
				    item.height = that.h;
				  	currentCtx.scale(that.w / that.W, that.h / that.H)
		            currentCtx.putImageData(currentImgData, 0, 0,)

		        });

		        // height = canvas.height;
		        // width = canvas.width;
		        this.ctx.fillstyle = 'rgba(255,0,0,0.5)';
		        this.ctx.strokestyle = 'rgba(255,0,0,0.5)';
		        this.ctx.lineWidth = this.brushDiameter;
		        this.ctx.lineCap = 'round';
		        this.index = e.target.id
		        this.canvas.removeEventListener("mousemove",function(e){})
		      	that.canvas.addEventListener("mousemove",function(e){
		        	e.stopPropagation()
	        	    _mouseX = e.pageX - e.target.offsetLeft + 8;
        			_mouseY = e.pageY - e.target.offsetTop  + document.querySelector('.paper').scrollTop
              console.log(_mouseX ,_mouseY )
		            if (that.mouseD) {
		                if (that.eraser) {
		                    that.erase(_mouseX, _mouseY);
		                } else if(that.pencil){
		                    that.draw(_mouseX, _mouseY);
		                } else {}
           			}
   					that.canvas.addEventListener("mouseleave",function (e) {
		           		e.stopPropagation()
		                that.mouseD = false;
		            })

		        })

		        $(this.canvas).unbind().bind("mousedown",function(e){
		        	e.stopPropagation();

		            if (that.drawTxt==false) {
		                let imgData = that.ctx.getImageData(0, 0, that.W, that.H);
		                // that.img[that.index].push(imgData)
		            }
		            let imgData = that.ctx.getImageData(0, 0, that.W,that.H);
		            that.img[that.index].push(imgData)
		            // $("#imgMark" + index).attr("data", 0);
		            that.mouseD = true;
		            that.xLast = _mouseX;
		            that.yLast = _mouseY;
		            that.sX = e.clientX;
		            that.sY = e.clientY;
		            if (e.which == 3) {
		            	this.mouseD = false
			           	e.target.addEventListener("contextmenu",function(){

			           		return false
			           	})
		            }
		            if (that.eraser) {
		                that.erase(_mouseX, _mouseY);
		            } else if(that.pencil){
						        that.mouseD = true;
		                that.draw(_mouseX, _mouseY);
		            } else if (that.drawTxt) {

		                that.Txt(_mouseX, _mouseY)
		                that.mouseD = false;
		            }

			      	that.canvas.addEventListener("mouseup",function (e) {
			        	e.stopPropagation()
		                that.mouseD = false;
		            })

		        });
			},
			mouseLEAVE(e){
				this.mouseD = false;
			},
			mouseUp(e){
			  	let firstX =this.currentX;
	            let currentW = $(".txt").width()

	            if ((firstX + currentW) > this.W) {
	                let maxW = this.W - firstX
	                $(".txt").width(maxW)
	            }           
	            var screenY = $(window).height() - (this.currentY+100-$(".box").scrollTop());
	            var currentH = $(".txt").height();
	            if ((currentH + 30) > screenY) {
	                var maxH = screenY - 30;
	                $(".txt").height(maxH)
	            }
			},
			draw(x, y) {
		        this.ctx.lineWidth = this.brushDiameter;
		        this.ctx.strokeStyle = 'rgba(255,0,0,1)';
		        this.ctx.beginPath();
		        this.ctx.moveTo(this.xLast, this.yLast);
		        this.ctx.lineTo(x, y);
            	console.log(this.xLast,this.yLast,x, y)
		        this.ctx.stroke();
		        //Chalk Effect
		        let length = Math.round(Math.sqrt(Math.pow(x - this.xLast, 2) + Math.pow(y - this.yLast, 2)) / (5 / this.brushDiameter));
		        let xUnit = (x - this.xLast) / length;
		        let yUnit = (y - this.yLast) / length;
		        for (var i = 0; i < length; i++) {
		            let xCurrent = this.xLast + (i * xUnit);
		            let yCurrent = this.yLast + (i * yUnit);
		            let xRandom = xCurrent + (Math.random() - 0.5) * this.brushDiameter;
		            let yRandom = yCurrent + (Math.random() - 0.5) * this.brushDiameter;
		            this.ctx.clearRect(xRandom, yRandom, Math.random() * 2 + 2, Math.random() + 1);
		        }

		        this.xLast = x;
		        this.yLast = y;
		    },
    		//橡皮
		    erase(x, y) {
		    	let that = this
		        //ctx.clearRect(x - 0.5 * eraserWidth, y - 0.5 * eraserHeight, eraserWidth, eraserHeight);
		        this.ctx.clearRect(x, y - 10, that.eraserWidth, that.eraserHeight);
		    },
   			 //文字
    		Txt(x, y) {
    			let that = this
		        document.addEventListener('mousewheel', function (event, delta) { return false; });
		        that.currentX = x;
		        that.currentY = y
		        document.getElementsByClassName("txtBox")[0].style.display ="block"
		        // setTimeout(function () { $(".txt").focus(); }, 500);
		        document.getElementsByClassName("txt")[0].style.width="150px"
		        document.getElementsByClassName("txt")[0].style.height="50px"
		        document.getElementsByClassName("txtBox")[0].style.left=that.sX+"px"
		        document.getElementsByClassName("txtBox")[0].style.top=that.sY-30+"px"
		        if ((x + 150) > this.W) {
		            var mixW = this.W - x;
	              	document.getElementsByClassName("txt")[0].style.width=mixW+"px"
	              	document.getElementsByClassName("txt")[0].style.resize="none"
		             // document.getElementsByClassName("txt")[0].css({ "width": "" + mixW + "px", "resize": "none" })

		        } else {
		        	document.getElementsByClassName("txt")[0].style.resize="auto"
		             // document.getElementsByClassName("txt")[0].css({ "resize": "auto" })
		        }


		    },
			close(){
				this.optLog.push("close," + this.$tools.format());

				if (this.paperInfo.examBarCode != "-1") { //重复评阅，关闭暂存
		            window.close();
		            return false
		        }
				if(this.isBackReview==1){
					 window.close();
           			 return false
				}
				let that = this
				let flag = false;
				let data = []
				let reData = {
					examBarCode:this.examBarCode,
					totalScore:this.stuSubjectiveScore ,
					questionSocreEntity:[]
				}
				let scoreData = []
				let backImg = document.getElementsByClassName("chalkboard")

				backImg.forEach((item,i)=>{

					let index = item.id
					
					if(that.img[index]&&that.img[index].length>0){
						flag=true

					}
				})
				for(var i=0;i<that.tabelData.length;i++){
					if(that.tabelData[i].score===""){			
					}else{
						let sequence = that.tabelData[i].sequence
						// scoreData.push({'sequence':item.sequence ,'score': item.score})
						reData.questionSocreEntity.push({'sequence':that.tabelData[i].sequence ,'score': that.tabelData[i].score }) ,
						 flag = true
					}
				}
				
				if(flag){
					
					that.ishowSave = true;

				}else{
					this.$confirm('您尚未完成本卷评阅，确定要退出么？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						that.$api.reviewManage.releaseJudgeState(reData).then(res=>{
						if(res.status==1){
							window.close()
						}
					})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});          
					});
					// window.close();
					
				}
			},
			tempSave(){
				let that = this
				let reData = {
					examBarCode:this.examBarCode,
					totalScore:this.stuSubjectiveScore ,
					questionSocreEntity:[]
				}
				for(var i=0;i<that.tabelData.length;i++){
					if(that.tabelData[i].score===""){			
					}else{
						let sequence = that.tabelData[i].sequence
						// scoreData.push({'sequence':item.sequence ,'score': item.score})
						reData.questionSocreEntity.push({'sequence':that.tabelData[i].sequence ,'score': that.tabelData[i].score }) 						
					}
				}
				this.saveCanvas();
	          	this.saveOperateLog();
	          	this.$api.reviewManage.tempSaveScore(reData).then(res=>{
	          		if(res.status==1){
	          			this.$message({
				            type: 'success',
				            message: '保存成功!',
				            onClose:function(){
				            	window.close();
				            }
			          	});
	          		}

	          	})
				
			},
			closeSave(){
				window.close()
			},
			saveCanvas(){
				let compimage = "0"
				let that = this;
				let backImg = document.getElementsByClassName("chalkboard")
				backImg.forEach((item,i)=>{
					let index = item.id
					let imgAddress = that.StudentAnswerPaperList[i].address
					if(that.img[index]&&that.img[index].length>0){
						let imgCanvas = document.createElement('canvas');
		                let imgCtx = imgCanvas.getContext("2d");

		                imgCanvas.width = this.W;
		                imgCanvas.height = this.H;
		                imgCtx.drawImage(item, 0, 0);//绘入评阅图片
		                compimage = imgCanvas.toDataURL("image/png");
		                compimage = encodeURIComponent(compimage);

					}else{
						compimage = 0
					}
					that.$api.reviewManage.saveReviewMark(
						{examBarCode: that.examBarCode, picPath: imgAddress, markbase64: compimage}
					).then(res=>{
						if(res.status!=1){
							this.$message({
					            type: 'error',
					            message: '保存失败!',

				          	});
						}
					})
				})

			},
			saveOperateLog(){
        		let data = {
        			examBarCode:this.examBarCode,
        			markStartTime:this.markStartTime,
        			markEndTime:this.$tools.format() ,
	                opt: JSON.stringify(this.record),
	                optLog: JSON.stringify(this.optLog)
        		}
        		this.$api.reviewManage.saveOperateLog(data).then(res => {
        			console.log(res)
        		})
			},
			save(){
				let that = this
				let flag = true;
				// let data = ""
				  this.optLog.push("submit," + this.$tools.format());

				let reData = {
					examBarCode:this.examBarCode,
					totalScore:this.stuSubjectiveScore ,
					questionSocreEntity:[]
				}
				let scoreData = []
				for(var i=0;i<that.tabelData.length;i++){
					if(that.tabelData[i].score!==0 && that.tabelData[i].score===""){						
						this.$message({
				          message: '存在未评分的试题',
				          type: 'warning'
				        });
				        flag = false
				       break
					}else{
						let sequence = that.tabelData[i].sequence
						// scoreData.push({'sequence':item.sequence ,'score': item.score})
						reData.questionSocreEntity.push({'sequence':that.tabelData[i].sequence ,'score': that.tabelData[i].score }) ,
						 flag = true
					}
				}
				// that.tabelData.forEach(item => {
				// 	if(item.score!==0 && item.score===""){
				// 		this.$message({
				//           message: '存在未评分的试题',
				//           type: 'warning'
				//         });
				// 		flag = false
				// 	}else{
				// 		let sequence = item.sequence
				// 		// scoreData.push({'sequence':item.sequence ,'score': item.score})
				// 		 // data += {'sequence':item.sequence ,'score': item.score}
				// 		 reData.questionSocreEntity.push({'sequence':item.sequence ,'score': item.score})

				// 	}

				// })

				if(flag){
					this.saveOperateLog();
					this.saveCanvas();
					this.$api.reviewManage.saveScore(reData).then(res=>{
						if(res.status==1){
							if(this.$route.query.examBarCode==-1){
								this.$message({
						            type: 'success',
						            message: '保存成功，打开下一份!',
						            onClose:function(){
					            	  	let href = location.href
	                                    if (that.$route.query.key == 0) {
	                                        href = location.href.replace(/key=0/, "key=1")
	                                    }
	                                    location.href =href;
						            }
					          	});
							}else{
								this.$message({
						            type: 'success',
						            message: '保存成功!',
						            onClose:function(){
						            	window.close();
						            }
					          	});
							}

						}
					})
				}

			}

		},
		mounted(){
			this.getPaper()
			document.addEventListener("selectstart",function(){
				return false
			})
			document.addEventListener("contextmenu",function(){
				return false
			})

		}
	}
</script>
<style lang="less" scoped>
	.left{float:left}
	.right{float:right}
	.onlineReview-container{
		height:100%;
		background:#EDEFF2;
		.el-button{
			min-width:0px!important;
			padding:0 !important;
		}
	}

	.el-container{height:100%}
	.el-main{
		.sugCon{
			position: fixed;
			bottom:57px;
			right:310px;
			width:48px;
			height:48px;
			background:#3891FF;
			border-radius:50%;
			padding:0 !important;
			text-align:center;

		}
		background: #EDEFF2;
		padding:10px;
		margin-bottom:40px;
		.toolbar{
			padding-top:20px;
			width:64px;
			text-align:center;
			position:fixed;
			height:680px;
			background:#fff;
			.el-button+.el-button{
				margin:0;
				margin-bottom:30px;
			}
			.el-button{
				width:100%;
				margin-bottom:30px;
			}
			.el-button--text{color:#9599A6}
			.el-button--text.active{color:#3388FF}
			.txtBox{
				.closeText {margin-right:20px;}
				.el-button{
					width:auto

				}
			}
			.paperBtn{
				padding-top:20px;
				border-top:1px solid #EBEEF5;
			}
		}

		.objectiveBox,.subjectiveBox{
			width:280px;
			height:44px;
			line-height:44px;
			font-size:16px;
			color:#000;
			font-weight:500;
			padding:0 16px;
			background:#fff;
			border-radius: 6px;
			box-sizing:border-box;
		}
		.objectiveBox{
			color:#626673;
			font-size:13px;
		}
		.subjectiveBox{
			margin-top:8px;
			height:78px;
			padding:12px 16px;
			line-height:20px;
			border-radius: 6px 6px 0px 0px;
			.el-button{
				width:48px;
				height:20px;
				line-height:20px;
				padding:0 !important;
			}
		}
		.subjectiveScore{
			width:280px;
			max-height:610px;
			background:#fff;
			border-radius:6px;
			margin-top:1px;
			.el-table__row{
				height:44px;
				td{
					border:0;
					padding:0;
				}
			}
			.el-button{
				width:18px;
				height:18px;
				border-radius: 2px;
				font-size:12px;
				color:#fff;
				padding:0 !important
			}
			.el-button+.el-button{margin-left:2px;}
			.el-input{
				width:58px;
				margin:0 2px;
				/deep/ .el-input__inner{
					padding:0 !important;
					height:30px;
					line-height:30px;
					text-align:center;
					color:#3891FF;
					border-radius:2px;
					background:#E4EFFE;
					border:0;
				}
			}
			.el-input.active,.current-row{
				/deep/.el-input__inner{
					border:1px solid #3891ff;
					background:#fff;
				}
			}
			.footerBtn{
				text-align:center;
				padding:20px 0 24px 0;
				.el-button{
					width:90px;
					height:30px;
					border-radius: 15px;
					border: 1px solid #E7E7E7;
					font-weight:500;
					font-szie:14px;

				}
			}
		}


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
	  .paper{width:79%}
	}
	.el-header {
		width:100%;
		height:52px;
		background: #363940;
		line-height:52px;
		padding:0 20px;
		font-size:16px;
		color:#C2C4CC;
		.paperNum {color:#FE5958}
		.surplusNum{color:#3388FF}
		.studentInfo{
			font-size:13px;
			margin-right:33px;
			.infoT{color:#9599A6}
			.infoC{color:#C2C4CC}
		}
	}

	.el-footer{
		width:100%;
		background:#FFFFFF;
		line-height:40px;
		padding:0;
		position:fixed;
		bottom:0;
		text-align:center;
		.el-button--text{
			color:#363940;
			margin-right:24px;

		}

	}
	.lastPaper {position:absolute;margin-left:-100px;}
	.realPaper  {position:absolute}
	.scoreBox{
		position:fixed;
		right:10px;
	}
	.el-radio-group .el-radio-button__inner {
	    border: 1px dashed #DCDFE6;
        border-radius: 2px !important;

	}
	.el-radio-button {
		width:auto;
		margin-right:12px;
		line-height:40px;
		margin-bottom:12px;
	}
	.el-radio-button__inner{
		width:100%;
		text-align:center;
		padding:12px 20px;
	}
	.el-radio-button__orig-radio:checked+.el-radio-button__inner{
	    background-color: #EBF5FF;
		color:#3388FF;
		box-shadow:none !important;
	}
	.paperImg{width:774px;}
	.chalkboard{background-repeat:no-repeat;background-size:100% 100%}
	::-webkit-scrollbar{
		width:6px;
	}
	::-webkit-scrollbar-thumb {
	    min-height: 20px;
	    border-radius:10px;
	    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
	    background:rgba(0,0,0,.2)
	}
	::webkit-scrollbar-track {
		background:rgba(0,0,0,.1)
	}
	.pencil{display:block;width:24px;height:24px;background:url('/img/pencil.png');margin:0 auto}
	.addTxt{display:block;width:24px;height:24px;background:url('/img/addTxt.png');margin:0 auto}
	.eraser{display:block;width:24px;height:24px;background:url('/img/eraser.png');margin:0 auto}
	.pencil.active{display:block;width:24px;height:24px;background:url('/img/pencilA.png');margin:0 auto}
	.addTxt.active{display:block;width:24px;height:24px;background:url('/img/addTxtA.png');margin:0 auto}
	.eraser.active{display:block;width:24px;height:24px;background:url('/img/eraserA.png');margin:0 auto}
	.redraw{display:block;width:24px;height:24px;background:url('/img/redraw.png');margin:0 auto}
	.clear{display:block;width:24px;height:24px;background:url('/img/clear.png');margin:0 auto}
	.full{display:block;width:24px;height:24px;background:url('/img/full.png');margin:0 auto}
	.original{display:block;width:24px;height:24px;background:url('/img/original.png');margin:0 auto}
	.answer{display:block;width:24px;height:24px;background:url('/img/answer.png');margin:0 auto}
	.realPaper{display:block;width:16px;height:16px;background:url('/img/realPaper.png');margin:0 auto}
	.big{display:block;width:16px;height:16px;background:url('/img/big.png');margin:0 auto}
	.small{display:block;width:16px;height:16px;background:url('/img/small.png');margin:0 auto}
	.lastone{display:inline-block;width:16px;height:16px;background:url('/img/lastone.png');margin:0 auto;vertical-align:middle}
	.reduction{display:inline-block;width:16px;height:16px;background:url('/img/reduction.png');margin:0 auto;}
	.sign{display:block;width:16px;height:16px;background:url('/img/sign.png');margin:0 auto;}
</style>

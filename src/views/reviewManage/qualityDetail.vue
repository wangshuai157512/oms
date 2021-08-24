<template>
	<div class="qualityDetail-container">
		<el-container>
		  <el-header class="header" style="height:52px;">
			<p class="left">
				您正在质检 {{examName}}  {{courseName}} {{paperType}}卷 
			</p>
			<p class="left" style="font-size:13px;margin-left:25%">质检状态：<span style="font-size:16px;">{{qualityState}}</span> <span v-if="backReviewReason" class="backReviewReason" v-popover:popover> ? 
					<template>
						<el-popover  ref="popover" trigger="hover" placement="bottom">
				          <p>试卷条码:{{examBarCode}}</p>
				          <p>重评原因:<span style="color:#3388FF">{{ backReviewReason.split(';')[0] }}</span>	</p>
				         
				        </el-popover>
					</template>
					
				</span></p>
			<p class="right studentInfo" v-for="item in studentInfo">
					<span class="infoT">{{item.key}}: </span> <span class="infoC"> {{item.value}}</span>
			</p>
		  </el-header>
		  <el-main style="height:100%">
		 	<el-button  style="color:#fff;" type="" class="sugCon" v-popover:popover1><i class="sign"></i>标记
				<template>
						<el-popover  ref="popover1" trigger="click" placement="top">
				          	<p>试卷条码号:{{examBarCode}}</p>
				          	<p>试卷标记为:
								<p v-for="item in feedBack" > 
								{{item.judgeUser}} {{item.type}}({{item.memo}}) 
								</p>
				          	</p>
				         
				        </el-popover>
					</template>
		 	</el-button>
			<div class="left toolbar">
				<el-button  @click="traggleFuc('pencil')" :class="{active:pencil}" type="text"><i class="pencil" :class="{active:pencil}"></i>画笔</el-button>
			<!-- 	<el-button @click="traggleFuc('drawTxt')" :class="{active:drawTxt}" type="text"><i class="addTxt" :class="{active:drawTxt}"></i>文字
						<div style="display:none;position:absolute;" class="txtBox">
						<textarea v-model="textSign" autofocus="autofocus" type="text" style="text-align:left" class="txt"></textarea><br>
						<el-button type="primary" @click="addText($event)" size="mini" class="addText right" >确定</el-button >
						<el-button size="mini" @click="closeText" class="closeText right">取消</el-button >
						
					</div>
				</el-button> -->
			
				<el-button @click="traggleFuc('eraser')"  :class="{active:eraser}" type="text"><i class="eraser" :class="{active:eraser}"></i>擦除</el-button>
				<el-button @click="redraw" type="text"><i class="redraw"></i>撤销</el-button>
				<el-button @click="clear" type="text"><i class="clear"></i>清除</el-button>
				
				<el-button v-if="otsPaperId || localAddress" type="text" @click='openOriginal'><i class="original"></i>原卷</el-button>
				</el-button>
				<el-button v-if="localAnswerAddress" type="text" @click="showAnswer"><i class="answer"></i>答案</el-button>
			</div>
			<div class="left paper">
				<div v-for="(item,index) in StudentAnswerPaperList"  >

						<img  @load="loadImg(item.sequence)"  v-if="markImgList[index]"  class="markImg" :data-index="item.sequence" v-for="i in markImgList[index]" :src="i" width='774px' style="display:none">
						<img @load="loadImg(item.sequence)" :src="item.address" class="paperImg" style="display:none">
						<canvas
						 :id="item.sequence"
                        :width="W"
                        ref="chalkboard"
                        class="chalkboard"
                        :height="H"
						 :style="{backgroundImage : `url(${item.address})`}" @mouseenter='mouseENTER($event)' @mouseleave='mouseLEAVE($event)'   ></canvas>


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
				 		<span class="right" style="font-size:18px;color:#9599A6;"><span style="color:#3891FF">{{stuSubjectiveScore}}</span> / <span style="color:#363940">{{totalPaperSubjectiveScore}}</span>分</span>
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
						    prop="studentScore"
						    label="历史得分"
					    	align="center"
					    	width="70"
						    >
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
						    	<el-button @click="plus(scope.row)" v-show="scope.row.isActive" type="primary">加</el-button>
						    	<el-button @click="fullScore(scope.row)" v-show="scope.row.isActive" type="success">满</el-button>

						    </template>
					    </el-table-column>
			 		</el-table>
			 		<div class="footerBtn">

			 			<el-button  round style="color:#363940;margin-right:20px;" @click="rebackView">打回重评</el-button>
			 			<el-button type="primary" round @click="save">通过</el-button>
			 		</div>
			 	</div>
			</div>
		  </el-main>
		 
		</el-container>
	
	    <oms-custom-page
    	:dialog.sync="isshowReview"
        title="打回重评">
	        <template v-slot:content>
	        	<p style="margin-bottom:15px;">请选择打回重评原因</p>
	        	<el-radio-group v-model="reviewReason">
				    <el-radio-button label="1" >无评阅痕迹</el-radio-button>
				    <el-radio-button label="2" >评阅标准不当</el-radio-button>
				    <el-radio-button label="3" >问题试卷未标记</el-radio-button>
				    <el-radio-button label="4" >其他</el-radio-button>
			    </el-radio-group>
			    <el-input v-model="reviewReasonMemo" type="textarea" :rows="2" resize="none" ></el-input>
	        </template>
	    	<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button  @click="isshowReview = false" round>取 消</el-button>		          
		            <el-button type="primary" @click="saveReview" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>

	</div>


</template>

<script>
	import  * as echarts from 'jquery';
	export default{
		name:"qualityDetail",
		data(){
			return {
				qualityState:"",
				examName:"",
				paperType:"",
				value:0,
				isshowSign:false,	
				isshowReview:false,			
				feedBack:[],
				objectiveScore:0, //客观题总分
				stuObjectiveScore:0, //客观题得分
				// subjectiveScore:0,
				stuSubjectiveScore:0,
				oldTotalScore:0,
				totalPaperSubjectiveScore:0,
				viewStudentInfo:0,
				studentInfo:[],
				isDisplayObjectiveScore:0,
				isBackReview:0,
				courseName:"",
				backReviewReason:"",
				reviewReason:"",
				reviewReasonMemo:"",
				score:0,//试卷总分
				examBarCode: this.$route.query.ExamBarCode,
				feedBackMemo:"",
				checkoutCode:"",
				otsPaperId:"",
				localAddress:"",
				paperInfo:{},
				tabelData:[

				],
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
    			waitReview:0
			}
		},
		methods:{
			getPaper(){
				let that = this
				console.log(this.$route.query)

				
				let data= {
					examBarcode:this.$route.query.ExamBarCode,
					paperId: this.$route.query.PaperID
				}
				
				this.$api.reviewManage.getStudentPaperInfo(data).then(res => {
					let json = res.data
					that.qualityState = json.qualityState;
					that.examName = json.examInfo.examName;
					that.courseName = json.examInfo.courseName;
					that.studentInfo = json.studentInfo
					that.backReviewReason = json.backReviewReason
					this.paperType = json.examInfo.paperType
					// this.doReview = json.teacherReviewInfo.judgeStatInfo.doReview
					// this.waitReview = json.teacherReviewInfo.judgeStatInfo.waitReview
					// this.courseName =json.paperInfo.courseName
					// this.isBackReview = json.studentPaperInfo.isBackReview
					// this.backReviewReason = json.studentPaperInfo.backReviewReason
					// this.checkoutCode = json.paperInfo.checkoutCode
					// this.otsPaperId = json.paperInfo.otsPaperId
					this.localAddress = json.localAddress
					this.localAnswerAddress = json.localAnswerAddress
					this.isDisplayObjectiveScore = json.isDisplayObjectiveScore
					// this.score = json.paperInfo.score
					// this.viewStudentInfo = json.paperInfo.viewStudentInfo
					// this.studentInfo = json.studentPaperInfo.studentInfo
					this.feedBack = json.feedBack
					this.stuObjectiveScore = json.paperObjectiveScore
					// this.objectiveScore = json.objectiveScore
					this.totalPaperSubjectiveScore = json.totalPaperSubjectiveScore
					// this.examBarCode = json.studentPaperInfo.examBarCode
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
	                    this.oldTotalScore += item.studentScore
						this.tabelData.push(
							{
								isActive:false,
								questionNum:questionNum,
								questionScore:item.score,
								studentScore:item.studentScore,
								score:"",
								sequence:item.sequence
							},
						)
					})

					json.studentAnswerPaperList.forEach(item => {
			        	item.address = item.address.replace(/\\/g, '/')
			        })
					this.StudentAnswerPaperList = json.studentAnswerPaperList
			        json.teacherMarkImgList.forEach(item => {
			        	if(item.length>0){
			        		item.forEach(e => {
			        			e = e.replace(/\\/g, '/')
			        		})
			        	}
			          
			        })
			        this.markImgList = json.teacherMarkImgList
					console.log(res)


				})

			},
			
			big(){
				this.W += this.W/100 * 4
				this.H += this.H/100 * 4
				if(this.ctx){
					this.ctx.scale(this.W/774,this.H/1540)
				}
				
				
			},
			samll(){
				this.W -= this.W/100 * 4
				this.H -= this.H/100 * 4
				if(this.ctx){
					this.ctx.scale(this.W/774,this.H/1540)
				}
				
			},
			reduction(){
				this.W = 774
				this.H = 1540
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
				this.changeScore()
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
				this.changeScore()
			},
			zeroScore(row){
				row.score = 0;
				this.changeScore()
			},
			
			leaveCell(row){
				row.isActive = false
				this.changeScore(row.score);
			},
			enterCell(row){
				row.isActive = true
				this.changeScore(row.score);
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
				// console.log(val)
				this.stuSubjectiveScore=0;
				if(val == "" || val==undefined){
					val = 0
				}else{
					console.log(val)
				}

				// console.log(this.tabelData)
				this.tabelData.forEach(item=>{
					if(item.score != undefined && item.score != "" && item.score != NaN) {
						that.stuSubjectiveScore += parseFloat(item.score)
					}else if(item.score===0){
						that.stuSubjectiveScore += parseFloat(item.score)
					}else{
		            	that.stuSubjectiveScore += item.studentScore
		            }
					
				})
				
				// this.subjectiveScore = 
			},
			fullScore(row){
				row.score = row.questionScore
				this.changeScore();
			},
			loadImg(index){
				let img = document.getElementsByClassName("markImg");
				this.img[index] = [];
				img.forEach(item => {
					
					if(item.dataset.index == index){
						document.getElementById(index).getContext("2d").drawImage(item, 0, 0);
					}
					// item.onload = ()=>{
						
					// }
					
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
				}else if(txt == "eraser"){
					this.pencil = false
					this.drawTxt = false
					this.eraser = true
				}
			},
			redraw(){	
				let that = this			 
	           if (that.img[that.index].length > 0) {
                	that.ctx.putImageData(that.img[that.index].pop(), 0, 0);
	            }
	            else {
	                alert("不能再撤销了");
	            }
        
			},
			clear(){
			   	this.eraser = false;
	            this.pencil = true;
	            this.drawTxt = false
	            this.ctx.clearRect(0, 0, this.W, this.H)
			},
			// addText(event){
			// 	console.log(event)
			// 	let conTxt = this.textSign;
	  //           this.ctx.font = "24px Georgia";
	  //           this.ctx.fillStyle = "red";          
	  //           if (conTxt) {                
	  //               let Y = event.pageY - this.canvas.offsetTop + document.querySelector('.paper').scrollTop-95
	  //               let imgData = this.ctx.getImageData(0, 0, this.W, this.H);
	  //               this.img[this.index].push(imgData)
	  //               let rw =document.getElementsByClassName("txt")[0].style.width
		 //        // document.getElementsByClassName("txt")[0].style.height="50px"
	  //               let conTxtWidth = 0;
	  //               let lastSubStrIndex = 0	               
	  //               for (var i = 0; i < conTxt.length; i++) {
	  //                   conTxtWidth += this.ctx.measureText(conTxt[i]).width;
	  //                   if (conTxtWidth > rw) {
	  //                       this.ctx.fillText(conTxt.substring(lastSubStrIndex, i), this.xLast - 5, Y);//绘制截取部分  
	  //                       conTxtWidth = 0;
	  //                       Y += 25;
	  //                       lastSubStrIndex = i;
	  //                   }
	  //                   if (i == conTxt.length - 1) {
	  //                       this.ctx.fillText(conTxt.substring(lastSubStrIndex, i + 1), this.xLast - 5, Y); //绘制剩余部分
	  //                   }
   //              	}
	  //               //ctx.fillText(conTxt, xLast-5, yLast+10,maxW);                
	  //              	document.getElementsByClassName("txtBox")[0].style.display ="none"
			// 		this.textSign = ""
			// 		document.getElementsByClassName("txt")[0].style.width=0
			//         document.getElementsByClassName("txt")[0].style.height=0
			//         document.getElementsByClassName("txtBox")[0].style.left=0
			//         document.getElementsByClassName("txtBox")[0].style.top=0
	  //               this.eX = this.eY = this.sX = this.sY = 0;
	                
	  //           } else {
	  //               document.getElementsByClassName("txtBox")[0].style.display ="none"
			// 		this.textSign = ""
	  //               this.eX = this.eY = this.sX = this.sY = 0;                
	  //           }
	           
	  //           document.removeEventListener('mousewheel',function(){});
			// },
			// closeText(){
			// 	document.getElementsByClassName("txtBox")[0].style.display ="none"
			// 	this.textSign = ""
			// },
			mouseENTER(e){
				console.log(e)
			  	this.canvas = e.target;
		        this.ctx = this.canvas.getContext("2d");
		        this.ctx.scale(this.W/774,this.H/1540)
		        // index = $(e.target).attr("data");
		        // targetId = $(e.target).attr("id")
	            let mouseX = e.pageX;
		        let mouseY = e.pageY;
		        let _mouseX;
		        let _mouseY;
		      	let cans = document.getElementsByClassName("chalkboard")
		      	console.log(cans)
		      	let that = this;
		        cans.forEach(function (item) {
		        	let currentCtx = item.getContext("2d")
		            currentCtx.width = that._w;
		            currentCtx.height = that._h;
		            currentCtx.scale(that.w / that.W, that.h / that.H)
		            let currentImgData = currentCtx.getImageData(0, 0, item.width,item.height);
		            currentCtx.putImageData(currentImgData, 0, 0, 0, 0, that.W, that.H)

		        });
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
		        
	             $(this.canvas).unbind().bind("mousedown",function (e) {
		            e.stopPropagation();
		            if (that.drawTxt==false) {
		                let imgData = that.ctx.getImageData(0, 0, that.W, that.H);
		                that.img[that.index].push(imgData)
		            }

		            let imgData = that.ctx.getImageData(0, 0, that.W,that.H);
		            // that.img[that.index].push(imgData)
		            // $("#imgMark" + index).attr("data", 0);
		            that.mouseD = true;
		            that.xLast = _mouseX;
		            that.yLast = _mouseY;
		            that.sX = e.clientX;
		            that.sY = e.clientY;
		            if (that.eraser) {
		                that.erase(_mouseX, _mouseY);
		            } else if(that.pencil){

		                that.draw(_mouseX, _mouseY);
		            } else if (that.drawTxt) {

		                // that.Txt(_mouseX, _mouseY)
		            }
		           
			      
		           
		        });
			 	that.canvas.addEventListener("mouseup",function (e) {
		        	e.stopPropagation()
	                that.mouseD = false;
	            })
		       
			},
			mouseLEAVE(e){
				this.mouseD = false; 
			},
			draw(x, y) {
		        this.ctx.lineWidth = this.brushDiameter;
		      	this.ctx.strokeStyle = 'rgba(0,0,255,1)';
		        this.ctx.beginPath();
		        this.ctx.moveTo(this.xLast, this.yLast);
		        this.ctx.lineTo(x, y);
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
		        // if ((x + 150) > this.W) {
		        //     var mixW = this.W - x;
		        //      document.getElementsByClassName("txt").css({ "width": "" + mixW + "px", "resize": "none" })

		        // } else {
		        //      document.getElementsByClassName("txt").css({ "resize": "auto" })
		        // }
		        console.log(x,y)

		    },
		    rebackView(){
		    	this.isshowReview = true
			},
			saveReview(){
				// this.isshowReview = true
				
				let that = this
				let flag = false;
				let data = []
				let reData = ""
				let scoreData = []
				that.tabelData.forEach(item => {
					if(item.score!=0 && item.score==""){
						
					}else{
						let sequence = item.sequence
						// scoreData.push({'sequence':item.sequence ,'score': item.score})
						data.push({'sequence':item.sequence ,'score': item.score,'oldScore':item.studentScore }) ,
						 flag = true
					}
					
				})
				if(data.length>0){
					reData = {
						examBarCode:that.examBarCode,
						totalScore:that.stuSubjectiveScore ,
						questionSocreEntity:data,
						checkState:0,
						paperState:0,

					}
				}else{
					reData = ""
				}
				this.$api.reviewManage.saveQuality(
				{
					examBarCode:that.examBarCode,
					submitType :3,
					setType:that.reviewReason,
					setMemo:that.reviewReasonMemo,
					questionScore:reData
				}).then(res=>{
					this.$message({
			            type: 'success',
			            message: '质检成功!',
			            onClose:function(){
			            	window.close();
			            }
		          	});
				})
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
			save(){
				let that = this
				let flag = true;
				let data = []
				let reData = ""
				let scoreData = []
				let submitType = 1
				let isImgMark = 0
				that.tabelData.forEach(item => {
					if(item.score!==""){
						let sequence = item.sequence
						// scoreData.push({'sequence':item.sequence ,'score': item.score})
						data.push({'sequence':item.sequence ,'score': item.score }) ,
						flag = true
					}else{
					
					}
					
				})
				if(data.length>0){
					reData = {
						examBarCode:that.examBarCode,
						totalScore:that.stuSubjectiveScore ,
						questionSocreEntity:data,
						checkState:0,
						paperState:0,
						oldTotalScore:that.oldTotalScore
					}
					submitType = 2
				}else{
					reData = ""
					submitType = 1
				}
				// console.log(that.img)
				for(var index in that.img){
					if(that.img[index].length>0){
						isImgMark = 1
					}
				}
				if(isImgMark){
					this.saveCanvas();
				}
				if(flag){					
					this.$api.reviewManage.saveQuality(
					{
						examBarCode:that.examBarCode,
						submitType :submitType,
						setType:0,
						setMemo:"",
						questionScore:reData
					}).then(res=>{
						if(res.status==1){
							this.$message({
					            type: 'success',
					            message: '质检通过!',
					            onClose:function(){
					            	window.close();
					            }
				          	});
						}
					})
				}
				
			}

		},
		mounted(){
			this.getPaper()

		}
	}
</script>
<style lang="less" scoped>
	.left{float:left}
	.right{float:right}
	.qualityDetail-container{
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
			right:350px;
			width:48px;
			height:48px;
			background:#3891FF;
			border-radius:50%;
			padding:0;
			text-align:center;

		}
		background: #EDEFF2;
		padding:10px;
		margin-bottom:40px;
		.toolbar{
			padding-top:20px;
			width:64px;
			text-align:center;
			height:520px;
			background:#fff;
			position:fixed;
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
		}
		
		.objectiveBox,.subjectiveBox{
			width:340px;
			height:44px;
			line-height:44px;
			font-size:16px;
			color:#000;
			font-weight:500;
			padding:0 16px;
			background:#fff;
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
				padding:0;
			}
		}
		.subjectiveScore{
			width:340px;
			max-height:610px;
			background:#fff;
			margin-top:1px;
			border-radius:0px 0px 6px 6px ;
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
				padding:0
			}
			.el-button+.el-button{margin-left:2px;}
			.el-input{
				width:58px;
				margin:0 2px;
				.el-input__inner{
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
				.el-input__inner{
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
		.paper{
		text-align:center;
		height:100%;
		overflow-y:auto

	}
	
	@media screen and (max-width:1366px) {
	  .paper{width:70%}
	}
	@media screen and (min-width:1366px) {
	  .paper{width:74%}
	}
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
	.scoreBox {
		position:fixed;
		right:10px;
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
		}
		
	}
	.lastPaper {position:absolute;margin-left:-100px;}
	.realPaper  {position:absolute}
	
	.el-radio-group .el-radio-button__inner {
	    border: 1px dashed #DCDFE6;
	    border-radius:2px !important;
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
	
	.original{display:block;width:24px;height:24px;background:url('/img/original.png');margin:0 auto}
	.answer{display:block;width:24px;height:24px;background:url('/img/answer.png');margin:0 auto}
	.realPaper{display:block;width:16px;height:16px;background:url('/img/realPaper.png');margin:0 auto}	
	.big{display:block;width:16px;height:16px;background:url('/img/big.png');margin:0 auto}
	.small{display:block;width:16px;height:16px;background:url('/img/small.png');margin:0 auto}
	.lastone{display:inline-block;width:16px;height:16px;background:url('/img/lastone.png');margin:0 auto;vertical-align:middle}
	.reduction{display:inline-block;width:16px;height:16px;background:url('/img/reduction.png');margin:0 auto;}
	.sign{display:block;width:16px;height:16px;background:url('/img/sign.png');margin:0 auto;}
</style>

<template>
	<div class="answerSheet-container">
		<el-container>
			<el-header class="header" style="height:52px;line-height:52px;">
				<a class="left back" >返回答题卡列表</a>
				<el-button class="right save" round type="primary" @click="save">保存</el-button>
				<el-button class="right preview" round @click="preview">预览</el-button>
				
			</el-header>
		  	<el-container style="padding:16px;">

			    <el-aside width="160px" class="info">
			    	<p class="open"><img src="/img/open.png" >基础信息</p>
				    <div class="baseInfo">
				    	<el-button @click="addItem($event)" class="baseItem" :disabled="item.disabled"  v-for="item in studentInfo" :id="item.key"><img :src="item.disabled ?'/img/addItem.png':'/img/addItemA.png'"></img> {{item.value}}</el-button>
				    </div>
				    <p class="open" style="margin-top:16px;"><img src="/img/open.png" >客观题区</p>
			    	<div class="objective">

			    		<el-button class="baseItem"  @click="addObj"><img src="/img/addItemA.png"> 客观题</el-button>	
			    	</div>
			    </el-aside>
			    <el-main>
			    	<div class="card">
			    		<div class="title" >
			    			<el-input v-model="cardInfo.title" ></el-input>
			    		</div>
			    		<ul class="rulerX">
			    			<li>1</li>
			    			<li>2</li>
			    			<li>3</li>
			    			<li>4</li>
			    			<li>5</li>
			    			<li>6</li>
			    			<li>7</li>
			    			<li>8</li>
			    			<li>9</li>
			    			<li>10</li>
			    			<li>11</li>
			    			<li>12</li>
			    			<li>13</li>
			    			<li>14</li>
			    			<li>15</li>
			    			<li>16</li>
			    			<li>17</li>
			    		</ul>
			    		<ul class="rulerY">
			    			<li>1</li>
			    			<li>2</li>
			    			<li>3</li>
			    			<li>4</li>
			    			<li>5</li>
			    			<li>6</li>
			    			<li>7</li>
			    			<li>8</li>
			    			<li>9</li>
			    			<li>10</li>
			    			<li>11</li>
			    			<li>12</li>
			    			<li>13</li>
			    			<li>14</li>
			    			<li>15</li>
			    			<li>16</li>

			    		</ul>
			    		<div class="studentInfo">
			    			<div class="markLine" style="width:100%;height:100%;postion:absolute;">
			    				<table>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    					<tr>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    						<td></td>
			    					</tr>
			    				</table>
			    			</div>
			    			<div class="tiaoma infoItem" w="9" h="3" x="0" y="0">
			    				
			    			</div>
			    			<div  @click="showEdit($event,item)"  v-for="item in paperInfos" v-bind:class="['infoItem', item.active ? 'isactive' : '']" :w="item.width"  :h="item.height" :x="item.x" :y="item.y" :style="{width: item.width*36-1 + 'px', height: item.height*36-1 + 'px' ,left:item.x*36+ 'px',top:item.y*36+ 'px'}">

			    				<div v-if="item.filedName!='answerTenat'&& item.filedName!='examCheck'&& item.filedName!='answerDescription'" class="infoItemName" :style="{lineHeight:item.height*36+ 'px'}">{{item.displayName}}</div>
								<div  v-if="item.filedName=='answerDescription'" >
									<div v-if="item.filedName=='answerDescription'" class="infoItemName left" style="width:36px;padding:12px 7px;box-sizing:border-box;color:#EE1D23">{{item.displayName}}</div>

				    				<div class="memotext" :style="{width:(item.width-1)*36+ 'px'}" v-if="item.filedName=='answerDescription'" v-html="answerDescription">				    					
				    				</div>	
								</div>
			    				<div v-if="item.filedName=='answerTenat'" style="padding:0 15px;">
			    					<p style="color:#EE1D23;line-height:36px">考生信息确认暨考试承诺书</p>
			    					<div  style="margin-left:0;text-align:left;font-size:13px;"  v-if="item.filedName=='answerTenat'" v-html="examTenat">

			    					</div>
			    					<p style="text-align:right;font-size:12px;line-height:20px;">
			    						<span style="padding-right:200px">签名:</span>  
			    						<span class="data">年</span>
			    						<span class="data">月</span>
			    						<span class="data">日</span>
			    					</p>
			    				</div>
			    				
								
								<div class="exmaCheck" v-if="item.filedName=='examCheck'">
									<span class='left' style="color:#EE1D23">此栏考生禁填</span>
									<span class='left' style="margin: 0 60px 0 30px;">考务标记由监考教师填涂</span>
									<div class="left" v-for="item in examCheckInfo" style="margin-right:35px;">
										<p>
											<span style="color:#EE1D23" :id="item.key">
											{{item.value}}
											<img src="/img/Q.png" alt="" style="margin-left:12px;">
											</span>
										</p>
									</div>
								</div>
			    				<i class="del" v-if="item.showDel" @click="del($event,item)"></i>
			    			</div>
			    		</div>
			    		<div class="objTitle"> 
							客观题答题区(选择题、判断题填图区)							
			    		</div>
			    		<div class="objArea"  @click='editObj'>
			    			<i class="del" v-if="isDelObj"  @click="delObj"></i>
			    			<div v-for="item in objective" :class="['left','choiceBox',item[0].subjectChoice.length>5? 'big':'', item[0].subjectChoice.length>10? 'large':'']" >
			    				
			    				<div v-for="ele in item" >
		    						<p>
		    							<span class="objNum">{{ele.i}}</span>
		    							<img v-for="src in ele.subjectChoice" :src="src" alt="">
		    						</p>
			    				</div>		    												 
			    			</div>
			    		</div>
			    	</div>
			    	
			    </el-main>
			    <div class="right editArea" v-if="isshowEdit">
			    	<div v-if='!isAddObj'>
			    		<p class="title">{{editInfo.displayName}}</p>
				    	<div>
				    		<p class="titlel">位置</p>
				    		<div class="editItem">
				    			横向:<el-input-number v-model="editInfo.x" controls-position="right" @change="handleChange" :min="0" :max="16"></el-input-number>
				    			纵向:<el-input-number v-model="editInfo.y" controls-position="right" @change="handleChange" :min="0" :max="15"></el-input-number>
				    		</div>
				    		<p class="titlel">大小</p>
				    		<div class="editItem">
				    			宽度:<el-input-number v-model="editInfo.width" controls-position="right" @change="handleChange" :min="1" :max="17"></el-input-number>
				    			高度:<el-input-number v-model="editInfo.height" controls-position="right" @change="handleChange" :min="1" :max="10"></el-input-number>
				    		</div>
				    		<p class="titlel" v-if="editInfo.filedName=='answerDescription'||editInfo.filedName=='answerTenat'">内容</p>
				    		<div class="editItem" v-if="editInfo.filedName=='answerDescription'">
			    				<!-- <el-input   v-model="editInfo.memo"></el-input> -->
			    				
			    				<vue-ueditor-wrap v-model="answerDescription" :config="editorConfig" editor-id="editor-demo-01"></vue-ueditor-wrap>
				    		</div>

				    		<div class="editItem" v-if="editInfo.filedName=='answerTenat'">
			    				<!-- <el-input   v-model="editInfo.memo"></el-input> -->
			    				
			    				<vue-ueditor-wrap v-model="examTenat" :config="editorConfig" editor-id="editor-demo-01"></vue-ueditor-wrap>
				    		</div>
				    	</div>
				    	<div class="footer">
				    		<el-button type="text" @click="reset" >重置</el-button>
							<el-button type="text" @click="confirm" >确定</el-button>
				    	</div>	
			    	</div>
			    	<div v-else class="objEditArea">
			    		<p class="title">客观题 <el-button type="text" class="right addObjItem" @click="addObjItem">+ 添加选项组</el-button></p>
			    		<div v-for="(item,index) in objInfo">
			    			<p class="titlel">
				    			选项组{{(index+1)}}
				    			<el-button  type="text" class="right delObjItem" @click='delObjItem($event,item)'><img src="/img/delete.png" alt="">
				    			</el-button>
			    			</p>	
			    			<div class="editItem">
			    				起始题号:<el-input-number v-model="item.startNum" controls-position="right" @change="changeObj" :min="1" :max="74"></el-input-number>
			    			</div>
			    			<div class="editItem">
			    				结束题号:<el-input-number v-model="item.endNum" controls-position="right" @change="changeObj" :min="2" :max="75"></el-input-number>
			    			</div>
			    			<div class="editItem">
			    				选项个数:<el-input-number v-model="item.itemCount" controls-position="right" @change="changeObj" :min="2" :max="15"></el-input-number>
			    			</div>
			    		</div>
						<div class="footer">
				    		<el-button type="text" @click="resetObj" >重置</el-button>
							<el-button type="text" @click="confirmObj" >确定</el-button>
				    	</div>	
			    	</div>
			    	
			    </div>
		 	</el-container>
		</el-container>	
		
	</div>
</template>

<script> 	
	let that;
	import VueUeditorWrap from 'vue-ueditor-wrap'
	export default{
		name:"answerSheet",
		components: {
			VueUeditorWrap
		},
		data(){
			return {
				templateId:this.$route.query.templateId ? this.$route.query.templateId : 0,
				examTypeId:this.$route.query.examTypeId,
				isshowEdit:false,
				answerDescription:"",
				_answerDescription:"",
				examTenat:"",
				_examTenat:"",
				isDelObj:false,
				isAddObj:false,
				cardInfo:{},				
				studentInfo:[],
				examCheckInfo:[],
				editorConfig:"",
				editInfo:{

					filedName: "",
					displayName:"",
					x:0,
					y:0,
					height:0,
					width:0,
					memo:""
				}, //编辑框初始值，编辑后改变
				tempEditInfo:[],
				currentItem:{
					filedName: "",					
					x:0,
					y:0,
					height:0,
					width:0,
					memo:""
				},//临时存储初始值，reset用
				paperInfos:[],
				objective:[],
				objInfo:[],
				tempObjInfo:[],
				options : [
					"/img/A.png",
					"/img/B.png",
					"/img/C.png",
					"/img/D.png",
					"/img/E.png",
					"/img/F.png",
					"/img/G.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
					"/img/H.png",
				]
			}
		},
		methods:{
			getAnswerCardConfigInfo () {
				this.$api.basicData.getAnswerCardConfigInfo({examTypeId:this.examTypeId}).then(res=>{					
					this.examCheckInfo = res.data.examCheckInfo
					this.studentInfo = res.data.studentInfo
					this.answerDescription = res.data.answerDescription
					this._answerDescription = res.data.answerDescription
					this.examTenat = res.data.examTenat
					this._examTenat = res.data.examTenat
					this.studentInfo.forEach(item=>{
						this.paperInfos.forEach(ele=>{
							if(ele.filedName==item.key){
								console.log(ele.filedName)
								item.disabled = true;
							}
						})
					})
				})
			},
			getAnswerCardTemplateInfo () {
				let that = this;
				this.$api.basicData.getAnswerCardTemplateInfo({templateId:this.templateId}).then(res=>{

					if(res.status==1){
						this.cardInfo = res.data.cardInfo
						//this.templateId = res.data.templateId ? res.data.templateId : 0
						res.data.baseInfo.forEach(item=>{
							item.showDel = false
							item.active = false
							if(item.filedName=="answerDescription"){
								//item.memo = this.answerDescription 
								this.answerDescription = item.memo
							}else if(item.filedName=="answerTenat"){
								//item.memo = this.answerTenat
								this.answerTenat = item.memo
							}
						})
						that.paperInfos = res.data.baseInfo;
						// res.data.objectiveInfo.objectiveNum = [
						// 	{startNum: 1, endNum: 13, itemCount: 5},
						// 	{startNum: 14, endNum:30, itemCount: 8},

						// ]		
						this.objInfo = res.data.objectiveInfo.objectiveNum
						this.tempObjInfo = JSON.parse(JSON.stringify(this.objInfo))
						// this.tempObjInfo = res.data.objectiveInfo.objectiveNum	

										
						let options = [
							"/img/A.png",
							"/img/B.png",
							"/img/C.png",
							"/img/D.png",
							"/img/E.png",
							"/img/F.png",
							"/img/G.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
							"/img/H.png",
						];
						
						res.data.objectiveInfo.objectiveNum.forEach(item=>{
							let subjectChoice = []
							let objective  = []
							// this.tempObjInfo.push(item)
							// this.objInfo.push(item)
							for(var i=0;i<item.itemCount;i++){
								subjectChoice.push(options[i])

							}
							for(var i=item.startNum;i<item.endNum+1;i++){
								objective.push({i,subjectChoice})
							}
							for(var i=0;i<objective.length;i++){								
								if(i==0 || i%5==0 ){
									this.objective.push(objective.slice(i,i+5))
									// if(objective[i].subjectChoice)
								}
								
							}
						})
						console.log(this.objective)
						
					}
					
				})
			},
			showEdit(e,item){
				this.isshowEdit = true;
				this.isAddObj = false
				this.paperInfos.forEach(ele=>{
					if(ele.filedName==item.filedName){
						ele.showDel = true
						ele.active = true
					}else{
						ele.showDel = false
						ele.active = false
					}
				})
				item.showDel = true
				item.active = true
				this.editInfo.filedName = item.filedName
				this.editInfo.displayName = item.displayName
				this.editInfo.x = item.x
				this.editInfo.y = item.y
				this.editInfo.height = item.height
				this.editInfo.width = item.width
				this.editInfo.memo = item.memo
				
				this.currentItem.filedName = item.filedName
				this.currentItem.x = item.x
				this.currentItem.y = item.y
				this.currentItem.height = item.height
				this.currentItem.width = item.width
				this.currentItem.memo = item.memo
			},
			addItem(e){
				console.log(e.currentTarget.getAttribute("id"))
				let filedName = e.currentTarget.getAttribute("id");
				let displayName = e.currentTarget.textContent
				this.paperInfos.push({
					filedName: filedName,
					displayName:displayName,
					x:0,
					y:this.paperInfos[this.paperInfos.length-1].y+this.paperInfos[this.paperInfos.length-1].height,
					height:1,
					width:8,
					showDel:false,
					active:false,
					memo:""
				})
				this.studentInfo.forEach(item=>{
					if(filedName==item.key){
						item.disabled = true;
					}
				})
			},
			del(e,item){
				console.log(item)
				this.paperInfos.forEach((ele,i)=>{
					ele.showDel = false
					if(ele.filedName==item.filedName){
						this.paperInfos.splice(i, 1)
					}

				})
				this.isshowEdit = false
				this.studentInfo.forEach(ele=>{

					if(item.filedName==ele.key){
						ele.disabled = false;
					}
				})
					
			},
			handleChange(e){		

			},
			reset(){			
				this.editInfo.x = this.currentItem.x
				this.editInfo.y = this.currentItem.y 
				this.editInfo.height = this.currentItem.height
				this.editInfo.width =this.currentItem.width
				this.editInfo.memo = this.currentItem.memo
				this.answerDescription = this._answerDescription
				this.examTenat = this._examTenat
				this.paperInfos.forEach (item => {
					if(item.filedName == this.currentItem.filedName){

						item.x = this.currentItem.x
						item.y = this.currentItem.y 
						item.height = this.currentItem.height
						item.width = this.currentItem.width
						item.memo = this.currentItem.memo
					}
				})
			},
			confirm(){
				console.log(this.editInfo)
				this.paperInfos.forEach (item => {

					if(item.filedName == this.editInfo.filedName){
						item.x = this.editInfo.x
						item.y = this.editInfo.y 
						item.height = this.editInfo.height
						item.width = this.editInfo.width
						item.memo = this.editInfo.memo
						if(this.editInfo.filedName=="answerDescription"){
							item.memo = this.answerDescription
						}
						if(this.editInfo.filedName=="answerTenat"){
							item.memo = this.examTenat
						}
					}
				})
				
			},
			addObj(){
				this.isshowEdit = true
				this.isAddObj = true;
			},
			editObj(){
				this.isAddObj = true;
				this.isshowEdit = true;
				this.isDelObj = true;
			},
			delObj(){
				this.objective = []
				this.isDelObj = false
			},
			addObjItem(){
				
				this.objInfo.push({
					startNum:"",
					endNum:"",
					itemCount:""
				})
			
			},
			delObjItem($event,item){
				console.log(item)
				this.objInfo.forEach((ele,i) => {
					if(ele.startNum==item.startNum && ele.endNum==item.endNum && ele.itemCount==item.itemCount){
						this.objInfo.splice(i, 1)
					}
				})
			},
			changeObj(value){
				
			},
			resetObj(){
				this.objInfo = this.tempObjInfo
				this.objective=[]
				this.objInfo.forEach(item=>{
					let subjectChoice = []
					let objective  = []
					for(var i=0;i<item.itemCount;i++){
						subjectChoice.push(this.options[i])

					}
					for(var i=item.startNum;i<item.endNum+1;i++){
						objective.push({i,subjectChoice})
					}
					for(var i=0;i<objective.length;i++){								
						if(i==0 || i%5==0 ){
							this.objective.push(objective.slice(i,i+5))
							// if(objective[i].subjectChoice)
						}
						
					}
				})
			},
			confirmObj(){
				
				this.objective=[]
				this.objInfo.forEach(item=>{
					let subjectChoice = []
					let objective  = []
					for(var i=0;i<item.itemCount;i++){
						subjectChoice.push(this.options[i])

					}
					for(var i=item.startNum;i<item.endNum+1;i++){
						objective.push({i,subjectChoice})
					}
					for(var i=0;i<objective.length;i++){								
						if(i==0 || i%5==0 ){
							this.objective.push(objective.slice(i,i+5))
							// if(objective[i].subjectChoice)
						}
						
					}
				})
			},
			preview(){

				let data = {
					templateId:this.templateId,
					examTypeId:this.examTypeId,
					designInfo:{
						templateId:this.templateId,
						cardInfo:this.cardInfo,
						baseInfo:this.cardInfo.baseInfo,					
						objectiveInfo:{objectiveNum:this.objInfo},	
					}
				}

				this.$api.examination.saveAnswerCardDesignInfo(data).then(res=>{
					console.log(res)
					if(res.status==1){
						window.open(res.data.fileName)
					}
				})
			},
			save(){
				let data = {
					templateId:this.templateId,
					examTypeId:this.examTypeId,
					designInfo:{
						templateId:this.templateId,
						cardInfo:this.cardInfo,
						baseInfo:this.paperInfos,					
						objectiveInfo:{objectiveNum:this.objInfo},	
					}
				}
				this.$api.examination.saveAnswerCardDesignInfo(data).then(res=>{
					console.log(res)
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
			}
		},
		mounted(){
			that= this;
			this.getAnswerCardConfigInfo()
			this.getAnswerCardTemplateInfo()
		},
		created() {
    // 更多 UEditor 配置，参考 http://fex.baidu.com/ueditor/#start-config
		    this.editorConfig = {
		      UEDITOR_HOME_URL: '/UEditor/', // 访问 UEditor 静态资源的根路径，可参考常见问题1
		      serverUrl: '', // 服务端接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
		    };
	    },
	}
</script>
<style lang="less"  scoped>
	.answerSheet-container{background-color:#F4F5F8}
	.header{padding-left:32px;background-color:#fff}
	.left{float:left}
	.right{float:right}
	.back{
		font-weight: 400;
		color: #45494D;
	}
	.preview{margin:12px;}
	.save{margin:12px 0}
	.info{
		width:160px;
		max-height:690px;
		background-color:#fff;
		padding:24px 20px;
		.open{
			font-size:16px;
			font-weight: 500;
			color: #2D2F33;
			margin-bottom:16px;
			img{margin-right:4px;}
		}
		.baseItem{
			text-align:left;
			padding-left:24px;
			width:120px;
			height:32px;
			border:1px dashed #EBEEF5;
			backgroun:url('/img/squar.png');
			margin-bottom:8px;
			img{
				vertical-align: bottom;
				margin-right:7px;
			}
		}
	}
	.el-main{text-align:center;}
	.el-button+.el-button{
		margin-left:0;
	}
	.card{
		width:800px;
		margin:0 auto;
		padding-top:28px;
		background-color:#fff;
		.title {
			/deep/ .el-input__inner{
				border:0 none;
				text-align:center !important;
				font-size:28px;
				font-weight: 500;
				color: #2D2F33;

			}
		}
		.rulerX{
			width:612px;
			height:36px;			
			font-size:12px;
			font-weight: 400;
			color: #C2C6CC;
			margin:0 auto;
			li{
				float:left;
				width:36px;
				line-height:36px;
			}
		}
		.rulerY{
			float:left;
			margin-left:58px;
			width:36px;
			height:576px;
			font-size:12px;
			font-weight: 400;
			color: #C2C6CC;
			li{
				height:36px;
				line-height:36px;
			}
		}
		.studentInfo{
			width:612px;
			height:576px;			
			border: 1px solid #000000;
			margin:0 auto;
			position: relative;
			.markLine{position: absolute;}
			.infoItem.isactive{border:1px solid #006AFF;z-index:100}
			.infoItem{
				position:absolute;
				background:#fff;
				border-bottom:1px solid#000000;
				.infoItemName{
					width:71px;
					height:100%;
					border-right:1px solid #000000;
				}
				.del{
					position:absolute;
					width:16px;
					height:16px;
					background:url('/img/dell.png');
				    right: -8px;
    				top: -8px;
					z-index:3;
				}
			}
			table{
				width: 100%;
   		 		height: 100%;
    			border-collapse: collapse;
    		}
			td{border:1px solid #ccc}
			.tiaoma{
				width:323px;
				height:107px;
				left:0;
				top:0;			
			}
			.memotext{
			    text-align: left;
			    padding: 15px 20px ;
			    margin-left: 36px;
			    box-sizing: border-box;
				font-size:13px;
			}
			.exmaCheck{
				text-align:left;
				padding-left:30px;
				line-height:36px;
				border:1px solid #000000;
			}
			.data{padding-left:30px;}
		}
		.objArea{
			width:612px;
			height:640px;
			border: 1px solid #000000;
			margin:0 auto;
			text-align:left;
			position: relative;
			.del{
				position:absolute;
				width:16px;
				height:16px;
				background:url('/img/dell.png');
			    right: -8px;
				top: -8px;
				z-index:3;
			}
			.choiceBox{
				width:200px;
				height:130px;
				padding:15px;
				box-sizing:border-box;
				.objNum{
					padding-right:8px;
					font-size:10px;
					line-height:12px;
					vertical-align:top
				}
				img{margin:0 4px 4px 0}
			}
			.choiceBox.big{
				width:400px;
			}
			.choiceBox.large{
				width:600px;
			}
		}
	}
	.editArea{
		width:320px;
		height:100%;
		background-color:#fff;
		padding:0 24px;
		.title{
			height:64px;
			border-bottom:1px solid #F1F2F5;
			line-height:64px;			
			font-size:20px;
			font-weight: 500;
			color: #2D2F33;
		}
		.titlel{
			font-size:14px;
			font-weight: 500;
			color: #2D2F33;
			height:60px;
			line-height:60px;
			.delObjItem{
				margin-top:15px;
				text-align:right;
				vertical-align: sub;
			}
		}
		.editItem{
			font-size:14px;
			font-weight: 400;
			color: #9299A6;
			/deep/ .el-input-number{
				width:80px ;
				height:32px;
				line-height:32px;
				margin:0 28px 0 10px;
				.el-input-number__decrease, .el-input-number__increase{
					width:auto;
					line-height:16px;
				}
				.el-input__inner{
					height:32px !important;
					line-height:32px;
					padding: 0 !important;
				    padding-right: 10px !important;
				    text-align: center;
				}
			}
		}
		.objEditArea{
			.editItem{
				margin-bottom:12px;
				padding-left:12px;
				.el-input-number{
					width:106px;
				}
			}
			.addObjItem{
				line-height:60px;
			}
			
		}
		.footer{
			height:70px;
			line-height:70px;
			border-top:1px dashed #DADDE6;
			margin-top:24px;
			text-align:center;
		}
	}
</style>
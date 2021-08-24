<template>
    <div class="siteconfi_container">
        <oms-table
	        :title="pageTitle"
	        :tableList="tableData"
	        :tableHeaderList="tableHerder"
	        :option="tableOption"
	        @handleSelectionChange="handleSelectionChange"
        />
        <oms-custom-page
	        :dialog.sync="isEditNotice"
	        title="编辑评阅公告"
	        width="30%"
	    >
	    	<template v-slot:content>
	    		<div class="tagList">
	    			<span class="tag" @click="addMemo" size="mini">#考试批次名称#</span>
	    			<span class="tag" @click="addMemo" size="mini">#评阅开始时间#</span>
	    			<span class="tag" @click="addMemo" size="mini">#评阅结束时间#</span>
	    		</div>
	    		<el-input
				  type="textarea"
				  :autosize="{ minRows: 4, maxRows:6}"
				  placeholder="请输入内容"
				  resize="none"
				  v-model="notice">
				</el-input>
	    	</template>
    		<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button @click="isEditNotice = false" round>取 消</el-button>
		            <el-button type="primary" @click="setNotice" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>

	     <oms-custom-page
	        :dialog.sync="isshowUpdata"
	        title="更新设置"
	        width="50%"
	    >
	    	<template v-slot:content>
	    		<div class="upmemo">
	    			<p class="title">更新说明</p>
	    			<el-input
	    			 type="textarea"
					  :autosize="{ minRows: 4, maxRows:6}"
					  resize="none"
					  v-model="upmemo"></el-input>
	    		</div>
	    		<div class="userInfo"  >
	    			<p class="title" >个人信息</p>
	    			<el-row >
				 		<el-col :span="12" v-for="item in alluserInfo">
				 			<p style="margin-bottom:8px;">{{item.value}}</p>
				 			<el-checkbox-group v-model="userInfoShowList">
				 			 	<el-checkbox :label="item.label">显示</el-checkbox>

				 			</el-checkbox-group>
						    <el-checkbox-group v-model="userInfoMustList">
				 			 	<el-checkbox :label="item.label">必填</el-checkbox>

				 			</el-checkbox-group>
				 		</el-col>

				 	</el-row>


	    		</div>
	    		<div class="bankinfo">
	    			<p class="title">银行卡信息</p>
	    			<el-row >
				 		<el-col :span="12" v-for="item in bankInfo">
				 			<p style="margin-bottom:8px;">{{item.value}}</p>
						    <el-checkbox-group v-model="bankInfoShowList">
				 			 	<el-checkbox :label="item.label">显示</el-checkbox>

				 			</el-checkbox-group>
						    <el-checkbox-group v-model="bankInfoMustList">
				 			 	<el-checkbox :label="item.label">必填</el-checkbox>

				 			</el-checkbox-group>
				 		</el-col>

				 	</el-row>
	    		</div>
	    	</template>
    		<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button @click="isshowUpdata = false" round>取 消</el-button>
		            <el-button type="primary" @click="setUpdataInfo" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>

	    <oms-custom-page
	    	:dialog.sync="isshowMini"
	        title="设置最小位数"
	        width="30%">
	        <template v-slot:content>
	        	<p class="title1">最小位数</p>
	        	<el-input v-model="miniNum"></el-input>
        	 	<div style="color:#9599A6;margin-top:32px;">
		            <p class="title1">设置说明</p>
		            <p class="tips">(1) 条码号位数最佳范围为5-12位；</p>
		            <p class="tips">(2) 当条码号不足最小位数时，将在包序号前方补零；</p>
		            <p class="tips">(3) 当条码号超出20位数时，将无法生成条码号。</p>
		        </div>
	        </template>
	    	<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button @click="isshowMini = false" round>取 消</el-button>
		            <el-button type="primary" @click="setMiniNum" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>
	    <oms-custom-page
	    	:dialog.sync="isshowCopy"
	        title="复制规则" width="50%">
	        <template v-slot:content>
	        	<div class="packageItem">
	        		<p >试卷包序号 <span style="color:#409EFF">({{testPaperPackageIndex}})</span></p>
	        		<p>复制到</p>
	        		<el-checkbox-group v-model="testPaperPackageIndexCheckList" @change="changeRule($event)">
				 	 	<el-checkbox label="packageIndex">答题卡包序号</el-checkbox>
				    	<el-checkbox label="testPaperPackageNumber">试卷袋条码号</el-checkbox>
				    	<el-checkbox label="packageNumber">答题卡袋条码号</el-checkbox>
				    </el-checkbox-group>
	        	</div>
	        	<div class="packageItem">
	        		<p>答题卡包序号 <span style="color:#409EFF">({{packageIndex}})</span></p>
	        		<p>复制到</p>
	        		<el-checkbox-group v-model="packageIndexCheckList">
				 	 	<el-checkbox label="testPaperPackageIndex">试卷包序号</el-checkbox>
				    	<el-checkbox label="testPaperPackageNumber">试卷袋条码号</el-checkbox>
				    	<el-checkbox label="packageNumber">答题卡袋条码号</el-checkbox>
			    	</el-checkbox-group>
	        	</div>
	        	<div class="packageItem">
	        		<p>试卷袋条码号 <span style="color:#409EFF">({{testPaperPackageNumber}})</span></p>
	        		<p>复制到</p>
	        		<el-checkbox-group v-model="testPaperPackageNumberList">
		        		<el-checkbox label="testPaperPackageIndex">试卷报序号</el-checkbox>
				 	 	<el-checkbox label="packageIndex">答题卡包序号</el-checkbox>
				    	<el-checkbox label="packageNumber">答题卡袋条码号</el-checkbox>
			    	</el-checkbox-group>
	        	</div>
	        	<div class="packageItem">
	        		<p>答题卡袋条码号 <span style="color:#409EFF">({{packageNumber}})</span></p>
	        		<p>复制到</p>
	        		<el-checkbox-group v-model="packageNumberList">
		        		<el-checkbox label="testPaperPackageIndex">试卷包序号</el-checkbox>
				 	 	<el-checkbox label="packageIndex">答题卡包序号</el-checkbox>
				    	<el-checkbox label="testPaperPackageNumber">试卷袋条码号</el-checkbox>
			    	</el-checkbox-group>
	        	</div>
	        </template>
	    	<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button @click="isshowCopy = false" round>取 消</el-button>
		            <el-button type="primary" @click="setCopyRule" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>
    </div>
</template>
<script>

	export default{
		name: "SiteConfig",
		components:{

		},
		data(){
			return {
				restate:true,
				checkAll: true,
				isEditNotice:false,
				isshowUpdata:false,
				isshowMini:false,
				isshowCopy:false,
				pageTitle:"站点配置",
				notice:"",
				upmemo:"",
				miniNum:0,
				testPaperPackageIndex:"",
				packageIndex:"",
				testPaperPackageNumber:"",
				packageNumber:"",
				bankInfoShowList:[],
				bankInfoMustList:[],
				userInfoShowList:[],
				userInfoMustList:[],
				testPaperPackageIndexCheckList:[],
				packageIndexCheckList:[],
				testPaperPackageNumberList:[],
				packageNumberList:[],
				alluserInfo:[
					{
						value:"姓名",
						label:"realName",
					},
					{
						value:"手机号",
						label:"mobile"
					},
					{
						value:"学号/工号",
						label:"studentId"
					},
					{
						value:"身份证号",
						label:"cardNumber"
					},
					{
						value:"所属单位",
						label:"userGroup"
					},
					{
						value:"类型",
						label:"userGroupType"
					},
				],
				bankInfo:[
					{
						value:"开户银行",
						label:"bankName"
					},
					{
						value:"开户行所在地",
						label:"bankLocation"
					},
					{
						value:"开户行账号",
						label:"bankCardNumber"
					},
				],
				updataInfo:[],
				configId:"",
				tableHerder:[
					{
			    		title:"配置项",
			        	prop:"name",
			        	align:"left",
						width:"300"
			        },
			        {
			        	title:"配置描述",
			        	prop:"detail",
			        	align:"left",

			        },
			        {
			        	title: "状态",
			        	width:"150",
			        	type : 'switch',
		                prop : 'status',
		                change : this.restateFuc,
			        },
			       	{
			       		title:"操作",
			       		width:"100",
			       		type:"buttons"
			       	}

		        ],
				tableData:[],
				tableOption: {
			        ismultiple: false,
		      	},

			}
		},
		methods:{
			restateFuc(row){
				console.log(row);
				// this.$data.restate = false;
				let data = {
					configId:row.configId,
					value1:row.status?1:0
				}
				this.$api.system.setConfigValue1(data).then(res =>{
					if(res.status==1){
						this.$message({
				            type: 'success',
				            message: '设置成功!'
			          	});
					}

				})
			},
			setNotice(){
				let data = {
					configId:this.configId,
					value2:this.notice
				}
				this.setConfigValue(data)
				this.isEditNotice = false
			},
			setMiniNum(){

				let data = {
					configId:this.configId,
					value2:this.miniNum
				}
				this.setConfigValue(data)
				this.isshowMini = false
			},
			setUpdataInfo(){
				let data = {
					configId:this.configId,
					value2:{
						memo:this.upmemo,
						baseInfo:{
							showList:this.userInfoShowList,
							mustList:this.userInfoMustList,
						},
						bankInfo:{
							showList:this.bankInfoShowList,
							mustList:this.bankInfoMustList
						}
					}
				}
				data.value2 = JSON.stringify(data.value2 )
				this.setConfigValue(data)
				this.isshowUpdata = false
			},
			setConfigValue(data){
				let that = this
				that.$api.system.setConfigValue(data).then(res => {
					if(res.status==1){
						that.$message({
				            type: 'success',
				            message: '设置成功!'
			          	});
					}


				})
			},

			handleSelectionChange(val) {
			     let data = [];
			     val.forEach((item) => {
			       data.push(item.date);
			     });
			     this.deleteList = data;
		    },
		   	editNotice(row){
		   		this.isEditNotice = true;
		   		this.configId = row.row.configId
		   		let data = {configId:this.configId}
		   		this.$api.system.getConfigById(data).then(res => {
		   			if(res.status==1){
		   				this.notice= res.data.configValue2
		   			}
		   		})
		   	},
		   	setUpdata(row){
				this.isshowUpdata = true
				this.configId = row.row.configId
				let data = {configId:this.configId}
				this.$api.system.getConfigById(data).then(res => {
		   			console.log(res);
		   			let configValue2 = JSON.parse(res.data.configValue2)
		   			this.upmemo =configValue2.memo;
		   			console.log(configValue2)
		   			this.bankInfoShowList = configValue2.bankInfo.showList
		   			this.bankInfoMustList = configValue2.bankInfo.mustList
		   			this.userInfoShowList = configValue2.baseInfo.showList
		   			this.userInfoMustList = configValue2.baseInfo.mustList

		   		})
			},

			addMemo(item){
				console.log(item)
				let notice = this.notice
				notice +=  "【" + item.target.innerText + "】"
				this.notice = notice
			},
			setMini(row){
				this.isshowMini = true
				this.configId = row.row.configId
				let data = {configId:this.configId}
				this.$api.system.getConfigById(data).then(res => {
		   			console.log(res);
		   			this.miniNum =res.data.configValue2;
		   		})
			},
			setRule(row){

				let that = this
				this.isshowCopy = true
				this.configId = row.row.configId
				this.testPaperPackageIndexList = []
				this.packageIndexList = []
				this.testPaperPackageNumberList = []
				this.packageNumberList = []
				let data = {configId:this.configId}
				this.$api.system.getNumberNameSet().then(res => {
					that.testPaperPackageIndex = res.data.testPaperPackageIndexName
					that.packageIndex = res.data.packageIndexName
					that.testPaperPackageNumber = res.data.testPaperPackageNumberName
					that.packageNumber = res.data.packageNumberName
				})
				this.$api.system.getConfigById(data).then(res => {
		   			console.log(res);
		   			JSON.parse(res.data.configValue2).forEach(item=>{
		   				console.log(item)
		   				if(item.from=="testPaperPackageIndex"){
		   					that.testPaperPackageIndexList.push(item.to)
		   				}
		   				if(item.from=="packageIndex"){
		   					that.packageIndexList.push(item.to)
		   				}
		   				if(item.from=="testPaperPackageNumber"){
		   					that.testPaperPackageNumberList.push(item.to)
		   				}
		   				if(item.from=="packageNumber"){
		   					that.packageNumberList.push(item.to)
		   				}
		   			})
		   			// this.miniNum =res.data.configValue2;
		   		})
			},
			setCopyRule(){
				let data = {
					configId:this.configId,
					value2:[]

				}

   				if(this.testPaperPackageIndexList.length>0){
   					this.testPaperPackageIndexList.forEach(item=>{
   						data.value2.push({from:"testPaperPackageIndex",to:item})
   					})
   				}
   				if(this.packageIndexList.length>0){
   					this.packageIndexList.forEach(item=>{
   						data.value2.push({from:"packageIndex",to:item})
   					})
   				}
   				if(this.testPaperPackageNumberList.length>0){
   					this.testPaperPackageNumberList.forEach(item=>{
   						data.value2.push({from:"testPaperPackageNumber",to:item})
   					})
   				}
   				if(this.packageNumberList.length>0){
   					this.packageNumberList.forEach(item=>{
   						data.value2.push({from:"packageNumber",to:item})
   					})
   				}
				data.value2 = JSON.stringify(data.value2 )
				this.setConfigValue(data)
				this.isshowCopy = false
			},
			changeRule(e){
				console.log(e)
			}

		},
		mounted(){
			this.$api.system.getConfigList().then(res =>{
				console.log(res)
				if(res.status==1){
					var json = res
					json.data.forEach(item => {
						if(item.configKey=="OnlineReviewNotice"){
							item.butList = [{
								title:"编辑公告",
								onClick:this.editNotice
							}]
						}else if(item.configKey=="FlushExtendInfo"){
							item.butList = [{
								title:"更新设置",
								onClick:this.setUpdata
							}]
						}else if(item.configKey=="AutoCreatePackageNumber"){
							item.butList = [{
								title:"复制规则",
								onClick:this.setRule
							}]
						}else if(item.configKey=="PackageNumberMinLength"){
							item.butList = [{
								title:"设置最小位数",
								onClick:this.setMini
							}]
						}
						this.$data.tableData.push({
							name:item.configName,
							detail:item.configExplain + "\n\n\n" +item.configValue1Explain,
							status:item.configValue1=="1"? true:false,
							configId:item.id,
							butList:item.butList ? item.butList:[]
						})

					})
					// this.tableData = json.data

				}

            })
            // this.btnFormatter()
		}
	}
</script>
<style lang="less" scoped>
	.tagList{
		margin-bottom:8px;
		.tag{
		    margin-right: 8px;
		    font-size: 14px;
		    color: #409EFF;
		    cursor: default;
		}
	}
	.title{
	    font-size: 16px;
		margin-bottom:16px;
		font-weight: 600;
   		color: #15151a;
   		position:relative;

	}
	.title1{
	    font-size: 14px;
		margin-bottom:16px;
		font-weight: 500;
   		color: #363940;

	}
	.upmemo .el-textarea{
		padding:0 16px;
	}
	.tips{padding:4px 0 4px 8px;font-size:13px}
	.el-checkbox-group{display:inline-block;margin-left:10px;width:64px;margin-right:16px;}
	.packageItem .el-checkbox-group{width:auto;}
	.el-dialog__body{padding-top:10px;}
	.el-col{margin-bottom:10px;}
	.packageItem{
		.el-checkbox{
			margin:10px;
			margin-right:48px;
		}
	}
	.userInfo{
		margin:30px 0;
	}
	.userInfo,.bankinfo{
		.el-row{
			padding:0 16px;
		}
		span{
		    display: inline-block;
		    width: 90px;
		    text-align: right;
		}

	}
</style>

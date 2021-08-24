<template>
	<div class="packlogImport-container">
		<div class="top">
			 <span style="font-size:14px;color:#626673">考试批次</span>: <el-select size="medium"  v-model="examId" >
			   	<el-option v-for="item in examPlans"
					:value="item.examId"
					:label="item.examName"
					:key = "item.examId"
        		></el-option>
		   </el-select>
		  
		</div>
		 <div class="content">
		 	<div class="title">装袋日志导入</div>
		 	<div class="container" id="uploader" >
		        <div >
		        	<el-upload
					  class="upload"
					  ref="upload"
					  action=""
					  multiple
  					  :limit="9999"

					  :auto-upload="false"
					  :on-change="change"	
					  :show-file-list="false"
					 >
					  <el-button slot="trigger" size="small" type="primary" ><i></i>选取文件</el-button>
					  <div class="fileList" v-if="fileList.length>0">
					  	<ul>
					  		<li v-for="(item,i) in fileList">
					  			<span class="fileName">{{item.name}}</span>
					  			<span :class="{error:!status[i].state}" v-if="status.length>0">{{status[i].state?"成功":"失败"}}</span>
					  			<!-- <span v-if="status.length>0">{{status[i].error?status[i].error:""}}</span> -->
					  			<span style="cursor:pointer" v-if="status.length>0" @click="showMessage(status[i].error)"> 详情 </span>
					  			<span v-if="status.length>0 && status[i].errorFile">{{status[i].errorFile}}</span>
					  			<span class="del" @click="handleRemove(item)">x</span>

					  		</li>
					  	</ul>
					  </div>
					  <el-button v-if="" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
					
					</el-upload>
		        </div>
		     	
		     		
		     	</oms-upload-file>

		    </div>
		 </div>
	</div>
</template>
<script>
	export default {
		name:"packlogImport",
		data(){
			return {
				examId:"",
        		fileList:[],
        		examPlans:[],
        		files :[],
        		status:[]
			}
		},
		methods:{
			getExamPlan(){
				this.$api.studentManage.getEnableExamJson().then(res=>{
					if(res.status==1){
						this.examPlans = res.data
						this.examId = res.data[0].examId
					}
				})
			},
			handleRemove(file) {
		        console.log(file);
		        this.fileList.forEach((item,i)=>{
		        	if(item.uid==file.uid){
		        		this.fileList.splice(i, 1)
		        	}
		        })
		       
		    },
		    
		    handleExceed(files, fileList) {
		        this.$message.warning(`当前限制选择 9999 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
	     	},
	     	change(file,fileList){	 	
	     		this.files = fileList
	     		this.fileList.push(file.raw)
	     	},	     
	     	showMessage(msg){
	     		this.$message({
	     			message: msg,
          			type: 'error'
	     		})
	     	},
	      	submitUpload(){
	      		let formdata;
	      		let that = this;
		      	let fileMap = {
		            examId : this.examId
		        }
		        this.fileList.forEach((item,index) => {
		            fileMap['files'+index] = item
	          	})

		        formdata = this.$tools.createFormData(fileMap)
		        this.$api.system.uploadPackage(formdata).then(res=>{
		        	console.log(res)

		        	if(res.data.length>0){
		        		res.data.forEach((item,i)=>{  

		        			this.status.push(item)    			   			
		        			
		        		})
		        	}
		        })
		    },
		},
		mounted(){
			this.getExamPlan();
		}
	}
</script>
<style lang="less" scoped>
	.content{
		background-color: #fff;
		margin-top: 20px;
		height:85%;
		padding:24px;
		overflow-y:auto 
	}
	.title{
	    font-size: 18px;
		color: #15151A;
		margin-bottom: 18px;
	}
	.checkfile i{
		background: url(/img/1.jpg) no-repeat;
	    position: absolute;
	    left: 47%;
	    top: 47%;	   
	    padding-top: 120px;
	    width: 200px;
	   	border:0 none;
	}
	.fileList{
		margin:20px 0;	
		color:#606266;	
	}
	.fileList li{
		margin-bottom: 10px;
	}
	.fileList span{
		display: inline-block;
		margin-right:20px;
	}
	.error{color:red;}
	.del{margin-left:100px;cursor: pointer;}
</style>
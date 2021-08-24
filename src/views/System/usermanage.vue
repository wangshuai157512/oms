<template>
	<div class="usermanage-container">
        <oms-table-group
            :selectList="roleSelectList"
            :request-form="queryJson"
            :title="pageTitle"
            :functionalityBtn="functionalityBtnList"
            :tableList="tableData"
            :tableHeaderList="tableHerder"
            :option="tableOption"
            :paginationOptions="pageOptions"
            @changePage="changePage"
			@changeNum="changeNum"
            @search="search"
        ></oms-table-group>
         <oms-custom-page
	        :dialog.sync="isshowuserinfo"
	        :title="dialogTitle"
	        width="50%"
	    >
    		<template v-slot:content>
		        <el-form :inline=true  label-position="top"  :model="userForm" :rules="rules" ref="userForm" class="demo-userForm">
                    <el-form-item   prop="userName" label="用户名称">
                    	<el-input   placeholder="请输入用户名" v-model="userForm.userName" auto-complete="off"></el-input>
                    </el-form-item >
                    <el-form-item prop="password" label="密码">
                    	<el-input type="password" placeholder="请输入密码"  v-model="userForm.password" auto-complete="off"></el-input>

                    </el-form-item>
                    <el-form-item  prop="realName" label="姓名">
                        <el-input  placeholder="请输入姓名"  v-model="userForm.realName" auto-complete="off"></el-input>
                   </el-form-item>

                    <el-form-item label="角色名称" prop="allRoleType">
                   		<el-select size="large" v-model="userForm.roleId" multiple filterable placeholder="请选择">
							    <el-option
							      v-for="item in allRoleType"
							      :key="item.id"
							      :label="item.text"
							      :value="item.id">
							    </el-option>
						</el-select>
				    </el-form-item>

					<el-form-item  label="考试类型数据权限" style="width:240px;margin-right:24px;">
						<el-checkbox-group   v-model="userForm.examType">
							<el-checkbox prop="examType"
							 v-for="item in allExamType"
							:key="item.key"
							:label="item.value"
							:value="item.key">

							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					<el-form-item label="状态" prop="state" >
						<el-checkbox v-model="userForm.state" :true-label="1" :false-label="0">启用</el-checkbox>
					</el-form-item>
                </el-form>
		    </template>
	      	<template v-slot:footer>
		        <div class="btn-container">

		          <div class="btn-right">
		            <el-button @click="cancleSubmit('userForm')" round>取 消</el-button>
		            <el-button type="primary" @click="confirmSubmit('userForm')" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>
    </div>
</template>
<script>
	import { checkPwd} from "@/utils/validate";
	export default{
		name:"usermanage",
		data(){
			return {
				pageTitle:"用户管理",
				isshowuserinfo:false,
				dialogTitle:"新建用户",
				userForm:{
					userName: '',
			        realName: '',
			        password:"",
			        roleId:"",
			        state:1,
			        examType:[]
				},
				userId:"",
				allExamType:[],
				allRoleType:[],
				rules:{
					userName: [
	                    {required: true, message: '请输入用户名', trigger: 'blur' },
	                ],
	                password: [
	                  {required: true, message: '请输入密码', trigger: 'blur' },
                 	  {validator: checkPwd,trigger: 'blur'}
	                ],
	                realName: [
	                  {required: true, message: '请输入姓名', trigger: 'blur' }
	                ],
	                roleType: [
	                  {required: true, message: '请选择角色类型', trigger: 'change' }
	                ],
	                examType:[
	                  {required:true,message:"请勾选考试类型数据权限",trigger:"change"}
	                ]
				},
				roleSelectList:[
					{
			            title : '角色',
			            type : 'select',
			            requestKey : 'roleId',
			            label : 'text',
			            value : 'id',
			            data : [
			            	{
				              id: "-1",
				              text: "全部",
				            }
			            ]
			        },
			        {
		          	 	title : '用户信息',
			            type : 'input',
			            requestKey : 'keyword',
			            val:"",
            			placeholder : '请输入用户名或姓名'
			        }
				],
				queryJson:{
					keyword: "",
					roleId: "-1"
				},
				requestParams : {
		          _search : false,
		          nd : new Date().getTime(),
		          rows: 30,
		          page: 1,
		          sidx: 'userId',
		          sord: 'desc'
		        },
				functionalityBtnList:[
					{
			            title : '新建',
			            size:" mini",
			            funClick : this.addUser
		          },
				],
				tableData:[],
				tableHerder:[
					{
			    		title:"用户名",
			        	// width:"200",
			        	// align:"center",
			        	prop:"userName",
			        },
			        {
			    		title:"姓名",
			        	// width:"200",
			        	// align:"center",
			        	prop:"realName",
			        },
			        {
			    		title:"角色",
			        	// width:"200",
			        	// align:"center",
			        	prop:"roleName",
			        },
			        {
			        	title:"状态",
			        	type:"switch",
			        	switchShow:1,
          				switchHide:0,
			        	prop : 'state',
		                change : this.changeState
			        },
			        {
			    		title: "操作",
				        type: "buttons",
				        // width: "150",
				        fixed: "right",
				        // align: "center",
				        butList: [
				        	{
				        		title: "修改",
				                size: "mini",
				                disabled: false,
				                onClick: this.editUser,
				        	},
				          	{
				        		title: "删除",
				                size: "mini",
				                disabled: false,
				                onClick: this.deluser,
				        	},
				        ],
			        },
				],
				tableOption : {
		          ismultiple : false,
		          defaultProp : 'userName',
		          defaultSort : 'ascending'
		        },
		        pageOptions : {
		          page : 1,
		          total : 0,
		          pageSize : 30
		        },
			}
		},
		methods:{
			getUserList(){
				let that = this
				let data = {
				   ...this.requestParams,
         		   ...this.queryJson,
				}
				that.$api.system.getUserGridJson(data).then(res => {
					console.log(res)
					if(res.status==1){
						this.$set(this.pageOptions,'total',res.data.records)
        				this.tableData = res.data.rows
					}
	        	})
			},
			changePage(p) {
		        this.$set(this.requestParams,'page',p)
		        this.getUserList()
	        },
			 // 每页多少条
			changeNum(pageSize) {
				this.requestParams.rows = pageSize
				this.getUserList()
			},
	        search(){
	        	this.$set(this.requestParams,'page',1)
	        	this.getUserList()

	        },
	        changeState(row){
	        	console.log(row)
	        	let data = {
	        		state:row.state,
	        		userId:row.userId
	        	}
	        	this.$api.system.setUserState(data).then(res => {
	        		if(res.status==1){
	        			this.$message({
				            type: 'success',
				            message: '设置成功!'
			          	});
	        		}
	        		this.getUserList()
	        	})
	        },
	        addUser(){
	        	this.showuserinfo()
	        	this.userId = ""
	        	this.dialogTitle = "新建用户"
	        	this.userForm.examType = []
	        	this.userForm.roleId = []
	        },
	        editUser(row){
	        	let that = this
	        	that.dialogTitle = "修改用户"
	        	that.showuserinfo()
	        	that.$api.system.getUserRoleIds({userId:row.row.userId}).then(res => {
        			that.userForm.roleId = res.data
        		})
	        	that.userForm.examType = []
        		that.$api.system.getFormJson({userId:row.row.userId}).then(res => {
        			console.log(res)
        			that.userForm.realName = res.data.realName
        			that.userForm.userName = res.data.userName
        			that.userForm.password = res.data.password
        			that.userForm.state = res.data.state==1?true:false
        			// that.userForm.examType = res.data.dataPrivilege.split(",")
        			that.allExamType.forEach((item,index) => {
        				if(res.data.dataPrivilege.split(",").indexOf(String(item.key))!="-1"){
        					that.userForm.examType.push(item.value)
        				}else{
        					// that.userForm.examType.push(false)
        				}

        			})
        			console.log(that.userForm.examType)
        			that.userId = res.data.userId

        		})

	        },
	        showuserinfo(){
	        	let that = this

	        	that.$api.system.getAllExamTypePrivileges().then(res => {
	        		// console.log(res)
	        		that.allExamType = res.data
	        	})
	        	that.$api.system.getRoleSelectJsonByRoleType({roleType:1}).then(res => {
	        		if(res.status==1){
	        			that.allRoleType=res.data

	        		}
	        	})

	        	that.isshowuserinfo = true

	        },

	        deluser(row){
	        	let that = this
	        	that.$confirm('确认删除当前用户?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          roundButton:true,
		          type: 'warning'
		        }).then(() => {
		        	let data = {userId:row.row.userId}
		        	that.$api.system.delUser(data).then(res => {

		        		if(res.status==1){
		        			that.$message({
					            type: 'success',
					            message: '删除成功!'
				          	});
		        			that.getUserList()
		        		}

		        	})

		        }).catch(() => {

			        this.$message({
			            type: 'info',
			            message: '已取消删除'
			        });
		        });
	        },
	        getRoleSelectJsonByRoleType(){
	        	let data = {"roleType": 1}
	        	let that = this
	        	that.$api.system.getRoleSelectJsonByRoleType(data).then(res => {
	        		if(res.status==1){
	        			let roleSelectList = [
				          {
				              id: "-1",
				              text: "全部",
				          },
				          ...res.data
				        ]
	        			that.$set(that.roleSelectList[0],'data',roleSelectList)
	        		}
	        	})
	        },
	        confirmSubmit(formName){
	        	let that = this
	        	that.$refs[formName].validate((valid) =>{
	        	 	if (valid) {
                    	console.log(that.userForm)

                    	let data= {
                    		userId:that.userId,
                    		userName: that.userForm.userName,
							password: that.userForm.password,
							realName: that.userForm.realName,
							roleId: that.userForm.roleId.join(","),
							state: that.userForm.state?1:0,
							dataPrivilege:[]
                    	}
                    	that.allExamType.forEach((item,index) => {
	        				if(that.userForm.examType.indexOf(item.value)!="-1"){
	        					data.dataPrivilege.push(item.key)
	        				}else{
	        					// that.userForm.examType.push(false)
	        				}
	        			})
	        			data.dataPrivilege = data.dataPrivilege.join(",")
					  	if (!data.dataPrivilege) {
					  	  this.$message.warning('至少选择一项考试类型')
					  	  return
						}
                    	console.log(that.userForm)
                    	that.$api.system.submitUserForm(data).then(res => {
                    		if(res.status==1){
                    			this.$message({
			                        message:this.userId? '修改成功':'新建成功',
			                        type: 'success'
			                    });
	                    		that.cancleSubmit(formName)
	                    		that.getUserList()
                    		}

                    	})



                    } else {
                        console.log('error submit!!');
                        return false;
                    }
	        	 })
	        },
        	cancleSubmit:function(formName){
        		let that = this
				that.isshowuserinfo = false
				that.$refs[formName].resetFields();
			}

		},
		async mounted(){
			await this.getRoleSelectJsonByRoleType()
			this.getUserList()
		}
	}
</script>
<style >

 .el-form--inline .el-form-item {
    margin-right: 24px;

}
.el-dialog .el-checkbox {margin-bottom:16px;}
.el-form-item {
    margin-bottom: 15px;
}


</style>

<template>
	<div class="UserRolePrivilege-container">
		<!-- 用户权限配置 -->
		  <oms-table-group
            :selectList="roleSelectList"
            :request-form="queryJson"
            :title="pageTitle"
            :tableList="tableData"
            :tableHeaderList="tableHerder"
            :option="tableOption"
            :paginationOptions="pageOptions"
            @changePage="changePage"
			@changeNum="changeNum"
            @search="search"
        ></oms-table-group>
        <oms-custom-page
	        :dialog.sync="isshowuserType"
	        :title="dialogTitle"
	        width="30%"
	    >
	    	<template v-slot:content>
	    		<el-select size="large" lebel="角色名称" v-model="userType" multiple filterable placeholder="请选择">
				    <el-option
				      v-for="item in alluserTypes"
				      :key="item.id"
				      :label="item.text"
				      :value="item.id">
				    </el-option>
				</el-select>
	    	</template>
    		<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button @click="isshowuserType = false" round>取 消</el-button>
		            <el-button type="primary" @click="setUserType" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>
		<oms-custom-page
	        :dialog.sync="isshowUserPrivilege"
	        :title="dialogTitle"
	        width="30%"
	    >
	    	<template v-slot:content>

  				<el-tree
				  :data="treeData"
				  show-checkbox
				  default-expand-all
				  node-key="id"
				  ref="tree"
				  highlight-current

			    >
				</el-tree>
	    	</template>
    		<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button @click="isshowUserPrivilege = false" round>取 消</el-button>
		            <el-button type="primary" @click="setUserPrivileges" round
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>

	    <oms-custom-page
	        :dialog.sync="isshowExamType"
	        :title="dialogTitle"
	        width="30%"
	    >
			<template v-slot:content>
  				<el-checkbox-group   v-model="examType">
					<el-checkbox prop="examType"
					 v-for="item in allExamType"
					:key="item.key"
					:label="item.value"
					:value="item.key">

					</el-checkbox>
				</el-checkbox-group>
	    	</template>
	    	<template v-slot:footer>
		        <div class="btn-container">
		          <div class="btn-right">
		            <el-button @click="isshowExamType = false" round>取 消</el-button>
		            <el-button type="primary" @click="setUserExamType" round
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
		name:"UserRolePrivilege",
		data(){
			return {
				pageTitle:"用户权限配置",
				dialogTitle:"",
				isshowuserType:false,
				isshowUserPrivilege:false,
				isshowExamType:false,
				userId:"",
				roleSelectList:[
					{
			        	title : '角色类型',
			            type : 'select',
			            requestKey : 'userType',
			            label : 'text',
			            value : 'id',
			            data : [
			            	{
				              id: "-1",
				              text: "全部",
				            },
				            {
				              id: "1",
				              text: "管理员角色",
				            },
				            {
				              id: "2",
				              text: "教师角色",
				            }
			            ]
			        },
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
					userType:"-1",
					roleId: "-1"
				},
				requestParams : {
		          _search : false,
		          nd : new Date().getTime(),
		          rows: 30,
		          page: 1,
		          sidx: 'userName',
		          sord: 'asc'
		        },
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
			    		title:"角色类型",
			        	// width:"200",
			        	// align:"center",
			        	prop:"userType",
			        },
			        {
			    		title:"数据类型",
			        	// width:"200",
			        	// align:"center",
			        	prop:"examTypeName",
			        },
			        {
			    		title: "操作",
				        type: "buttons",
				        width: "400",
				        fixed: "right",
				        // align: "center",
				        butList: [
				        	{
				        		title: "设置角色",
				                size: "mini",
				                disabled: false,
				                onClick: this.editUserRole,
				        	},
				          	{
				        		title: "设置功能权限",
				                size: "mini",
				                disabled: false,
				                onClick: this.editUserPrivileges,
				        	},
				        	{
				        		title: "设置数据权限",
				                size: "mini",
				               	formatter : ({row : {userType}}) => {
					              if (userType == "教师角色") {
					                return true
					              } else {
					                return false
					              }
					            },
				                onClick: this.editUserExamType,
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
		        userType:[],
		        alluserTypes:[],
		        treeData:[],
		        checkNode:[],
		        examType:[],
		        allExamType:[],
		        examTypeId:[]
			}
		},
		methods:{
					editUserRole(row){
				this.dialogTitle ="设置用户角色"
				let data = {userId:row.row.userId}
				this.userId = row.row.userId
				this.$api.system.getRoleSelectJson(data).then(res => {
					if(res.status==1){
						this.alluserTypes = res.data
					}
				})
				this.$api.system.getUserRoleIds(data).then(res => {
					if(res.status == 1){
						this.userType = res.data
					}
				})
				this.isshowuserType = true;

				// console.log(row)
			},
			editUserPrivileges(row){
				console.log(row)
				let that = this
				let data = {userId:row.row.userId}
				this.userId = row.row.userId
				this.treeData = []
				this.$api.system.getUserPrivileges(data).then(res => {
					if(res.status==1){
						res.data.forEach(item => {
							that.treeData.push({
								id:item.id,
								label:item.label,
								children:item.children
							})
							if(item.children&&item.children.length>0){
								item.children.forEach(i=>{
									if(i.checked){
										that.checkNode.push(i.id)
									}
								})
							}
						})
                      that.$nextTick(() => {
                        // this.$refs.tree.setCheckedNodes(this.treeData)
                        that.$refs.tree.setCheckedKeys(this.checkNode)
                      })
					}

				})
				this.dialogTitle = "设置用户权限"
				this.isshowUserPrivilege = true
			},
			editUserExamType(row){
				console.log(row)
				this.userId = row.row.userId
				this.examType = []
				if(row.row.examTypeId){
					this.examTypeId = row.row.examTypeId.split(",")
				}


				this.$api.system.getAllExamTypePrivileges().then(res => {
					if(res.status == 1){
						this.allExamType = res.data
						this.allExamType.forEach((item,index) => {
		    				if(this.examTypeId .indexOf(String(item.key))!="-1"){
		    					this.examType.push(item.value)
		    				}else{
		    					// that.userForm.examType.push(false)
		    				}

	    				})
					}
				})
				this.dialogTitle = "设置数据权限"
				this.isshowExamType = true
			},
			search:function(){
				this.$set(this.requestParams,'page',1)
	        	this.getUserList()
	        	console.log("查询")
			},
			changePage(p){
				this.$set(this.requestParams,'page',p)
		        this.getUserList()
			},
			 // 每页多少条
			changeNum(pageSize) {
				this.requestParams.rows = pageSize
				this.getUserList()
			},
			getUserList(){
				let that = this
				let data = {
				   ...this.requestParams,
         		   ...this.queryJson,
				}
				that.$api.system.getUserRolePrivilegeList(data).then(res => {
					console.log(res)
					if(res.status==1){
						this.$set(this.pageOptions,'total',res.data.records)
						res.data.rows.forEach(item=>{

							item.userType = item.userType==1?"管理员角色":"教师角色"

						})
        				this.tableData = res.data.rows
					}
	        	})
			},
			//获取角色列表
			getRoleSelectJsonByRoleType(){
	        	let data = {"roleType": -1}
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
	        			that.$set(that.roleSelectList[1],'data',roleSelectList)
	        		}
	        	})
	        },
        	//设置用户角色
			setUserType(){
				let data = {
					userId : this.userId,
					roleIds : this.userType.join(",")
				}
				this.$api.system.setUserRole(data).then(res => {
					if(res.status==1){
						this.$message({
				            type: 'success',
				            message: '设置成功!'
			          	});
			          	this.isshowuserType = false
						this.getUserList()
					}
				})
			},
			//设置功能权限
			setUserPrivileges(){
				let that = this;
				let privilegeIds = that.$refs.tree.getCheckedKeys()
				let data = {
					userId: that.userId,
					privilegeIds: privilegeIds.join(",")
				}
				that.$api.system.setUserPrivilege(data).then(res => {
					if(res.status==1){
	        			that.$message({
				            type: 'success',
				            message: '操作成功!'
			          	});
	        			that.$data.isshowUserPrivilege = false
	        		}
				})
			},
			setUserExamType(){
				console.log(this.examType)
				let data = {
					userId:this.userId,
					examTypes:[]
				}
				this.allExamType.forEach((item,index) => {
    				if(this.examType.indexOf(item.value)!="-1"){
    					data.examTypes.push(item.key)
    				}else{
    					// that.userForm.examType.push(false)
    				}
    			})
    			data.examTypes =  data.examTypes.join(",");
    			this.$api.system.setUserExamTypePrivileges(data).then(res => {
    				if(res.status==1){
    					this.$message({
				            type: 'success',
				            message: '设置成功!'
			          	});
			          	this.isshowExamType = false
						this.getUserList()
    				}
    			})
			}
		},

		async mounted(){
			await this.getRoleSelectJsonByRoleType()
			this.getUserList()
		}

	}
</script>
<style lang="less" scoped>

</style>

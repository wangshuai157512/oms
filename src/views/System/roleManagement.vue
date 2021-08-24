<template>
	<div class="role-container">
		<oms-table
	       :title="pageTitle"
	       :functionalityBtn="functionalityBtnList"
	       :tableList="tableData"
	       :tableHeaderList="tableHeader"
	       :option="tableOption"
	    />
	    <oms-custom-page
	        :dialog.sync="eidtRoleVisible"
	        :title="dialogTitle"
	        width="30%"
	    >
	      	<template v-slot:content>
		       <el-form  label-position="top"  :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <el-form-item prop="roleName" label="角色名称">
                    	<el-input   placeholder="请输入角色名称" v-model="ruleForm.roleName" auto-complete="off"></el-input>

                    </el-form-item>
                    <el-form-item prop="roleId" v-show="false">
                    	<el-input v-model="ruleForm.roleId" ></el-input>

                    </el-form-item>
                    <el-form-item prop="memo" label="角色备注">
                        <el-input  placeholder="请输入角色备注"  v-model="ruleForm.memo" auto-complete="off"></el-input>
                   </el-form-item>
                   <el-form-item label="角色类型" prop="roleType">
					    <el-select v-model="ruleForm.roleType" :popperAppendToBody='false'>
					      <el-option label="管理员角色" value="1" key='管理员角色'></el-option>
					      <el-option label="教师角色" value="2" key='教师角色'></el-option>
					    </el-select>
				  </el-form-item>


                </el-form>
		    </template>
	      	<template v-slot:footer>
		        <div class="btn-container">

		          <div class="btn-right">
		            <el-button @click="cancleSubmit('ruleForm')" round>取 消</el-button>
		            <el-button round type="primary" @click="confirmSubmit('ruleForm')"
		            >确 定</el-button
		            >
		          </div>
		        </div>
		    </template>
	    </oms-custom-page>
	  	<oms-custom-page
			:dialog.sync="eidtJurVisible"
	        title="设置角色权限"
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
				  :value = "roleId"
			    >

				</el-tree>

  			</template>
	  		<template v-slot:footer>
		        <div class="btn-container">

		          <div class="btn-right">
		            <el-button @click="eidtJurVisible=false" round>取 消</el-button>
		            <el-button type="primary" @click="setJur" round>保存</el-button
		            >
		          </div>
		        </div>
		    </template>
	  	</oms-custom-page>




	</div>
</template>
<script>
	export default{
		name:'roleManagement',
		data(){
			return {
				pageTitle:"角色管理",
				dialogTitle:"新增角色",
				eidtRoleVisible:false,
				eidtJurVisible:false,
				roleId:"",
				ruleForm: {
		          roleName: '',
		          memo: '',
		          roleType:"",
		          roleId:"",
		          state:1
		        },
		         rules: {
                  roleName: [
                    {required: true, message: '请输入角色名称', trigger: 'blur' },

                  ],
                  memo: [
                    {required: true, message: '请输入角色备注', trigger: 'change' }
                  ],
                  roleType: [
                    // {required: true, message: '请选择角色类型', trigger: 'change' }
                  ],

                },
				functionalityBtnList:[
					{
			          title: "新增",
			          // size: " ",
			          plain:"plain",
			          size:"medium",
			          type: "primary",
			          disabled: false,
			          funClick: this.addRole,
			        },
				],
				tableHeader:[
					{
			    		title:"角色名称",
			        	// width:"200",
			        	// align:"center",
			        	prop:"name",
			        },
			        {
			    		title:"备注",
			        	// width:"200",
			        	// align:"center",
			        	prop:"memo",
			        },

			        {
			    		title:"角色类型",
			        	// width:"200",
			        	// align:"center",
			        	prop:"roleType",
			        },
			        {
			    		title: "操作",
				        type: "buttons",
				        // width: "150",
				        fixed: "right",
				        align: "center",
				        butList: [
				        	{
				        		title: "设置权限",
				                size: "mini",
				                disabled: false,
				                onClick: this.setJurisdiction,
				        	},
				            {
				              title: "编辑",
				              size: "mini",
				              disabled: false,
				              onClick: this.edit,
				            },
				            {
				              title: "删除",
				              size: "mini",
				              disabled: false,
				              onClick: this.del,
				            },
				        ],
			        },
				],
				tableData:[],
				tableOption: {
			        ismultiple: false,
			        isShowCustom : false
			    },
			    treeData:[

			    ],
			    checkNode:[],
			    defaultProps: {
		          children: 'children',
		          label: 'label'
		        }
			}
		},
		components:{
		},
		methods:{
			addRole:function(){
				this.$data.eidtRoleVisible = true
				this.$data.dialogTitle = "新增角色"
				this.ruleForm = {
		          roleName: '',
		          memo: '',
		          roleType:"",
		          roleId:"",
		          state:1
		        }
			},
			setJurisdiction:function(row){
				let that = this
				that.$data.eidtJurVisible = true
				let roleId = {roleId:row.row.roleId}
				that.$data.roleId = row.row.roleId
				this.$data.treeData = []
				that.$data.checkNode = []
				that.$api.system.getRolePrivileges(roleId).then(res => {
					if(res.status==1){

						res.data.forEach(item => {
							that.$data.treeData.push({
								id:item.id,
								label:item.label,
								children:item.children
							})
							if(item.children&&item.children.length>0){
								item.children.forEach(i=>{
									if(i.checked){
										that.$data.checkNode.push(i.id)
									}
								})
							}
						})
                      this.$nextTick(() => {
                        // this.$refs.tree.setCheckedNodes(this.treeData)
                        this.$refs.tree.setCheckedKeys(this.checkNode)
                      })

					}
				})

			},
			// setJuunction
			setJur(){
				let that = this;
				let privilegeIds = that.$refs.tree.getCheckedKeys()
				let data = {
					roleId: that.$data.roleId,
					privilegeIds: privilegeIds.join(",")
				}
				that.$api.system.setRolePrivilege(data).then(res => {
					if(res.status==1){
	        			that.$message({
				            type: 'success',
				            message: '操作成功!'
			          	});
	        			that.$data.eidtJurVisible = false
	        		}
				})
			},
			edit:function(row){
				console.log(row);
				this.$data.eidtRoleVisible = true
				this.$data.dialogTitle = "编辑角色"
				this.$data.ruleForm={
					roleName: row.row.name,
		          	memo: row.row.memo,
		          	roleType:row.row.roleType,
		          	state:1,
		          	roleId:row.row.roleId
				}
				// this.confirmChecked(ruleForm)
			},
			del:function(row){
				let that = this
				console.log(row)
				this.$confirm('确认删除当前角色?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          roundButton:true,
		          type: 'warning'
		        }).then(() => {
		        	let roleId = {roleId:row.row.roleId}
		        	console.log(1)
		        	that.$api.system.delRoleItem(roleId).then(res => {
		        		console.log(res)
		        		if(res.status==1){
		        			that.$message({
					            type: 'success',
					            message: '删除成功!'
				          	});
		        			that.getList()
		        		}

		        	})

		        }).catch(() => {

		        });


			},
			getList:function(){
				let data ={
					rows:50,
					page: 1,
					sidx: "roleId",
					sord: "desc",
					time:Math.random()
				}

				let that = this
				that.$data.tableData = []
				that.$api.system.getRoleList(data).then(res => {
					console.log(res)
					if(res.status==1){
						var json = res.data
						for(var i=0;i<json.rows.length;i++){
							that.$data.tableData.push({
								name:json.rows[i].roleName,
								memo:json.rows[i].memo,
								roleType:json.rows[i].roleType== 1 ? "管理员角色" : "教师角色",
								roleId:json.rows[i].roleId
							})
						}
					}
				})
			},
			confirmSubmit:function(formName){
				let that = this
				console.log(formName)
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                    	let data = that.$data.ruleForm
                    	data.roleType = data.roleType=="1"||data.roleType=="管理员角色"?1:2
                    	data.roleId = data.roleId==""?0:data.roleId
                        that.$api.system.submitForm(data).then(res =>{
                       		if(res.status==1){
                       			that.$notify.success({
						          message: res.message,
						          // type: 'success'
						        });
                       		}
                       		that.cancleSubmit(formName)
                       		that.$data.eidtRoleVisible = false
                       		that.getList()
                       })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
			},
			cancleSubmit:function(formName){
				this.$data.eidtRoleVisible = false
				this.ruleForm = {
		          roleName: '',
		          memo: '',
		          roleType:"",
		          roleId:"",
		          state:1
		        }
				this.$refs[formName].resetFields();

			}

		},
		mounted(){

			this.getList()
		}
	}
</script>
<style lang="less" scoped>
	.el-input{width:280px;}
	.el-select{width:280px;}
</style>

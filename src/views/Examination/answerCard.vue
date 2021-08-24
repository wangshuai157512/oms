<template>
	<div class="answerCard-container">
		 <oms-table-group
            :selectList="selectList"
            :functionality-btn="functionalityBtn"
            :request-form="requestForm"
            :tableHeaderList="tableHeader"
            :tableList="tableList"
            :paginationOptions="pageOptions"
            title="自定义答题卡"
            @search="getAnswerCardTemplateList"          
            @changePage="changePage"
            @changeNum="changeNum"
        />

        <oms-custom-page :dialog.sync="isAddCard" title="新增答题卡">
		    <template v-slot:content>
		    	<p class="title1">请选择考试类型</p>
		   		<el-radio v-model="examTypeId" label="1">课程考试</el-radio>
  				<el-radio v-model="examTypeId" label="2">测试考试类型</el-radio>
		    </template>
		    <template v-slot:footer>
	            <el-button @click="isAddCard = false" round>取消</el-button>
	            <el-button type="primary" round @click="toAddCard">确认</el-button>
	        </template>
		</oms-custom-page>
	</div>
	
</template>
<script>
	export default{
		name:"answerCard",
		data () {
			return {
				isAddCard:false,
				examTypeId:0,
				selectList:[								       
			        {
			            title: "考试类型",
			            type: "select",
			            isSearch: true,
			            requestKey: "examTypeId",
			            label: 'examTypeName',
			            value: 'examTypeId',
			            data: [
			             	{
				              	examTypeId : '-1',
				                examTypeName: '全部',
				              
			              	}
		              	]
			        },
			        {
			            title: "答题卡名称",
			            type: "input",			            
			            requestKey : 'templateName',
           				placeholder : '请输入答题卡名称'
			        },
			        
				],
				pageOptions: {
		          pageSize: 30,
		          total: 0
		        },
		        functionalityBtn: [
		          {
		            type: 'primary',
		            title: '新增答题卡',
		            plain: true,
		            size: 'small',
		            funClick: this.addCard
		          }
		        ],
		        tableHeader:[
		        	{
			            title: '模板名称',
			            prop: 'templateName',
			            
			        },
			        {
			        	title:'考试类型',
			        	prop:'examTypeName'
			        },
			        {
			        	title:"操作",
			        	type: "buttons",				     
				        butList: [
				        	{
				        		title: "预览",
				                size: "mini",
				                disabled: false,
				                onClick: this.previewCard,
				        	},
				        	{
				        		title: "编辑",
				                size: "mini",
				                disabled: false,
				                onClick: this.editCard,
				        	}
			        	]
			        }
		        ],
		        tableList:[],
		        requestForm: {		          
		          templateName: '',	
		          examTypeId:'-1',	         
		          rows: 30,
		          page: 1,
		          sidx: 'templateName',
		          sord: 'asc'
		        },
			}
		},
		methods:{
			getExamTypeList(){
				this.$api.basicData.getExamTypeList().then(res=>{
					if(res.status==1){
						res.data.forEach(item=>{
							this.selectList[0].data.push({
								examTypeId : item.examTypeId,
								examTypeName : item.examTypeName
				               
							})
						})
						
					}
					
				})
			},
			addCard(){
				this.isAddCard = true
			},
			toAddCard(){
				let {href} = this.$router.resolve({
					name: "answerSheetDIY",
					query: {
						examTypeId:this.examTypeId,
						templateId:0,
					}

				});
				this.isAddCard = false
				window.open(href,"_blank")
			},
			changePage(p) {
		        this.requestForm.page = p
		       	this.getAnswerCardTemplateList();
	      	},
	      	changeNum (n) {
		        this.requestForm.rows = n
		       	this.getAnswerCardTemplateList()
	      	},
	      	getAnswerCardTemplateList(){
	      		this.$api.examination.getAnswerCardTemplateList(this.requestForm).then(res=>{
	      			if(res.status==1){
	      				this.tableList = res.data.rows
	      				this.pageOptions.total = res.data.records
	      			}
	      			
	      		})
	      	},
	      	previewCard(row){

	      		this.$api.examination.previewAnswerCardTemplate({templateId:row.row.templateId}).then(res=>{
	      			if(res.status==1){
	      				window.open(res.data.fileName)
	      			}
	      			
	      		})
	      	},
			editCard(row){
				let {href} = this.$router.resolve({
					name: "answerSheetDIY",
					query: {
						templateId:row.row.templateId,
						examTypeId:row.row.examTypeId
					}

				});
				console.log(href)
				window.open(href,"_blank")
			},
		},
		mounted(){
			this.getExamTypeList()
			this.getAnswerCardTemplateList();
		}
	}
</script>
<style>
	.title1 {
	    font-size: 14px;
	    margin-bottom: 16px;
	    font-weight: 500;
	    color: #363940;
	}
</style>
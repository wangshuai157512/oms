<template>
	<div class="onlineReveiw">
		<oms-table-group
			:title="pageTitle"
			:functionality-btn="functionalityBtn"
            :selectList="paperSelect"
            :request-form="queryJson"
            :tableList="tableData"
            :tableHeaderList="tableHerder"
            :option="tableOption"
            :paginationOptions="pageOptions"
            @changePage="changePage"
			@changeNum="changeNum"
            @search="search"
        ></oms-table-group>
	</div>
</template>

<script>
	export default{
		name:"onlineReveiwStatistics",
		data(){
			return {
				pageTitle:"在线评阅查询",
				functionalityBtn:[],
				paperSelect:[
					{
			            title: "考试批次",
			            type: "select",
			            isSearch: true,
			            requestKey: "examId",
			            label: 'value',
			            value: 'key',
			            data: [],
			        },
			        {
			            title: "课程名称",
			            type: "select",
			            isSearch: true,
			            requestKey: "courseCode",
			            label: 'value',
			            value: 'key',
			            data: [],
			        },
			        {
			            title: "卷别",
			            type: "select",
			            isSearch: false,
			            requestKey: "paperType",
			            label: 'label',
			            value: 'value',
			            data: [
			              {
			                value: '-1',
			                label: "全部",
			              },
			              {
			                value: 'A',
			                label: "A",
			              },
			              {
			                value: "B",
			                label: "B",
			              },
			              {
			                value: "C",
			                label: "C",
			              },
			              {
			                value: "D",
			                label: "D",
			              },
			              {
			                value: "E",
			                label: "E",
			              },
			              {
			                value: "F",
			                label: "F",
			              }
			            ],
			        },
		            {
			            title: "批次",
			            type: "select",
			            isSearch: true,
			            requestKey: "batchId",
			            label: 'value',
			            value: 'key',
			            data: [],
		            },
		            {
			            title: "层次",
			            type: "select",
			            isSearch: true,
			            requestKey: "levelId",
			            label: 'value',
			            value: 'key',
			            data: [],
		            },
		            {
			            title: "专业",
			            type: "select",
			            isSearch: true,
			            requestKey: "subjectId",
			            label: 'value',
			            value: 'key',
			            data: [],
		            },
		            {
			            title: "学习中心",
			            type: "select",
			            isSearch: true,
			            requestKey: "stationId",
			            label: 'value',
			            value: 'key',
			            data: [],
		            },
		            {
			            title : '评阅标记',
			            type : 'select',
			            requestKey : 'markType',
			            label : 'text',
			            value : 'id',
			            data : [
			            	{
				              id: "-1",
				              text: "全部",
				            },
				            {
				              id: "1",
				              text: "有",
				            },
				            {
				              id: "0",
				              text: "无",
				            },
				            {
				              id: "2",
				              text: "答案雷同",
				            },
				            {
				              id: "3",
				              text: "笔迹雷同",
				            },
				            {
				              id: "4",
				              text: "多种笔迹",
				            },
				            {
				              id: "5",
				              text: "作答与考题不符",
				            },
				            {
				              id: "6",
				              text: "其它",
				            },
			            ]
		            },
		            {
		          	 	title : '开始时间',
			            type : 'data',
			            requestKey : 'judgeStartTime',
			            val:"",

			        },
			        {
		          	 	title : '结束时间',
			            type : 'data',
			            requestKey : 'judgeEndTime',
			            val:"",

			        },
		            {
		          	 	title : '学生信息',
			            type : 'input',
			            requestKey : 'studentInfo',
			            val:"",
            			placeholder : '请输入学生信息'
			        },

				],
				queryJson:{
					examId:0,
		          	courseCode:-1,
		          	paperType: "-1",
		          	batchId:-1,
		          	levelId:-1,
		          	subjectId:-1,
		          	stationId:-1,
		          	markType:"-1",
		          	judgeStartTime:"",
		          	judgeEndTime:"",
		          	studentInfo:"",
		          	rows: 30,
		          	page: 1,
		          	sidx: 'paperId',
		          	sord: 'asc'
				},
				tableData:[],
				tableHerder: [
		          {
		            title: '考试批次',
		            prop: 'examName',
		            sortable: 'custom'
		          },
		          {
		            title: '课程名称',
		            prop: 'courseName',
		            sortable: 'custom'
		          },
		          {
		            title: '卷别',
		            prop: 'paperType',
		            sortable: 'custom'
		          },
		          {
		            title: '教师评阅时间',
		            prop: 'markDate',
		            sortable: 'custom'
		          },
		          {
		            title: '主观分',
		            prop: 'subjectiveScore',
		            sortable: 'custom'
		          },
		          {
		            title: '客观分',
		            prop: 'objectiveScore',
		            sortable: 'custom'
		          },
		          {
		            title: '总分',
		            prop: 'score',
		            sortable: 'custom'
		          },
		          {
		            title: '考生学号',
		            prop: 'studentId',
		            sortable: 'custom'
		          },
		          {
		            title: '考生姓名',
		            prop: 'studentName',
		            sortable: 'custom'
		          },
		          {
		            title: '考生批次',
		            prop: 'batchName',
		            sortable: 'custom'
		          },
		          {
		            title: '考生层次',
		            prop: 'levelName',
		            sortable: 'custom'
		          },
		          {
		            title: '考生专业',
		            prop: 'subjectName',
		            sortable: 'custom'
		          },
		          {
		            title: '学习中心',
		            prop: 'stationName',
		            sortable: 'custom'
		          },
		          {
		            title: '评阅标记',
		            prop: 'setType',
		            sortable: 'custom'
		          },
		          {
		          	title: '操作',
		            fixed: 'right',
		            width: '100',
		            show: true,
		            type: "buttons",
		            fixedPos: 'right',
		            butList: [

		            ],
		          }
		        ],
		        tableOption:{
		        	ismultiple : false,
		        },
		        pageOptions:{
		        	page : 1,
		          	total : 0,
		          	pageSize : 30
		        },
			}
		},
		methods:{
			changePage(p){
				this.$set(this.queryJson,'page',p)
		        this.search()
			},
			changeNum (n) {
		        this.queryJson.rows = n
		        this.search()
	      	},
			//考试批次
		    async getUserMarkSetExamPlan() {
		    	let that = this
		        let {data} = await this.$api.reviewManage.getUserMarkSetExamPlan()
		        that.$set(that.paperSelect[0], 'data', data)
		        that.queryJson.examId = data[0].key
		        that.getUserExamCourse()
		    	that.getUserExamBatch()
		    	that.getUserExamLevel()
			  	that.getUserExamSubject()
			  	that.getUserExamStation()

		    },
		    examIdChange(){
		    	 this.queryJson = {
		          ...this.queryJson,
		         	courseCode:-1,
		          	paperType: "-1",
		          	batchId:-1,
		          	levelId:-1,
		          	subjectId:-1,
		          	stationId:-1,
		          	markType:"-1",
		        }
		        this.getUserExamCourse()
		        this.getUserExamBatch()
		        this.getUserExamLevel()
		        this.getUserExamSubject()
		        this.getUserExamStation()

		    },
		    getUserExamCourse(){
		    	this.$api.reviewManage.getUserExamCourse({examId:this.queryJson.examId}).then(res=>{
		    		let newList = [
				          {
				            key : '-1',
				            value : '全部'
				          },
				          ...res.data
			        ]
		    		this.$set(this.paperSelect[1], 'data',newList)
		            this.queryJson.courseCode = newList[0].key
		    	})

		    },
		    getUserExamBatch(){
		    	this.$api.reviewManage.getUserExamBatch({examId:this.queryJson.examId}).then(res=>{
		    		let newList = [
				          {
				            key : '-1',
				            value : '全部'
				          },
				          ...res.data
			        ]
		    		this.$set(this.paperSelect[3], 'data',newList)
		            this.queryJson.batchId = newList[0].key
		    	})

		    	// this.$set(this.paperSelect[2], 'data', data)
		     //    this.queryJson.courseCode = data[0].courseCode
		    },
		    getUserExamLevel(){
		    	this.$api.reviewManage.getUserExamLevel({examId:this.queryJson.examId}).then(res => {
		    		console.log(res)
		    		let newList = [
				          {
				            key : '-1',
				            value : '全部'
				          },
				          ...res.data
			        ]
		    		this.$set(this.paperSelect[4], 'data', newList)
		        	this.queryJson.levelId = newList[0].key
		    	})

		    },
		    getUserExamSubject(){
		    	this.$api.reviewManage.getUserExamSubject({examId:this.queryJson.examId}).then(res => {
		    		let newList = [
				          {
				            key : '-1',
				            value : '全部'
				          },
				          ...res.data
			        ]
		    		this.$set(this.paperSelect[5], 'data', newList)
		        	this.queryJson.subjectId = newList[0].key
		    	})

		    },
		    getUserExamStation(){
		    	this.$api.reviewManage.getUserExamStation({examId:this.queryJson.examId}).then(res => {
		    		let newList = [
				          {
				            key : '-1',
				            value : '全部'
				          },
				          ...res.data
			        ]
		    		this.$set(this.paperSelect[6], 'data', newList)
		        	this.queryJson.stationId = newList[0].key
		    	})

		    },
			search(){
				let data = {
			    	...this.queryJson, 
				}
				this.$api.reviewManage.getOnlineReviewStatisticsGrid(data).then(res => {
					console.log(res)
					if(res.status==1){
						this.$set(this.pageOptions,'total',res.data.records)
						res.data.rows.forEach(item => {
							if(item.setType==1){
								item.setType = "答案雷同"
							}else if(item.setType==2){
								item.setType = "笔迹雷同"
							}else if(item.setType==3){
								item.setType = "多种笔迹"
							}else if(item.setType==4){
								item.setType = "作答与考题不符"
							}else if(item.setType==5){
								item.setType = "其他"
							}else{
								item.setType = ""
							}
							item.butList = [{
								title:"查看",
								onClick:this.toViewPaper
							}]
							if(item.paperState==2){
								item.butList = [{
					        		title: "评阅",
					                onClick: this.toReview
					        	}]
							}
							if(item.reJudge==1){
								let isInTime = item.judgeStartTime==null|| new Date(item.judgeStartTime.replace("-", "/").replace("-", "/")) < new Date() && item.judgeEndTime == null || new Data(item.judgeEndTime.replace("-", "/").replace("-", "/")> new Date())
								if(isInTime && item.qualityState!=1 && item.qualityState!=2){
									item.butList = [{
						        		title: "评阅",
						                onClick: this.toReview
						        	}]
								}
							}
						})
						this.tableData = res.data.rows
					}
				})
			},
			toReview(row){
				let {href} = this.$router.resolve({
					name: "onlineReview",
					query: {
						examId:row.row.examId,
						courseCode:row.row.courseCode,
						paperID:row.row.paperId,
						paperType:row.row.paperType,
						examBarCode:row.row.examBarCode,
						key:"0"
					}

				});

				 window.open(href,"_blank")

			},
		    toViewPaper(row){
		    	let {href} = this.$router.resolve({
					name: "Detail",
					query: {
						ExamID:row.row.examId,
						CourseCode:row.row.courseCode,
						PaperID:row.row.paperId,
						ExamBarCode:row.row.examBarCode,
						paperType:row.row.paperType
					}

				});

				 window.open(href,"_blank")
		    },

		},
		async mounted(){
	    	await this.getUserMarkSetExamPlan()

	    },
	    watch : {
	      'queryJson.examId' : {
	        handler: 'examIdChange'
	      },

	    }
	}
</script>

<style>

</style>

<template>
	<div class="paperAnalysis-container">
		<oms-table-group
            title="试卷分析"
            :selectList="teaSelectList"
            :request-form="queryJson"
            :functionalityBtn="functionalityBtnList"
            :tableList="tableData"
            :tableHeaderList="tableHerder"
            :option="tableOption"
            :paginationOptions="pageOptions"
            @search="getList"
            @changePage="changePage"
            @sortChange="sortChange"
            @changeNum="changeNum"
         	:showChart="showChart"
        >
		  <template v-slot:chart>
		        <div class="charts-container" ref="chartsContainer">
	          
	                <div class="histogram-charts charts-item" ref="rate"></div>

		        </div>
		        
		    </template>
        </oms-table-group>
		
	</div>

</template>
<script>
	export default {
		name: 'paperAnalysis',
    	components: {},
    	data(){
    		return {   	
    			showChart:true,		
    			paperId:"",
			 	requestParams : {
		         	_search : false,
		         	nd : new Date().getTime(),
		         	rows: 30,
		         	page: 1,
		         	sidx: 'courseName',
		         	sord: 'asc'
		        },
		        queryJson : {
		          examId : '',
		          courseCode : '',
		          paperType : '',
		        },
		        teaSelectList: [
		          {
		            title: "考试批次",
		            type: "select",
		            isSearch: true,
		            requestKey: "examId",
		            label : 'examName',
		            value : 'examId',
		            data: [],
		          },
		          {
		            title: "课程名称",
		            type: "select",
		            requestKey: "courseCode",
		            label : 'courseName',
		            value : 'courseCode',
		            data: []
		          },
		          {
		            title: "卷别",
		            type: "select",
		            requestKey: "paperType",
		            label : 'paperType',
		            value : 'paperId',
		            data: []
		          },

       			],
       			functionalityBtnList: [
		            {
			          title:()=> {
			            return this.showChart?'显示图表统计':'显示查询明细'
			          },
			          type:'text',
			          disabled:this.isDisable,
			          funClick:()=> {
			            this.showChart = !this.showChart
			            if(!this.showChart) {
			              this.$nextTick(this.initCharts);
			            }

			          }
			        },
		          	{
			            title: "导出试卷分析",
			            funClick: this.handleExport,
			            disabled : this.isDisableFun
		          	}
		        ],
		        tableOption: {
		          ismultiple: false,
		          isShowCustom: true,
		        },
		        tableHerder: [
		        	{
			          title:"题目类型",
			          sortable : 'custom',
			          prop:"questionType"
			        },
			        {
			          title:"大题号",
			          sortable : 'custom',
			          prop:"structureId"
			        },
			        {
			          title:"小题号",
			          sortable : 'custom',
			          prop:"questionId"
			        },
			        {
			          title:"子题号",
			          sortable : 'custom',
			          prop:"subQuestionId"
			        },
			        {
			          title:"分数",
			          sortable : 'custom',
			          prop:"score"
			        },
			        {
			          title:"正确率/得分率(%)",
			          sortable : 'custom',
			          prop:"scoreRate"
			        },
                ],
		        tableData: [],
		        pageOptions: {
		          small: false,
		          pageSize: 30,
		          total: 0,
		          currentPage: 1,
		          pageSizes: [20, 40, 60],
		        },
		        resultData:[]
    		}
    	},
    	methods:{
    		//获取考试批次
    		getExamBatch () {
		        this.$api.teacher.getTestPlan().then(res =>{
	                this.teaSelectList[0].data = res.data
	                if(res.data.length > 0) {
	                    this.queryJson.examId = res.data[0].examId
	                    this.getExamCourseCode();
	                }
	                
	            })
	      	},
	      	//获取课程
	      	getExamCourseCode(){
	      		this.$api.inquiryStatistics.getExamCourseList({examId:this.queryJson.examId}).then(res =>{
	      			console.log(res)
	      			res.data.forEach(item=>{

	      			})
          			this.$set(this.teaSelectList[1],'data',res.data)
          			if(res.data.length > 0) {
	                    this.queryJson.courseCode = res.data[0].courseCode
	                    this.getPaperType()
	                }
	                
	            })
	      	},
	      	//获取卷别
	      	getPaperType(){
	      		this.$api.inquiryStatistics.getPaperTypeList({
	      			examId:this.queryJson.examId,
	      			courseCode:this.queryJson.courseCode
	      		}).then(res =>{
	      			console.log(res)
          			this.$set(this.teaSelectList[2],'data',res.data)
          			if(res.data.length > 0) {
	                    this.queryJson.paperType = res.data[0].paperType
	                }
	                this.paperId = res.data[0].paperId
	                this.getList()
	            })

	      	},
    		//获取表头
    		
    		getList(){
    			
    			this.$api.inquiryStatistics.getPaperAnalysis({
    				...this.requestParams,
          			paperId:this.paperId,
    			}).then(res=>{
    				console.log(res)
    				this.pageOptions = {
			            ...this.pageOptions,
			            total : res.data.records
			        }
			        res.data.rows.forEach(item=>{
			        	item.questionType = item.questionType == 1 ? "客观题" : "主观题"		
			        	item.scoreRate = item.scoreRate ? item.scoreRate.toFixed(1) : "0.0"
			        })
    				this.tableData = res.data.rows
    			})
    			this.getPaperAnalysisChartData()
    		},
    		getPaperAnalysisChartData(){
    			this.$api.inquiryStatistics.getPaperAnalysisChartData({paperId:this.paperId}).then(res=>{
    				this.resultData = res.data
    				this.initCharts()
   			 	})
    		},
    		initCharts(){			 	
   			 	let rateX = []
   			 	let rateY = []
   			 	this.resultData.forEach(item=>{
		 			rateX.push(item.title)
		 			rateY.push(item.count)
		 		})
			 	this.rate = this.$echarts.init(this.$refs.rate)
       			let rate_option = {
       				title: {
		                text: '得分率'
		            },
       			 	xAxis : {
			            type : "value"
		          	},
		          	yAxis : {
	          		 	type : 'category',
			            data : rateX			           
		          	},
		          	series : [
			            {
			                data: rateY,
			                type: 'bar',
			                barWidth : 24,
			                label: {
			                	formatter : '{c}%',
				                show: true,
				                position: 'insideRight',
				                color:"#fff"

		            		},
			                itemStyle : {
				                normal : {
				                  color : (item) => {
				                    const COLOR_STYLE = [
			                    		[ 
					                        {
					                          offset : 0,
					                          color : '#5050E6'
					                        },
					                        {
					                          offset : 1,
					                          color : '#2B48D9'
					                        }
					                      ],
					                      [ 
					                        {
					                          offset : 0,
					                          color : '#01BBCC'
					                        },
					                        {
					                          offset : 1,
					                          color : '#1698D9'
					                        }
					                      ],
					                      [ 
					                        {
					                          offset : 0,
					                          color : '#6B2EE6'
					                        },
					                        {
					                          offset : 1,
					                          color : '#460ABF'
					                        }
					                      ],
					                      [
				                        {
				                          offset : 0,
				                          color : '#5975FF'
				                        },
				                        {
				                          offset : 1,
				                          color : '#2C4FFF'
				                        }
				                      ],
				                        [
				                        {
				                          offset : 0,
				                          color : '#0060C0'
				                        },
				                        {
				                          offset : 1,
				                          color : '#004D99'
				                        }
				                      ],
				                     [
				                        {
				                          offset : 0,
				                          color : '#F28213'
				                        },
				                        {
				                          offset : 1,
				                          color : '#D96500'
				                        }
				                      ],
				                     [
				                        {
				                          offset : 0,
				                          color : '#3BA8FF'
				                        },
				                        {
				                          offset : 1,
				                          color : '#5C8EE6'
				                        }
				                      ],				                    
					                      [ 
					                        {
					                          offset : 0,
					                          color : '#09B195'
					                        },
					                        {
					                          offset : 1,
					                          color : '#13C2C2'
					                        }
					                      ],
				                      [ 
				                        {
				                          offset : 0,
				                          color : '#4595E6'
				                        },
				                        {
				                          offset : 1,
				                          color : '#5CA3E6'
				                        }
				                      ],
				                      [
				                        {
				                          offset : 0,
				                          color : '#5050E6'
				                        },
				                        {
				                          offset : 1,
				                          color : '#2B48D9'
				                        }
				                      ],
		                    		
				                  
				                    ]

				                    if (item.dataIndex >= COLOR_STYLE.length) {
				                    	
			                            item.dataIndex = item.dataIndex % COLOR_STYLE.length;

			                        }
				                    return new this.$echarts.graphic.LinearGradient(0,0,0,1,COLOR_STYLE[item.dataIndex])
			                      	// return COLOR_STYLE[item.dataIndex]
				                  }
				                }
			              	}
			            }
		          	]
       			}
       			this.autoHeight = rateY.length * 40 + 20; 
       			if(this.autoHeight>600){
       				this.rate.getDom().style.height = this.autoHeight + "px";
       			}
       			

	  			this.rate.setOption(rate_option)
	  			this.rate.resize();
	  			
			},
    		async handleExport () {

		        let { data, status } = await this.$api.inquiryStatistics.exportPaperAnalysis({paperId:this.paperId})
		        if (status === 1) {
		          window.open(data.fileName)
		        }
	      	},
	      
    		changePage(p) {
		        this.requestParams.page = p
		        this.getList()
	      	},
	      	changeNum (n) {
		        this.requestParams.rows = n
		        this.getList()
	      	},
	      	sortChange ({prop,order}) {
              this.tableSort(this.requestParams,order,prop,'examBarCode')
              this.getList()
	      	},
	      	listenWinResize(){
	      		window.addEventListener('resize', this.$tools.debounce(() => {
		            this.rate.resize()
			  		
		        },200))
		        this.$once('hook:beforeDestroy',() => {
		          window.removeEventListener('resize',() => {})
		        })
	      		
	      	}
	      	
    	},
    	mounted() {
	      this.getExamBatch()	 
	      this.listenWinResize()    	      
	    },
	    watch : {
	      'queryJson.examId' : {
	        handler: 'getExamCourseCode'
	      },
	      'queryJson.courseCode' : {
	      	handler : 'getPaperType'
	      }
	    }
	}
</script>
<style lang="less" scoped>
	.charts-container {
        min-height:600px;
       
        display: flex;       
        .charts-item {
            height: 600px;
            width:100%;
        }
    }
	
</style>

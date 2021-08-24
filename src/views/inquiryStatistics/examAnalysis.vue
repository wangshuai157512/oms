<template>
	<div class="examAnalysis-container">
		<oms-table-group
            title="考试分析"
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
	          
	                <div class="histogram-charts charts-item" ref="examNum"></div>
	           
	                <div class="histogram-charts charts-item" ref="miss"></div>
		            
		        </div>
		         <div class="charts-container" ref="chartsContainer">
		         	<div class="charts-item" style="width:100%" ref="score"></div>
		         </div>
		    </template>
        </oms-table-group>
		<oms-custom-page
            :dialog.sync="valueRule"
            title="取值规则"
           
        >
            <template v-slot:content>
				<div class="rule">
					<div class="passline" style="margin-bottom:32px;">
						<p class="dialog-title mb16">及格分数</p>
					  	<el-input size="mini" v-model.number="valueRuleForm.passLine"></el-input>
					  	<span>%*总分</span>
			
					</div>
					
					<p class="dialog-title mb16 ">成绩分配<span style="color:#999">导出时统计，分数段设置为[x,y)，即x≤分数段＜y。</span></p>
					<div v-for="item in valueRuleForm.ruleValues" class="mb16 pl16">
						<span>分数段{{item.index}}</span>
						<el-input  size="mini" v-model.number="item.min"></el-input>
						<span>分 -</span>
						<el-input  size="mini" v-model.number="item.max"></el-input>
						<span>分</span>
						<el-button v-if="item.index!=1" type="danger"  sizi="mini" @click="removeArea(item.index)">-</el-button>	
					</div>
					<el-button type="primary" plain @click="addArea">添加分数段</el-button>
				</div>
                
            </template>
            <template v-slot:footer>
                <el-button @click="valueRule = false" round>关闭</el-button>
                <el-button type="primary" round @click="saveRule">确认</el-button>
            </template>
        </oms-custom-page>
	</div>

</template>
<script>
	export default {
		name: 'examAnalysis',
    	components: {},
    	data(){
    		return {
    			valueRule:false,
    			showChart:true,
    			resultData:[],
    			valueRuleForm:{
    				passLine:0,
    				ruleValues:[
    					{
    						min:0,
    						max:60,
    						index:1
    					}
    				]
    			},
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
		            label : 'value',
		            value : 'key',
		            data: [
		              {
		                key : '-1',
		                value : '全部'
		              },
		              {
		                key : 'A',
		                value : 'A'
		              },
		              {
		                key : 'B',
		                value : 'B'
		              },
		              {
		                key : 'C',
		                value : 'C'
		              },
		              {
		                key : 'D',
		                value : 'D'
		              },
		              {
		                key : 'E',
		                value : 'E'
		              },
		              {
		                key : 'F',
		                value : 'F'
		              },
		            ]
		          },

       			],
       			functionalityBtnList: [
		          {
		            title: "取值规则",
		            funClick:this.getRule,

		          },
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
		            title: "导出考试分析",
		            funClick: this.handleExport,
		            disabled : this.isDisableFun,
		          }
		        ],
		        tableOption: {
		          ismultiple: false,
		          isShowCustom: true,
		        },
		        tableHerder: [

                ],
		        tableData: [],
		        pageOptions: {
		          small: false,
		          pageSize: 30,
		          total: 0,
		          currentPage: 1,
		          pageSizes: [20, 40, 60],
		        },
    		}
    	},
    	methods:{
    		//获取考试批次
    		getExamBatch () {
		        this.$api.teacher.getTestPlan().then(res =>{
	                this.teaSelectList[0].data = res.data
	                if(res.data.length > 0) {
	                    this.queryJson.examId = res.data[0].examId
	                }
	                this.getList();
	            })
	      	},
	      	//获取课程
	      	getExamCourseCode(){
	      		this.$api.teacher.getCourseList().then(res =>{
	      			 let newList = [
			            {
			              courseCode : '',
			              courseName : '全部'
			            },
			            ...res.data
			          ]
          			this.$set(this.teaSelectList[1],'data',newList)

	            })
	      	},
    		//获取表头
    		getTableHeader(){
    			this.$api.inquiryStatistics.getViolateType().then(res=>{
    				let header = []
    				this.tableHerder = [
    					{
				          title:"课程",
				          sortable : 'custom',
				          prop:"courseName"
				        },
				        {
				          title:"卷别",
				          prop:"paperType"
				        },
				        {
				          title:"应考人数",
				          sortable : 'custom',
				          prop:"allCount"
				        },
				        {
				          title:"实考人数",
				          sortable : 'custom',
				          prop:"actually"
				        }
    				]
    				res.data.violateType.forEach(item => {
    					header.push({title:item.value,prop:item.key,sortable:'custom'})

    				})
    				res.data.ruleValue.forEach(item => {
    					header.push({
                          title:item.min +"-"+item.max,
                          prop:"scoreCount" + item.index,
                          sortable:'custom',
                          isFilter : true
    					})
    				})

    				this.tableHerder = [...this.tableHerder,...header]
    			})

    		},
    		getList(){
    			this.getTableHeader();
    			this.$api.inquiryStatistics.getExamAnalysis({
    				...this.requestParams,
          			...this.queryJson
    			}).then(res=>{
    				console.log(res)
    				this.pageOptions = {
			            ...this.pageOptions,
			            total : res.data.records
			        }

    				this.tableData = res.data.rows
    				this.getExamAnalysisTotal();
    			})

    		},
    		//获取统计数据
    		getExamAnalysisTotal(){
    			this.$api.inquiryStatistics.getExamAnalysisTotal(this.queryJson).then(res=>{
    				this.resultData = res.data
   			 		this.initCharts()
	   			 	
   			 	})
    		},
    		initCharts(){
			 	let examNumY = [this.resultData.actuallyStatic.allCount,this.resultData.actuallyStatic.actually]
			 	let missData = this.resultData.violateType
   			 	let missY = [missData.miss,missData.violate,missData.displace,missData.cheat,	missData.otherviolate,missData.severelyviolate]
   			 	let scoreX = []
   			 	let scoreY = []
   			 	this.resultData.ruleValue.forEach(item=>{
		 			scoreX.push(item.title)
		 			scoreY.push(item.count)
		 		})
			 	this.examNum = this.$echarts.init(this.$refs.examNum)
   			 	this.miss = this.$echarts.init(this.$refs.miss)
   			 	this.score = this.$echarts.init(this.$refs.score)   		
   			 	
   			 	let examNum_option = {
   			 		 title: {
		                text: '考试人数'
		            },
       			 	xAxis : {
			            type : 'category',
			            data : ['应考人数','实考人数']
		          	},
		          	yAxis : {
			            type : 'value'
		          	},
		          	series : [
			            {
			              data:examNumY,
			              type: 'bar',
			              barWidth : 40,
			              label: {
				                show: true,
				                position: 'insideTop',
				                color:"#fff"
			            	},
			              itemStyle : {

			                normal : {
			                  color : (item) => {
			                    const COLOR_STYLE = [
			                      [
			                        {
			                          offset : 0,
			                          color : '#1FCCAF'
			                        },
			                        {
			                          offset : 1,
			                          color : '#16B8D9'
			                        }
			                      ],
			                      [
			                        {
			                          offset : 0,
			                          color : '#4552E6'
			                        },
			                        {
			                          offset : 1,
			                          color : '#9130F2'
			                        }
			                      ],
			                    
			                    ]
			                    return new this.$echarts.graphic.LinearGradient(0,0,0,1,COLOR_STYLE[item.dataIndex])
			                  }
			                }
			              }
			            }
		          	]
   			 	}
   			 	let miss_option = {
   			 		title: {
		                text: '异常情况'
		            },
       			 	xAxis : {
			            type : 'category',
			            data : ['缺考','违纪',"替考","作弊","其他违纪","严重违纪"]
		          	},
		          	yAxis : {
			            type : "value"
		          	},
		          	series : [
			            {
			                data: missY,
			                type: 'bar',
			                barWidth : 40,
			                label: {
				                show: true,
				                position: 'insideTop',
				                color:"#fff"
		            		},
			                itemStyle : {
				                normal : {
				                  color : (item) => {
				                    const COLOR_STYLE = [
				                      [
				                        {
				                          offset : 0,
				                          color : '#1FCCAF'
				                        },
				                        {
				                          offset : 1,
				                          color : '#16B8D9'
				                        }
				                      ],
				                      [
				                        {
				                          offset : 0,
				                          color : '#4552E6'
				                        },
				                        {
				                          offset : 1,
				                          color : '#9130F2'
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
				                    
				                    ]
				                    return new this.$echarts.graphic.LinearGradient(0,0,0,1,COLOR_STYLE[item.dataIndex])
				                  }
				                }
			              }
			            }
		          	]
       			 }
       			 let score_option = {
       			 	title: {
		                text: '成绩分布统计'
		            },
       			 	xAxis : {
			            type : "value"
		          	},
		          	yAxis : {
	          		 	type : 'category',
			            data : scoreX			           
		          	},
		          	series : [
			            {
			                data: scoreY,
			                type: 'bar',
			                barWidth : 40,
			                label: {
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
				                          color : '#1FCCAF'
				                        },
				                        {
				                          offset : 1,
				                          color : '#16B8D9'
				                        }
				                      ],
				                      [
				                        {
				                          offset : 0,
				                          color : '#4552E6'
				                        },
				                        {
				                          offset : 1,
				                          color : '#9130F2'
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
				                    
				                    ]
				                    return new this.$echarts.graphic.LinearGradient(0,0,0,1,COLOR_STYLE[item.dataIndex])
				                  }
				                }
			              }
			            }
		          	]
       			 }
       			
	  			this.examNum.setOption(examNum_option)
		  		this.miss.setOption(miss_option)
		  		this.score.setOption(score_option)
		  		
    		},
    		//获取规则
    		getRule(){
    			this.valueRule = true
    			this.$api.inquiryStatistics.getExamAnalysisField().then(res=>{
    				if(res.status==1){
    					this.valueRuleForm.passLine = res.data.passLine,
    					this.valueRuleForm.ruleValues = res.data.ruleValues
    				}
    			})

    		},
    		saveRule(){
    			this.$api.inquiryStatistics.setExamAnalysisField(this.valueRuleForm).then(res=>{
    				if(res.status==1){
    					 this.$message.success('操作成功')
    					 this.valueRule = false
    				}
    			})
    		},
    		addArea(){
    			this.valueRuleForm.ruleValues.push({min:"",max:"",index:this.valueRuleForm.ruleValues.length+1})
    		},
    		removeArea(index){
    			console.log(index);
    			this.valueRuleForm.ruleValues.forEach(item=>{
    				if(item.index==index){
    					this.valueRuleForm.ruleValues.splice(index-1,1)
    				}
    			})
    			this.valueRuleForm.ruleValues.forEach((item,i)=>{
    				item.index = i+1
    			})
    			
    		},
    		async handleExport () {
		        let { data, status } = await this.$api.inquiryStatistics.exportExamAnalysis(this.queryJson)
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
		            this.examNum.resize()
			  		this.miss.resize()
			  		this.score.resize()
		        },200))
		        this.$once('hook:beforeDestroy',() => {
		          window.removeEventListener('resize',() => {})
		        })
	      		
	      	}
    	},
    	mounted() {
	      this.getExamBatch()
	      this.getExamCourseCode()
	      this.listenWinResize()
	      // this.getTableHeader()
	      // this.getList()

	    },
	}
</script>
<style lang="less" scoped>
	.rule {
		.el-input{
			width:50px !important;		
			margin:0 20px;
			/deep/ .el-input__inner{
				padding:0 !important;
				text-align:center;
			}

		}
		.pl16{
			padding-left:16px;
		}
		.el-button {
			padding:2px 4px !important;
			min-width: 20px!important;
			margin-left:20px;
		}
	}
	.charts-container {
        height: 400px;
        display: flex;       
        .charts-item {
            height: 100%;
            width:50%
        }
    }
	
</style>

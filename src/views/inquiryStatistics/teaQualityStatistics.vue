<template>
  <div>
    <oms-table-group
      :selectList.sync="teaSelectList" @search="search"
      :title="pageTitle"
      :request-form='requestForm'
      :functionalityBtn="functionalityBtnList"
      :tableList="tableData"
      :tableHeaderList="tableHerder"
      :option="tableOption"
      :paginationOptions="pageOptions"
       @changePage="changePage"
       @changeNum="changeNum"
       @sortChange="sortChange"
       :showChart="showChart"
    >
    <template v-slot:chart>
        <div class="charts-container" ref="chartsContainer">
            <div class="histogram-charts-container">
                <div class="histogram-charts charts-item" ref="histogramChart"></div>
            </div>
            <div class="pie-charts-container">
                <div class="pie-charts charts-item" ref="pieCharts"></div>
            </div>
        </div>
    </template>
    </oms-table-group>
  </div>
</template>

<script>
export default {
  name: "teaQualityStatistics",
  components: {

  },
  data() {
    return {
      pageTitle:'',
      showChart:true,
      requestForm : {
        page:1,
        rows:30, //每页条数
        sord:"asc",
        sidx:"examId", // 排序字段
        examId:null,
        courseId:-1, //课程Id
        paperType:'', //卷别
        userInfo:"", //教师信息
      },
      teaSelectList: [
        {
          title: "考试批次",
          type: "select",
          isSearch: true,
          requestKey: "examId",
          label:"examName",
          value: "examId",
          data: [

          ],
          change:()=> {
            this.getExamCourseCode()
          },
        },
        {
          title: "课程名称",
          type: "select",
          isSearch: true,
          requestKey: "courseId",
          label:"value",
          value: "key",
          data: [
              {
                key: -1,
                value: "全部",
              },
          ],
        },
        {
          title : '卷别',
          type : 'select',
          requestKey: "paperType",
          label: 'label',
          value: 'value',
          data: [
            {
              value: '',
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
          ]
        },
        {
          title : '教师信息',
          type : 'input',
          requestKey : 'userInfo',
          placeholder : '请输入教师信息'
        }
      ],
      functionalityBtnList:[
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
          title:"导出查询明细",
          // disabled: this.isDisable && this.disableChartBtn,
          disabled : this.isDisableFun,
          funClick:this.handleExport
        }

      ],  //功能按钮
      tableOption:{
        ismultiple:false,
        isShowCustom : false,
        defaultProp : 'examId',
        defaultSort : 'ascending'
      },
      tableHerder:[
        {
          title:"考试批次",
          sortable : 'custom',
          prop:"examName"
        },
        {
          title:"课程名称",
          sortable : 'custom',
          prop:"courseName"
        },
        {
          title:"卷别",
          sortable : 'custom',
          prop:"paperType"
        },
        {
          title:"教师用户名",
          sortable : 'custom',
          prop:"userName"
        },
        {
          title:"教师姓名",
          sortable : 'custom',
          prop:"realName"
        },
        {
          title:"待质检",
          sortable : 'custom',
          prop:"waitQuality"
        },
        {
          title:"质检通过",
          sortable : 'custom',
          prop:"passQuality"
        },
        {
          title:"质检已订正",
          sortable : 'custom',
          prop:"editQuality"
        },
        {
          title:"质检不通过",
          sortable : 'custom',
          prop:"notPassQuality"
        },
        {
          title:"再质检",
          sortable : 'custom',
          prop:"reQuality"
        },
        {
          title:"质检率(%)",
          sortable : 'custom',
          prop:"qualityRate"
        },

      ],

      tableData: [],

      pageOptions: {
        small : false,
        pageSize : 30,
        total : 0,
        currentPage : 1,
        layout : 'total, sizes, prev, pager, next, jumper',
        pageSizes : [10,40,60]
      },
      resultData :[]
    };
  },
  methods: {
    search() {
      this.getQualityStatistics()

    },

    // 第几页
    changePage(page) {
      this.requestForm.page = page
      this.getQualityStatistics()
    },
    // 每页多少条
    changeNum(pageSize) {
      this.requestForm.rows = pageSize
      this.getQualityStatistics()
    },
    // 获取已启用的考试批次
    getUseExamPlan() {
        this.$api.inquiryStatistics.getUseExamPlan().then(res =>{
            this.teaSelectList[0].data = res.data
            if(res.data.length > 0) {
              this.requestForm.examId = res.data[0].examId
              this.getExamCourseCode()
              this.getQualityStatistics()
              this.teaQualityResult()
            }

        })
    },
    // 获取课程
    getExamCourseCode() {
      this.$api.teacher.getExamCourseCode({examId:this.requestForm.examId}).then(res =>{
        let examCourseCodeList = [
          {
              key: -1,
              value: "全部",
          },
          ...res.data
        ]
        this.$set(this.teaSelectList[1],'data',examCourseCodeList)
      })
    },

    // 获取教师质检统计列表
    getQualityStatistics() {
      this.$api.inquiryStatistics.getQualityStatistics(this.requestForm).then(res =>{
        this.tableData = res.data.rows
        this.$set(this.pageOptions,'total',res.data.records)
        this.isGetResult = false
        this.teaQualityResult()
      })
    },
    sortChange ({prop,order}) {
      this.tableSort(this.requestForm,order,prop,'examId')
      this.getQualityStatistics()
    },
    // 获取统计数据
    teaQualityResult() {
      if (this.isGetResult) {
        this.sendSearchResult()
      } else {
        let { examId,courseId,paperType,userInfo } = this.requestForm
        this.$api.inquiryStatistics.teaQualityResult({examId,courseId,paperType,userInfo}).then(res =>{
          let { waitQuality,passQuality,editQuality,notPassQuality,reQuality,qualityRate} = res.data
          let resultData = [
            {
              key:'待质检',
              value:waitQuality
            },
            {
              key:'质检通过',
              value:passQuality
            },
            {
              key:'质检已订正',
              value:editQuality
            },
            {
              key:'质检不通过',
              value:notPassQuality
            },
            {
              key:'再质检',
              value:reQuality
            },
            {
              key:'质检率',
              value:`${qualityRate}%`
            },
          ]
          this.resultData = resultData
          this.sendSearchResult()
          this.isGetResult = true
          this.$refs.chartsContainer && this.initCharts()
        })
      }

    },
    // 图表
    initCharts() {
        this.histogramChart = this.$echarts.init(this.$refs.histogramChart)
        this.pieChart = this.$echarts.init(this.$refs.pieCharts)
        const xTitle = ['待质检','质检通过','质检已订正','质检不通过','再质检']
        let histogramOptions = {
          title: [
            {
              text: '质检数', 
              left:0,
              textStyle: {
                color: '#2E3033',
                fontSize: 18,
                position:'bottom'
              }
            },
            {
              text: '（单位/份）', 
              top:3,
              left:60,
              textStyle: {
                color:'#9299A6',
                fontSize: 12
              }
            },
          ],
          xAxis : {
            type : 'category',
            data : xTitle
          },
          yAxis : {
            type : 'value'
          },
          series : [
            {
              data: this.$tools.getEchartsNeedData(this.resultData,xTitle),
              type: 'bar',
              label: {
                show: true,
                position: 'top'
              },
              itemStyle : {
                normal : {
                  color : (item) => {
                    const COLOR_STYLE = [
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
                          color : '#1FCCAF'
                        },
                        {
                          offset : 1,
                          color : '#16B8D9'
                        }
                      ],
                      [
                          {
                            offset: 0,
                            color:  '#4552E6'
                          },
                          {
                            offset: 1,
                            color: '#9130F2'
                          }
                      ],
                      [
                          {
                            offset: 0,
                            color:  '#D9720B'
                          },
                          {
                            offset: 1,
                            color: '#FFAB28'
                          }
                      ],
                      [
                          {
                            offset: 0,
                            color:  '#5975FF'
                          },
                          {
                            offset: 1,
                            color: '#2C4FFF'
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
        let pieOptions = {
          legend: {
            top: 'bottom'
          },
          title: {
              text: '质检率',
          },
          tooltip : {
            formatter : '{b} {d}%'
          },
          series : [
            {
              type : 'pie',
              radius: ['40%', '70%'],
              data : [
                {
                  value : this.$tools.getEchartsNeedData(this.resultData,xTitle)[0],
                  name : '待质检'
                },
                {
                  value : this.$tools.getEchartsNeedData(this.resultData,xTitle)[1],
                  name : '质检通过'
                },
                {
                  value : this.$tools.getEchartsNeedData(this.resultData,xTitle)[2],
                  name : '质检已订正'
                },
                {
                  value : this.$tools.getEchartsNeedData(this.resultData,xTitle)[3],
                  name : '质检不通过'
                },
                {
                  value : this.$tools.getEchartsNeedData(this.resultData,xTitle)[4],
                  name : '再质检'
                }
              ],
              itemStyle : {
                normal : {
                  color : (item) => {
                    const COLOR_STYLE = [
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
                          color : '#1FCCAF'
                        },
                        {
                          offset : 1,
                          color : '#16B8D9'
                        }
                      ],
                      [
                          {
                            offset: 0,
                            color:  '#4552E6'
                          },
                          {
                            offset: 1,
                            color: '#9130F2'
                          }
                      ],
                      [
                          {
                            offset: 0,
                            color:  '#D9720B'
                          },
                          {
                            offset: 1,
                            color: '#FFAB28'
                          }
                      ],
                      [
                          {
                            offset: 0,
                            color:  '#5975FF'
                          },
                          {
                            offset: 1,
                            color: '#2C4FFF'
                          }
                      ],
                    ]
                    return new this.$echarts.graphic.LinearGradient(0,0,0,1,COLOR_STYLE[item.dataIndex])
                  },
                  label:{ 
                            show: true, 
                            formatter: '{b} {d}%' 
                        }, 
                  labelLine :{show:true} 
                 }
              }
            }
          ]
        }

        this.histogramChart.setOption(histogramOptions)
        this.pieChart.setOption(pieOptions)
      },
      listenWinResize () {
        window.addEventListener('resize', this.$tools.debounce(() => {
          this.histogramChart.resize()
          this.pieChart.resize()
        },200))
        this.$once('hook:beforeDestroy',() => {
          window.removeEventListener('resize',() => {})
        })
      },
    // 导出
    handleExport() {
      let { examId,userInfo } = this.requestForm
      this.$api.inquiryStatistics.exportQualityStatistics({ examId,userInfo})
      .then(({ status, data : { fileName }}) => {
        if (status === 1) {
          window.open(fileName)
        }
      })
    },

  },

  activated () {
    if(this.isGetResult) {
      this.teaQualityResult()
    }
  },
  mounted() {
    this.$event.$on('getResult',this.reviewResult)
    this.listenWinResize()
    this.pageTitle = this.$route.meta.childrenTitle
    this.getUseExamPlan()
  }

};
</script>

<style scoped lang="less">
  .charts-container {
      height: 300px;
      display: flex;
      .histogram-charts-container {
          height: 100%;
          width: 50%;
      }
      .pie-charts-container {
          height: 100%;
          width: 50%;
      }
      .charts-item {
          height: 100%;
          width: 100%;
      }
  }

</style>

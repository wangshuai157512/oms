<template>
    <div class="senior-management-detail-container">
        <div class="header-container">
            <div class="title">成绩查询</div>
            <div class="number">识别条码：{{examBarCode}}</div>
        </div>
        <div
            class="content-container"
        >
            <div class="answer-content-container">
                <div class="answer-content">
                    <template v-for="item in imgs">
                        <template v-if="item.type === 'img'">
                            <img
                                v-show="!item.isHide"
                                :src="item.url"
                                :key="item.url"
                                :id="item.id"
                            >
                        </template>
                        <template v-else>
                            <canvas
                                :id="item.id"
                                width="774"
                                ref="chalkboard"
                                class="chalkboard"
                                height="1540px"
                                :data-drawId="item.drawId"
                                :style="{
                                    backgroundImage : `url('${item.url}')`
                                }"
                            ></canvas>
                        </template>
                    </template>
                </div>
            </div>
            <div class="answer-card-container">
                <div class="answer-card-header">
                    <div class="total-score-label">总分:</div>
                    <div class="total-score">
                        <span class="current-score">{{studentTotalScore}}</span>
                        <span class="division">/</span>
                        <span class="total-score-number">{{totalScore}}</span>
                        <span class="branch">分</span>
                    </div>
                </div>
                <div
                    class="card-content"
                    :class="{
                        'set-height': scrollStatus,
                        'set-height2': currentIndex === 2 && scrollStatus
                    }"
                >
                    <div class="card-answer">
                        <div class="tabs">
                            <div
                                class="tab-item"
                                :class="{
                                'active':currentIndex === tabIndex
                            }"
                                v-for="(tabItem,tabIndex) in tabs"
                                :key="tabItem"
                                @click="changeTabs(tabIndex)"
                            >{{tabItem}}
                            </div>
                        </div>
                        <div class="scores" v-if="currentIndex !== 2">
                            <div class="total-score-label">得分:</div>
                            <div class="total-score">
                                <span class="current-score">{{studentTotalScore}}</span>
                                <span class="division">/</span>
                                <span class="total-score-number">{{totalScore}}</span>
                                <span class="branch">分</span>
                            </div>
                        </div>
                        <div class="table-container">
                            <div v-if="currentIndex === 0">
                                <oms-table
                                    :tableList="objectiveTableData"
                                    :tableHeaderList="objectiveTableHerder"
                                    :option="tableOptions"
                                />
                            </div>
                            <div v-if="currentIndex === 1">
                                <oms-table
                                    :tableList="subjectiveTableData"
                                    :tableHeaderList="subjectiveHeader"
                                    :option="tableOptions"
                                />
                            </div>
                            <div v-if="currentIndex === 2">
                                <ul class="sign-list">
                                    <li class="sign-item">
                                        <span>标记内容</span>
                                        <span>评阅老师</span>
                                    </li>
                                    <li class="sign-item sign-item-hover" v-for="(item,index) in feedback" :key="index">
                                        <span>{{item.type}}</span>
                                        <span>{{item.judgeUser}}</span>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "inquirePaper",
    data() {
      return {
        // doMain : 'http://172.16.16.212:8810',
        imgs : [],
        tabs: ['客观题', '主观题', '评阅标记'],
        currentIndex: 0,
        tableOptions: {
          isHideSetting: true
        },
        objectiveTableData: [],//客观题集合
        subjectiveTableData : [],//主观题集合
        subjectiveHeader : [
          {
            title : '题号',
            formatter: ({row: {structureId, questionId, subQuestionId}}) => {
              return `${structureId}.${questionId}.${subQuestionId}`
            }
          },
          {
            title : '分值',
            prop : 'score'
          },
          {
            title : '得分',
            prop : 'studentScore'
          },
          {
            title : '评阅老师',
            prop : 'markRealName'
          }
        ],
        objectiveTableHerder: [
          {
            title: '题号',
            formatter: ({row: {structureId, questionId, subQuestionId}}) => {
                if(subQuestionId){
                    return `${structureId}.${questionId}.${subQuestionId}`
                }else{
                    return `${structureId}.${questionId}`
                }
            }
          },
          {
            title: '分值',
            prop: 'score'
          },
          {
            title: '标准答案',
            prop: 'paperAnswer'
          },
          {
            title: '得分',
            prop: 'studentScore'
          },
          {
            title: '学生答案',
            prop: 'studentAnswer',
            formatter: ({row: {studentAnswer}}) => {
              return studentAnswer ? studentAnswer : '-'
            },
            itemtype: 'input'
          }
        ],
        scrollStatus : true,
        examBarCode : null, //考生条码号
        ojbectiveTotalScore : null, //客观题总分
        subjectiveTotalScore : null, //主观题总分
        studentOjbectiveScore : null, //考生客观题得分
        studentSubjectiveScore : null, //考生主观题得分
        totalScore : null, //试卷总分
        studentTotalScore : null, //考生总得分
        feedback : [], //评阅标记
        studentAnswerPaper : [], //考生试卷大图
        studentAnswerArea : [], //考生试卷主观题块切图
        teacherMarkArea : [], //教师评阅痕迹图片
        // teacherMarkArea:[["\\OMSFiles\\OMSEntities\\AnswerSheetFiles\\2209\\003\\20019000041\\3_mark_1793.png"],["\\OMSFiles\\OMSEntities\\AnswerSheetFiles\\2209\\003\\20019000041\\4_mark_1793.png"],["\\OMSFiles\\OMSEntities\\AnswerSheetFiles\\2209\\003\\20019000041\\5_mark_1793.png"],["\\OMSFiles\\OMSEntities\\AnswerSheetFiles\\2209\\003\\20019000041\\6_mark_1793.png"],["\\OMSFiles\\OMSEntities\\AnswerSheetFiles\\2209\\003\\20019000041\\7_mark_1793.png"]],
      }
    },
    mounted() {
      this.examBarCode = this.$route.query.examBarCode
      this.getStudentPaperJson()
      this.listenClient()
    },
    methods: {
      isScroll() {
        this.$nextTick(() => {
          let containerDom = document.querySelector('.table-container')
          containerDom.scrollTop = 10
          if (containerDom.scrollTop > 0) {
            document.querySelector('.table-container').scrollTop = 0
            this.scrollStatus = true
          } else {
            this.scrollStatus = false
          }
        })
      },
      listenClient () {
        window.addEventListener('resize',this.$tools.debounce(this.isScroll,500))
        this.$once('hook:beforeDestroy', () => {
          window.removeEventListener('resize')
        })
      },
      changeTabs(tabIndex) {
        this.currentIndex = tabIndex
        this.isScroll()
      },
    changeImg () {
        this.$nextTick(this.drawImg)
      },
      drawImg () {
        let chalkboards = this.$refs.chalkboard
        chalkboards && chalkboards.forEach(ele => {
          let { drawid } = ele.dataset
          let imgDom = document.getElementById(drawid)
          let newImg = new Image()
          newImg.src = imgDom.src
          newImg.onload = () => {
            ele.width = imgDom.width
            ele.height = imgDom.height
            ele.getContext('2d').drawImage(newImg,0,0)
          }
        })
      },
      getStudentPaperJson() {
        this.$api.studentManage.getStudentPaperJson({examBarCode:this.examBarCode}).then(res => {
          this.examBarCode = res.data.examBarCode
          this.ojbectiveTotalScore = res.data.ojbectiveTotalScore
          this.subjectiveTotalScore = res.data.subjectiveTotalScore
          this.studentOjbectiveScore = res.data.studentOjbectiveScore
          this.studentSubjectiveScore = res.data.studentSubjectiveScore
          this.totalScore = res.data.totalScore
          this.studentTotalScore = res.data.studentTotalScore
          this.objectiveTableData = res.data.listStudentOjbective
          this.subjectiveTableData = res.data.listStudentSubjective
          this.studentAnswerPaper = res.data.studentAnswerPaper
          this.studentAnswerArea = res.data.studentAnswerArea
          this.teacherMarkArea = res.data.teacherMarkArea
          this.feedback = res.data.feedback
            let newImgs = []
            this.studentAnswerPaper.forEach(item => {
                newImgs.push(
                    new this.$tools.DrawImg(`${item.address}`,'img')
                )
                })
                this.studentAnswerArea.forEach((saItem,saIndex) => {
                let imgUrl = saItem.address
                let markItem = this.teacherMarkArea[saIndex]
                if (this.teacherMarkArea && markItem.length > 0) {
                    newImgs.push(
                    new this.$tools.DrawImg(`$${imgUrl.replace(/\\/g, '/')}`,'canvas','',false,`img${saItem.sequence}`)
                    )
                    this.teacherMarkArea[saIndex].forEach((teItem,teIndex) => {
                    newImgs.push(
                        new this.$tools.DrawImg(`${this.teacherMarkArea[saIndex][teIndex].replace(/\\/g, '/')}`,'img',`img${saItem.sequence}`,true)
                    )
                    })
                } else {
                    newImgs.push(
                    new this.$tools.DrawImg(`${imgUrl}`,'img')
                    )
                }
                })
                this.imgs = newImgs
                this.isScroll()
            })
      }

    },
    watch : {
      'imgs' : {
        handler : 'changeImg'
      }
    }
  }
</script>

<style scoped lang="less">
    .sign-list {
        .sign-item:first-child {
            background-color: #fff;
        }
        .sign-item:last-child {
            border-radius:  0 0 6px 6px;
        }
        .sign-item.sign-item-hover:hover {
            background-color: #EBF5FF;
        }
        .sign-item {
            box-sizing: border-box;
            padding: 17px 25px;
            height: 48px;
            display: flex;
            justify-content: space-between;
            background-color: #FBFBFB;
            span{
                font-size: 13px;
                color: #363940;
                font-weight: 500;
            }
        }
    }
    .table-container {
        flex: 1;
        overflow-y: auto;
        /deep/ .oms-table {
            margin-top: 0;
            padding: 0;
        }
        /deep/ .el-table th, .oms-table .el-table tr {
            background-color: #fff;
        }
        /deep/ .table-top {
            display: none;
        }
        /deep/ .el-table th, .oms-table .el-table tr {
            border: none;
        }
        /deep/ .el-table th > .cell {
            color: #363940;
            font-size: 13px;
            font-weight: 500;
        }
    }

    .card-answer {
      position: relative;
      z-index: 99;
        display: flex;
        flex-direction: column;
        height: 100%;

    }
    .table-container {
      border-radius:0 0 6px 6px;
    }

    .senior-management-detail-container {
        cursor: pointer;
        height: 100%;
        .header-container {
            box-sizing: border-box;
            padding: 15px;
            width: 100%;
            background-color: #006AFF;
            height: 52px;
            display: flex;
            div {
                width: 50%;
            }
            .title {
                font-size: 18px;
                color: #fff;
                font-weight: 500;
            }
            .status {
                display: flex;
                justify-content: center;
                align-items: center;
                .status-label {
                    font-size: 13px;
                    color: rgba(255, 255, 255, 0.75);
                }
                .status-text {
                    font-size: 16px;
                    color: #fff;
                    font-weight: 500;
                }
                .el-icon-edit-outline {
                    color: #fff;
                    margin-left: 10px;
                }
            }
            .number {
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                text-align: right;
                color: #fff;
            }
        }
        .content-container {
            display: flex;
            background-color: #E6E9F0;
            height: calc(100% - 52px);
            .answer-content-container {
                width: 70%;
                height: 100%;
                overflow-y: auto;
                overflow-x: hidden;
                box-sizing: border-box;
                padding: 20px 60px 0;
                .answer-content {
                    img {
                        width: 100%;
                    }
                }
            }
            .answer-card-container {
                width: 30%;
                height: 100%;
                /*flex: 1;*/
                box-sizing: border-box;
                padding: 12px 10px 0 14px;
                .answer-card-header {
                    box-sizing: border-box;
                    width: 100%;
                    height: 48px;
                    background-color: #fff;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 16px;
                }
                .card-content.set-height {
                    height: calc(100% - 68px);
                }
                .card-content.set-height2 {
                    height: calc(100% - 68px);
                }
                .card-content {
                    width: 100%;
                    margin-top: 8px;
                    .tabs {
                        width: 100%;
                        height: 48px;
                        display: flex;
                        justify-content: space-between;
                        border-radius: 6px;
                        .tab-item {
                            flex: 1;
                            text-align: center;
                            line-height: 48px;
                            height: 100%;
                            background-color: #F4F5F8;
                            color: #363940;
                            font-size: 16px;
                            font-weight: 500;
                        }
                        .tab-item:first-child {
                            border-top-left-radius: 6px;
                        }
                        .tab-item:last-child {
                            border-top-right-radius: 6px;
                        }
                        .tab-item.active {
                            background-color: #fff;
                            color: #3388FF;
                        }
                    }
                    .scores {
                        box-sizing: border-box;
                        padding: 0 16px 0 24px;
                        background-color: #fff;
                        display: flex;
                        height: 48px;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #F4F5F8;
                    }
                }
            }
        }
    }

    .total-score-label {
        font-size: 16px;
        font-weight: 500;
    }

    .current-score {
        font-size: 18px;
        color: #3891FF;
        font-weight: 600;
    }

    .division {
        font-size: 16px;
        color: #9599A6;
        font-weight: 600;
    }

    .total-score-number {
        color: #363940;
        font-size: 18px;
        font-weight: 600;
    }

    .branch {
        color: #9599A6;
        font-size: 13px;
        font-weight: 400;
    }
    .total-score span{
        vertical-align: middle;
    }

    .answer-content-container::-webkit-scrollbar-track {
        background-color: transparent;
    }
    ::-webkit-scrollbar{
        width:6px;
    }
    ::-webkit-scrollbar-thumb {
        min-height: 20px;
        border-radius:10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background:rgba(0,0,0,.2)
    }
    /deep/ .el-tooltip,/deep/ .el-table__body,/deep/ .el-table__header {
      width: auto!important;
    }
</style>

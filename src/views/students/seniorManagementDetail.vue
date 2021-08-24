<template>
    <div class="senior-management-detail-container">
        <div class="header-container">
            <div class="title">高级管理</div>
            <div class="status">
                <p class="status-label">试卷状态：</p>
                <p class="status-text">{{getPaperState}}</p>
                <i class="el-icon-edit-outline" @click="customDialog = true"></i>
            </div>
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
                                <span class="current-score">{{getStudentScore}}</span>
                                <span class="division">/</span>
                                <span class="total-score-number">{{getTotalScore}}</span>
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
                                    <li
                                        class="sign-item sign-item-hover"
                                        v-for="item in feedback"
                                        :key="item.setUserId"
                                    >
                                        <span>{{item.type}}</span>
                                        <span>{{item.judgeUser}}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="footer-container" v-if="currentIndex !== 2">
                        <template v-if="currentIndex === 0">
                            <div class="edit-answer" v-if="!isEdit" @click="editAnswer">修正答案</div>
                            <div class="button-group" v-else>
                                <div class="cancel" @click="cancelEdit">取消</div>
                                <div class="edit-answer" @click="confrimEdit">确定</div>
                            </div>
                        </template>
                        <template v-if="currentIndex === 1">
                            <div class="clear" @click="releaseBindStudent">清除评阅人</div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <oms-custom-page
            :dialog.sync="customDialog"
            width="30%"
            title="状态更改"
        >
            <template v-slot:content>
                <ul class="status-list">
                    <li
                        class="status-item"
                        :class="{
                            'active':currentStatus === index
                        }"
                        v-for="(item,index) in statusList"
                        :key="item.state"
                        @click="currentStatus = index"
                    >{{item.title}}</li>
                </ul>
            </template>
            <template v-slot:footer>
                <el-button @click="customDialog = false" round>取消</el-button>
                <el-button type="primary" round @click="confirmEditStatus">确定</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
  export default {
    name: "seniorManagementDetail",
    data() {
      return {
        customDialog : false,
        currentStatus : 0,
        statusList : [
          {
            title : '未评阅',
            state : 4
          },
          {
            title : '缺考',
            state : 1
          },
          {
            title : '违纪',
            state : 2
          },
          {
            title : '替考',
            state : 3
          },
          {
            title : '作弊',
            state : 7
          },
          {
            title : '其他违纪',
            state : 8
          },
          {
            title : '严重违纪',
            state : 9
          }
        ],
        tabs: ['客观题', '主观题', '评阅标记'],
        currentIndex: 0,
        tableOptions: {
          isHideSetting: true
        },
        objectiveTableData: [],
        subjectiveTableData : [],
        subjectiveHeader : [
          {
            title : '题号',
            formatter: ({row: {structureId, questionId, subQuestionId}}) => {
              return `${structureId}.${questionId}.${subQuestionId}`
            },
            minWidth : 'auto',
            width : '67.5px'
          },
          {
            title : '分值',
            prop : 'score',
            formatter : ({row : { score }}) => {
              return score ? score : '-'
            },
            minWidth : 'auto',
            width : '67.5px'
          },
          {
            title : '得分',
            prop : 'studentScore',
            formatter : ({row : { studentScore }}) => {
              if (studentScore === null) {
                return '-'
              } else if (studentScore > 0) {
                return studentScore
              } else {
                return `<span style="color: #FE5958;">${studentScore}</span>`
              }
            },
            minWidth : 'auto',
            width : '67.5px'
          },
          {
            title : '评阅老师',
            prop : 'markRealName',
            formatter : ({row : { markRealName }}) => {
              return markRealName ? markRealName : '-'
            },
            minWidth : 'auto',
            width : '67.5px'
          }
        ],
        objectiveTableHerder: [
          {
            title: '题号',
            formatter: ({row: {structureId, questionId, subQuestionId}}) => {
              return `${structureId}.${questionId}.${subQuestionId}`
            },
            minWidth : 'auto',
            width : '40px'
          },
          {
            title: '分值',
            prop: 'score',
            minWidth : 'auto',
            width : '40px'
          },
          {
            title: '标准答案',
            prop: 'paperAnswer',
            minWidth : 'auto',
            width : '60px'
          },
          {
            title: '得分',
            prop: 'studentScore',
            formatter : ({row : { studentScore }}) => {
              return studentScore > 0 ?
                `<span>${studentScore}</span>`
                :
                `<span style="color: #FE5958;">${studentScore}</span>`
            },
            minWidth : 'auto',
            width : '40px'
          },
          {
            title: '学生答案',
            prop: 'studentAnswer',
            formatter: ({row: {studentAnswer}}) => {
              return studentAnswer ? studentAnswer : '-'
            },
            itemtype: 'input',
            minWidth : 'auto',
            width : '80px'
          }
        ],
        score : [
          {
            totalScore : 0,
            studentScore : 0
          },
          {
            totalScore : 0,
            studentScore : 0
          }
        ],
        totalScore : 0,
        studentTotalScore : 0,
        checkState : 0,
        paperState : 0,
        qualityState : 0,
        feedback : [],
        isEdit: false,
        deepCloneData: null,
        scrollStatus : true,
        examBarCode : null,
        imgs : [],
        doMain : 'http://172.16.16.212:8012'
      }
    },
    async mounted() {
      this.listenClient()
      this.examBarCode = this.$route.query.examBarCode
      await this.getStudentPaperJson()
    },
    computed : {
      getStudentScore () {
        return this.score[this.currentIndex].studentScore
      },
      getTotalScore () {
        return this.score[this.currentIndex].totalScore
      },
      getPaperState () {
        let { checkState, paperState, qualityState} = this
        let re = '-';
        if (checkState == 0 && paperState == 0)
          re = '未扫描';
        else if (checkState == 1)
          re = '缺考';
        else if (checkState == 2)
          re = '违纪';
        else if (checkState == 3)
          re = '替考';
        else if (checkState == 4)
          re = '作弊';
        else if (checkState == 5)
          re = '其他违纪';
        else if (checkState == 6)
          re = '严重违纪';
        else if (checkState == 0 && (paperState == 1 || paperState == 2) && qualityState == 0)
          re = '未评阅';
        else if (checkState == 0 && paperState == 3)
          re = '已评阅';
        else if (checkState == 0 && (paperState == 1 || paperState == 2) && qualityState == 3)
          re = '需重评';
        return re;
      }
    },
    methods: {
      listenClient () {
        window.addEventListener('resize',this.$tools.debounce(this.isScroll,500))
        this.$once('hook:beforeDestroy', () => {
          window.removeEventListener('resize')
        })
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
      async getStudentPaperJson () {
        let { data :
          { listStudentOjbective,
            listStudentSubjective,
            ojbectiveTotalScore,
            studentOjbectiveScore,
            subjectiveTotalScore,
            studentSubjectiveScore,
            totalScore,
            studentTotalScore,
            checkState,
            paperState,
            qualityState,
            feedback,
            studentAnswerPaper,
            studentAnswerArea,
            teacherMarkArea
          }
        } = await this.$api.studentManage.getStudentPaperJson({
          examBarCode : this.examBarCode
        })
        listStudentOjbective.forEach(item => {
          item.isEdit = false
        })
        this.deepCloneData = this.$tools.deepClone(listStudentOjbective)
        this.objectiveTableData = listStudentOjbective
        this.subjectiveTableData = listStudentSubjective
        this.totalScore = totalScore
        this.studentTotalScore = studentTotalScore
        this.checkState = checkState
        this.paperState = paperState
        this.qualityState = qualityState
        this.feedback = feedback
        let newScore = [
          {
            totalScore : ojbectiveTotalScore,
            studentScore : studentOjbectiveScore
          },
          {
            totalScore : subjectiveTotalScore,
            studentScore : studentSubjectiveScore
          }
        ]
        this.score = newScore
        let newImgs = []
        studentAnswerPaper.forEach(item => {
          newImgs.push(
            new this.$tools.DrawImg(`${item.address}`,'img')
          )
        })
        studentAnswerArea.forEach((saItem,saIndex) => {
          let imgUrl = saItem.address
          let markItem = teacherMarkArea[saIndex]
          if (teacherMarkArea && markItem.length > 0) {
            newImgs.push(
              new this.$tools.DrawImg(`${imgUrl.replace(/\\/g, '/')}`,'canvas','',false,`img${saItem.sequence}`)
            )
            teacherMarkArea[saIndex].forEach((teItem,teIndex) => {
              newImgs.push(
                new this.$tools.DrawImg(`${teacherMarkArea[saIndex][teIndex].replace(/\\/g, '/')}`,'img',`img${saItem.sequence}`,true)
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
      },
      isScroll() {
        this.scrollStatus = true
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
      changeTabs(tabIndex) {
        this.currentIndex = tabIndex
        this.isScroll()
      },
      showEdit(flag) {
        this.objectiveTableData.forEach((item, index) => {
          this.$set(this.objectiveTableData[index], 'isEdit', flag)
        })
      },
      editAnswer() {
        this.showEdit(true)
        this.isEdit = true
      },
      //修改答案
      async confrimEdit() {
        let isError = false
        let editAnswer = []
        this.objectiveTableData.forEach(item => {
          if (!/^[a-zA-Z]+$/.test(item.studentAnswer)) {
            isError = true
          }
          editAnswer.push({
            sequence : item.sequence,
            answer : item.studentAnswer
          })
        })
        if (isError) {
          this.$message.warning('答案格式输入错误')
          return
        }
        let { status } = await this.$api.studentManage.saveHighManagePaperObjectiveAnswer({
          examBarCode : this.examBarCode,
          answerList : editAnswer
        })
        if (status === 1) {
          this.$message.success('编辑成功')
          this.showEdit(false)
          this.isEdit = false
          this.getStudentPaperJson()
        }
      },
      cancelEdit() {
        this.objectiveTableData = this.$tools.deepClone(this.deepCloneData)
        this.showEdit(false)
        this.isEdit = false
      },
      //修改试卷状态
      async confirmEditStatus () {
        let { status } = await this.$api.studentManage.saveHighManagePaperState({
          examBarCodes : this.examBarCode,
          state : this.statusList[this.currentStatus].state
        })
        if (status === 1) {
          this.$message.success('设置成功')
          this.customDialog = false
          this.getStudentPaperJson()
        }
      },
      //清除评阅人
      async releaseBindStudent () {
        let { status } = await this.$api.studentManage.releaseBindStudent({
          examBarCode : this.examBarCode
        })
        if (status === 1) {
          this.$message.success('清除成功')
        }
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
    .chalkboard {
        width: 100%;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .status-list {
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        .status-item.active {
            background: url("../../assets/img/select-status-bgc.png") no-repeat;
            background-size: 100% 100%;
            color: #3388FF;
        }
        .status-item {
            color: #363940;
            font-size: 13px;
            font-weight: 400;
            box-sizing: border-box;
            padding: 14px 29px;
            margin-right: 12px;
            margin-bottom: 10px;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.02);
            border-radius: 2px;
            border: 1px solid #EBEEF5;
        }
    }
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
        /deep/.el-table td, .el-table th {
            padding: 0;
            height: 44px;
        }
    }

    .card-answer {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .footer-container {
        position: relative;
        z-index: 11;
        height: 54px;
        box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.04);
        border-radius: 0px 0px 6px 6px;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .clear {
            background-color: #3891FF;
            width: 102px;
            height: 30px;
            box-shadow: 0px 2px 4px 0px #AEC9E8;
            border-radius: 15px;
            color: #fff;
            text-align: center;
            line-height: 30px;
        }
        .edit-answer {
            background-color: #3891FF;
            width: 90px;
            height: 30px;
            box-shadow: 0px 2px 4px 0px #AEC9E8;
            border-radius: 15px;
            color: #fff;
            text-align: center;
            line-height: 30px;
        }
        .button-group {
            display: flex;
        }
        .cancel {
            width: 90px;
            height: 30px;
            border-radius: 15px;
            text-align: center;
            line-height: 30px;
            box-shadow: 0px 2px 4px 0px #E7E7E7;
            border: 1px solid #E7E7E7;
            margin-right: 10px;
        }
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
                width: 33.333%;
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
                width: calc(100% - 300px);
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
                width: 300px;
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
                    height: calc(100% - 68px - 54px);
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
</style>

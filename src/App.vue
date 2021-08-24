<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
  import { mapState } from 'vuex'
  import defaultRouter from '@/router/defaultRouter.js'
  import router from '@/router'
  import Home from '@/views/Home'
  export default {
    computed: {
      ...mapState(['isFullScreen'])
    },
    data() {
      return {
        backRouter:[]
      }
    },
    methods: {
      //监听esc键退出全屏
      listenEsc() {
        let _this = this
        this.$nextTick(() => {
          document.addEventListener('keyup', (e) => {
            if (e.keyCode === 27) {
              if (_this.isFullScreen) {
                _this.$store.commit('fullScreen',false)
              }
            }
          })
        })
      },
      //滚动区域回到顶部
      listenGoTop () {
        this.$event.$on('goTop',() => {
          let mainDom = document.querySelector('.mian-con')
          if (mainDom) {
            mainDom.scrollTop = 0
          }
        })
      },
      // 页面刷新保留缓存状态
      // 动态路由
      getShowClient() {
          this.$api.index.getShowClient().then(res=> {
              res.data.menuData.forEach(item=> {
                  item.component = Home
                  item.children.forEach(itemChild=> {
                      let oldComponent = itemChild.component
                      if(itemChild.name === 'index') {
                          itemChild.component = ()=> import(`@/views/${oldComponent}`)
                      }else {
                          itemChild.component = ()=> import(`@/views/${item.modules}/${oldComponent}`)
                      }
                  })
              })
              this.backRouter = res.data.menuData
              this.addrouters ()
          })
      },
      addrouters () {
              let allRouter=this.backRouter.concat(defaultRouter)
              router.$addRouter(allRouter)
              this.$event.$emit('addRoutefinish')
              this.$event.$emit('showSilderList')
      },
      listenLogin () {
        this.$event.$on('login',() => {
            this.getShowClient()
        })
      },
      checkSingleLogin() {
           var that = this
            this.timer = setInterval(function() {
                that.$api.index.checkSingleLogin().then(res=> {
                    if(res.status === 1) {
                        if(!res.data.isFlush) return
                        localStorage.setItem('auth_token',res.data.token)
                    }else {
                        that.clearTimer()
                        that.$confirm(res.message, '系统提示', {
                            confirmButtonText: '确定',
                            showCancelButton:false,
                            showClose:false,
                            closeOnClickModal:false,
                            roundButton:true
                            }).then(() => {
                                window.localStorage.clear();
                                router.replace('/')
                                history.pushState(null, null, document.URL);
                                window.addEventListener('popstate', function () {
                                    history.pushState(null, null, document.URL);
                                });
                            })
                    }
                })
            },3000)

       },

       clearTimer() {
        clearInterval(this.timer)
        this.timer = null
       }
    },
    created () {
      !(this.$route.path === '/') && localStorage.getItem('auth_token') && this.getShowClient()
    },
    mounted() {
     this.listenLogin()
     this.$event.$on('checkSingleLogin',this.checkSingleLogin)
     if (this.$route.path !== '/') {
       this.checkSingleLogin()
     }
     this.$event.$on('clearTimer',this.clearTimer)
     const unWatch = this.$watch('$route.name',(val) => {
       if (this.$route.name === 'index' || this.$route.path === '/' || this.$route.noShowSider) return;
       this.$store.commit('addTab',{
         name :this.$route.name,
         path :this.$route.path,
         title :this.$route.meta.childrenTitle
       })
       this.$store.commit('setCurrentName',val)
       unWatch()
     })
      this.listenEsc()
      this.listenGoTop()
    }
  }
</script>
<style lang="less">
    @import url('/style/framework-font.css');
    @import url('/style/style.css');

    * {
        margin: 0;
        padding: 0;
    }

    body, html {
        height: 100%;
        font-family: 'Microsoft YaHei','Arial Regular',Arial,Helvetica,Verdana,sans-serif !important;
    }

    #app {
        height: 100%;
    }

    body {
        margin: 0;
    }

    .fl {
        float: left;
    }

    .fr {
        float: right;
    }

    ul {
        list-style: none;
    }

    .clearfix:after { /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        *zoom: 1; /*ie6清除浮动的方式 *号只有IE6-IE7执行，其他浏览器不执行*/
    }
    .linkto {
        color: #409EFF;
        text-decoration: none;
        font-size: 12px;
        font-weight: 500;
    }
    .el-message {
        min-width: 80px;
        padding: 15px 30px;
    }
    .message-bule-style {
        background: #e8f1ff;
        .el-icon-info {
            color: #187aff;
        }
        .el-message__content {
            color: #187aff;
        }
    }
    .el-message-box {
        padding-bottom: 20px;
        .el-message-box__header {
            padding: 20px 20px 0px;
        }
        .el-message-box__content {
            margin-top: 22px;
            padding: 10px 20px;
            margin-bottom: 22px;
        }
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #606266;
    }
    .el-button {
      padding: 7px 14px!important;
      min-width: 90px!important;
      font-size: 14px!important;
    }
    .el-message-box .el-button--default:hover {
      background: #ecf5ff;
      color: #176DE6;
      border-color: #176DE6;
    }
    .el-message-box .el-button--primary:hover {
          background: #66b1ff;
          border-color: #66b1ff;
          color: #FFF;
    }
    .el-dialog {
        .el-dialog__title {
            font-weight: bold;
        }
    }
    .el-dialog.auto-scroll {
      .el-dialog__header {
          padding: 20px 20px 2px;
      }
      .el-dialog__body {
          max-height: 500px;
          overflow-y: auto;
      }
      .el-dialog__footer {
          padding:20px;
      }
    }
    ::-webkit-scrollbar{
        width:6px;
        height: 8px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius:10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background:rgba(0,0,0,.2)
    }

    .tag {
        margin-right: 8px;
        font-size: 14px;
        color: #409EFF;
        cursor: default;
    }
    .mb16 {
        margin-bottom: 16px;
    }

    .el-input__inner{
      padding: 8px 30px 8px 12px;
      border: 1px solid #DCDFE6;
    }
    .el-input__inner:hover{
      border-color: #C2C4CC!important;
    }
    .el-input__inner:focus {
        border-color: #3388FF!important;
    }
    .el-form-item__label {
      padding-right: 4px;
    }
    .el-form-item {
        margin-bottom: 16px!important;
    }
    .el-radio-group {
        .el-radio {
            margin-bottom: 8px;
        }
    }
    .dialog-title {
        color: #363940;
        font-size: 14px;
        font-weight: bold;
    }
</style>

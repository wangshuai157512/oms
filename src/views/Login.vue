<template>

    <div id="login">
        <el-container>
            <el-header class="topTitle">
                <span>OMS</span>  在线阅卷系统
            </el-header>
            <el-main class="container">
                <div class="pic">
                    <img src="/img/pic.png" alt="Alternate Text" />
                </div>
                <div class="loginForm">
                    <div class="schoolLogo">
                        <img src="/img/schoolLogo/hc.png" alt="">
                    </div>

                    <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
                      <el-form-item prop="username">
                        <el-input  id="txt_account" placeholder="用户名" v-model="ruleForm.username" auto-complete="off"></el-input>
                        <i class="fa fa-user"></i>
                      </el-form-item>
                      <el-form-item prop="password">
                        <el-input  placeholder="密码" id="txt_password"  type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
                        <i class="fa fa-key"></i>

                      </el-form-item>
                      <el-form-item prop="code">
                        <el-input class="code" id="txt_code" maxlength="4" type="text" v-model="ruleForm.code"  placeholder="验证码">

                        </el-input>
                        <div style="width: 90px; float: right; padding-top: 4px; padding-left: 20px;">
                             <img  id="imgcode" class="authcode" :src="codeSrc" v-on:click="switchCode" />

                        </div>
                      </el-form-item>
                      <el-form-item>
                        <el-button class="loginBtn" type="primary" @click="submitForm('ruleForm')">{{status}}

                        </el-button>
                         <div v-if="errortip" class="errortip">{{errortip}}</div>
                      </el-form-item>
                    </el-form>
                </div>

        </el-main>
        <div class="copyright">

            ©2015-2019 弘成科技发展有限公司版权所有 京ICP证041171号 京公网安备110101002605
        </div>
        </el-container>
    </div>
</template>

<script>
    // var that;
    // import { mapState } from "vuex";
    export default {
       name:"login", //组件名称
        //接受父组件的数据
        props:{},
        data:function(){
            return {
                errortip:false,
                codeSrc:"",
                guid:'',
                ruleForm: {
                  username:'',
                  password:'',
                  code:this.switchCode()
                },
                status:"登录",
                rules: {
                  username: [
                    {required: true, message: '请输入用户名', trigger: 'blur' },

                  ],
                  password: [
                    {required: true, message: '请输入密码', trigger: 'change' }
                  ],
                  code: [
                    {required: true, message: '请输入验证码', trigger: 'change' }
                  ],

                }
            }

        },
        computed: {

        },
        methods:{

            switchCode:function(){
                this.$api.login.GetAuthCode().then(res =>{
                   this.$data.codeSrc = res.data.verifyCodeImg
                   this.$data.guid = res.data.guid
                })
                // this.$data.codeSrc  = this.$base_url.baseUrl+"/service/api/Login/GetAuthCode?time=" + Math.random()
            },
            submitForm(formName) {
                var _self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       _self.login(_self)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            login:function(_self){
                var _this = _self
                this.$data.status = "登录中"
                // let url=_this.$base_url.baseUrl + '/service/api/Login/CheckLogin';
                let requerRuleForm = {
                    ...this.$data.ruleForm,
                    guid:this.$data.guid
                }
                this.$api.login.checkLogin(requerRuleForm).then(res =>{
                    if(res.status==1){
                            _this.$data.status = "登录成功";
                           // res.data.auth_token
                           localStorage.setItem('userInfo',JSON.stringify(res.data.userInfo))
                           this.$store.commit('setUserInfo',res.data.userInfo)
                            _this.$store.state.auth_token = res.data.token.auth_token;
                            localStorage.setItem('auth_token',res.data.token.auth_token)
                            // 登录成功先动态添加路由，添加成功在跳转
                            this.$router.options.routes = []
                            this.$event.$emit('login')
                            this.$event.$on('addRoutefinish',()=> {
                                if(res.data.userInfo.userType === 1) {
                                    _this.$router.push("Home");
                                }
                                if(res.data.userInfo.userType === 2) {
                                    _this.$router.push({
                                        name:"teacherReview",
                                        params : {
                                            isShowTeacherInfo : false
                                        }
                                    });

                                }
                            })
                            this.$event.$emit('checkSingleLogin')
                            this.$store.commit('addTab',{name:'clear'})
                        }else{
                             this.$data.status = "登录"
                             this.$data.errortip = res.message
                             // this.$data.codeSrc  = _this.$base_url.baseUrl+"/service/api/Login/GetAuthCode?time=" + Math.random()
                             this.switchCode()
                        }
                  // this.$data.codeSrc = res
                })

                // _this.$axios.post(url,_this.$data.ruleForm)
                //     .then(function(res){
                //         console.log(res);
                //         if(res.data.status==1){
                //             _this.$data.status = "登录成功"
                //             _this.$router.push("Home");
                //         }else{
                //              _this.$data.status = "登录中"
                //             // _this.$data.codeSrc  = _this.$base_url.baseUrl+"/service/api/Login/GetAuthCode?time=" + Math.random()
                //         }
                //     }
                // )
            },


        },
        mounted() {
            document.addEventListener('keydown', (e) => {
                if (e.keyCode === 13) {
                    this.submitForm('ruleForm')
                }
            })
        }
    }
</script>

<style lang="less" scoped>

#login{
    height:100%;
    background: url('/img/logBg.jpg') no-repeat center center;
    background-position-y: 80px;
    background-size: 100% 100%;
    .topTitle{
        height: 80px !important;
        line-height: 80px;
        padding-left: 120px;
        font-size: 15px;
        font-weight: bold;
        color: #242834;
        background-color: #fff;
        span{
            font-size: 31px;
            color: #3B8EFF;
            font-weight: bold;
        }
    }
    .container{
        padding:0;
        .pic{
            float:left;width:50%;margin-right:200px;vertical-align: middle;
            img{width:100%}
        }
        .loginForm {
            box-sizing:border-box;
            display: inline-block;
            background-color: #fff;
            padding: 32px 60px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgb(0 0 0 / 10%);
            width: 400px;
            height: 380px;
            margin-top:10%;
            .schoolLogo{
                width:100%;text-align: center;margin-bottom: 28px;
                img{
                    width:auto;margin:0;
                }
            }
            .code.el-input{
                float:left;
                width:170px;
            }
            i{
                color: #cbcbcb;
                top: 13px;
                right: 10px;
                z-index: 99;
                position: absolute;
                display: block;
                width: 30px;
                height: 30px;
                text-align: center;
                font-size: 18px !important;
            }

            #imgcode{width:100%;height:40px;vertical-align: middle}
            .loginBtn{
                display:block;outline: 0;
                background-color: #3891ff;
                border: 0;
                text-align: center;
                color: #fff;
                border-radius: 5px;
                width: 280px;
                cursor: pointer;
                text-decoration: none;
                height:40px;
                padding:0 !important
            }
            .errortip{
                text-align:center;
                color:red
            }
        }
    }
    .copyright{
        text-align: center;
        color: #fff;
        position: absolute;
        top: 100%;
        width: 100%;
        margin-top: -36px;
        font-family: Microsoft Yahei;
        line-height: 25px;
        font-size: 14px;
    }
}

</style>

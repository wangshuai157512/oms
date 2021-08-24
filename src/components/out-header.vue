<template>
    <div class="header-box">
        <el-header class="clearfix">
            <div class="heder-f fl">
                <img src="../../public/img/logo.png" alt="" class="login"> | <span>在线阅卷系统</span>
            </div>
            <el-dropdown class="heder-r fr">
                <span class="logTea"><img src="../../public/img/3.png" alt=""> <em>{{userInfo.realName}}</em></span>
                <el-dropdown-menu slot="dropdown" class="dropdown-show">
                    <el-dropdown-item @click.native="handleEditPsd"><i class="ace-icon fa fa-key"></i>修改密码</el-dropdown-item>
                    <el-dropdown-item @click.native="upDateUserInfo" v-if="userInfo.userType === 2"><i class="ace-icon fa fa-key"></i>个人信息更新</el-dropdown-item>
                    <el-dropdown-item @click.native="outLogin"><i class="ace-icon fa fa-power-off"></i>安全退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

        </el-header>
        <oms-custom-page :dialog.sync="psdDialog" :title="psdTitle" width="30%">
            <template v-slot:content class="">
                <slot>
                    <div>
                        <el-form :model="psdRuleForm" :rules="rules" ref="psdRuleForm" class="editPsdForm" >
                            <el-form-item label="旧密码" prop="oldPsd" >
                                <el-input v-model="psdRuleForm.oldPsd" type="password"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="newPsd" >
                                <el-input v-model="psdRuleForm.newPsd" type="password" autocomplete="new-password"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="endPsd">
                                <el-input v-model="psdRuleForm.endPsd" type="password" autocomplete="new-password"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </slot>
            </template>
            <template v-slot:footer>
                <el-button round @click="psdDialog = false"
                >取消</el-button>
                <el-button type="primary" round @click="rightEditPsd('psdRuleForm')"
                >确定</el-button>
            </template>
        </oms-custom-page>

        <oms-custom-page :dialog.sync="userInfoDialog" title="个人信息更新" width="50%" top="8vh">
            <template v-slot:content class="">
                <slot>
                    <div class="add-tea-box">
                        <el-form ref="formRules" :model="form" :rules="formRules" label-width="80px"  class="demo-ruleForm">
                            <div class="title-msg title-msg-top">
                                更新说明
                            </div>
                            <div class="updateCon">
                                {{memo}}
                            </div>
                            <div class="title-msg">
                                个人信息
                            </div>
                            <div class="pubMsg">
                                <el-form-item  v-for="item in alluserInfo"  :label="item.value"  :prop="item.label" v-if="item.show" :required="item.required">
                                     <el-input  v-model="form[item.label]"></el-input>
                                </el-form-item>   
                                <!-- <el-form-item label="教师姓名" prop="realName">
                                    <el-input v-model="form.realName" placeholder="请输入教师姓名"></el-input>
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-select v-model="form.userGroupType" placeholder="请选择">
                                    <el-option :label="item.lable" :value="item.id" v-for="item in typeList" :key="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="手机号">
                                    <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
                                </el-form-item>
                                <el-form-item label="请输入身份证号">
                                    <el-input v-model="form.cardNumber" placeholder="请输入身份证号"></el-input>
                                </el-form-item>
                                <el-form-item label="所属单位">
                                    <el-input v-model="form.userGroup" placeholder="请输入单位"></el-input>
                                </el-form-item>
                                <el-form-item label="学号/工号">
                                    <el-input v-model="form.studentId" placeholder="请输入学号"></el-input>
                                </el-form-item> -->
                            </div>
                            
                            <div class="title-msg">
                                银行卡信息
                            </div>
                            <div class="pubMsg">
                                <el-form-item v-for="item in bankInfo" :label="item.value" :required="item.required" v-if="item.show">
                                    <el-cascader
                                    v-if="item.label == 'bankLocation'"
                                    v-model="citys"
                                    :options="cityList"
                                    :props="props"
                                    @change="handleChange"
                                    ></el-cascader>
                                   <el-input v-else></el-input> 
                                </el-form-item>
                               <!--  <el-form-item label="开户行">
                                    <el-input v-model="form.bankName" placeholder="请输入开户行"></el-input>
                                </el-form-item>
                                <el-form-item label="开户行所在地">
                                    <el-cascader
                                    v-model="citys"
                                    :options="cityList"
                                    :props="props"
                                    @change="handleChange"
                                    ></el-cascader>
                                </el-form-item>
                                <el-form-item label="银行卡号">
                                    <el-input v-model="form.bankCardNumber" placeholder="请输入银行卡号"></el-input>
                                </el-form-item> -->
                            </div>
                            
                        </el-form>
                    </div>
                </slot>
            </template>
            <template v-slot:footer>
                <el-button round @click="userInfoDialog = false"
                >取消</el-button>
                <el-button type="primary" round @click="UpdateCurrUserInfo('formRules')"
                >确定</el-button>
            </template>
        </oms-custom-page>
    </div>
</template>

<script>
import cityList from '@/views/teacher/citys.json'
import { checkPwd } from "@/utils/validate";
export default {
    name:"out-header",
    data() {
        return {
            userInfo:{},
            isShowEditPsd:false,
            psdDialog:false,
            userInfoDialog:false,
            psdTitle:'修改密码',
            psdRuleForm: {
                oldPsd:'',
                newPsd:'',
                endPsd:''
            },
            rules: {
                oldPsd: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' },
                ],
                newPsd: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: checkPwd,trigger: 'blur'}
                ],
                endPsd: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    { validator: this.endPsd,trigger: 'blur'}
                ]
            },
            memo:'',
            form: {
                realName: '',
                userGroup: '',
                userGroupType: '',
                mobile: '',
                cardNumber: '',
                studentId: '',
                bankName: '',
                bankProvince: "",
                bankCity: "",
                bankCardNumber: '',
            },
            alluserInfo:[
                {
                    value:"姓名",
                    label:"realName",
                    show:true,
                    required:true,
                },
                {
                    value:"手机号",
                    label:"mobile",
                    show:true,
                    required:true,
                },
                {
                    value:"学号/工号",
                    label:"studentId",
                    show:true,
                    required:true,
                },
                {
                    value:"身份证号",
                    label:"cardNumber",
                    show:true,
                    required:true,
                },
                {
                    value:"所属单位",
                    label:"userGroup",
                    show:true,
                    required:true,
                },
                {
                    value:"类型",
                    label:"userGroupType",
                    show:true,
                    required:true,
                },
            ],
            bankInfo:[
                {
                    value:"开户银行",
                    label:"bankName",
                    show:true,
                    required:true,
                },
                {
                    value:"开户行所在地",
                    label:"bankLocation",
                    show:true,
                    required:true,
                },
                {
                    value:"开户行账号",
                    label:"bankCardNumber",
                    show:true,
                    required:true,
                },
            ],
            typeList:[
                {
                    id:1,
                    lable:"在校学生",
                },
                {
                    id:2,
                    lable:"本校职工",
                },
                {
                    id:3,
                    lable:"非本校",
                },
            ],
            cityList:[],
            formRules:{
                
            },
            props: {
                value: 'label',
                children: 'cities'
            },
            citys : [],
            bankInfoShowlist:[],
           
            baseInfoShowlist:[],

        }
    },
    computed : {
        // getTeacherInfo () {
        //     let that = this
        //     let isShowTeacherInfo = false
        //     this.$api.reviewManage.getConfigValue1ByKey({configKey: "FlushExtendInfo" }).then(res => {
        //       if(res.data==1){
        //         isShowTeacherInfo = true
        //       }
        //     });

        //     return isShowTeacherInfo
        // }
    },
    methods : {
        handleEditPsd() {
            this.psdDialog = true
            this.psdRuleForm={
                oldPsd:'',
                newPsd:'',
                endPsd:''
            }
        },
        rightEditPsd(psdRuleForm) {
            this.$refs[psdRuleForm].validate((valid) => {
                if (valid) {
                    let editPsdQuery = {
                        oldPassword:this.psdRuleForm.oldPsd,
                        newPassword:this.psdRuleForm.newPsd
                    }
                    this.$api.login.editPsd(editPsdQuery).then(res=> {
                        console.log(res)
                        if(res.status) {
                            this.$message({
                                message: '密码修改成功',
                                type: 'success'
                            });
                            this.psdDialog = false
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        endPsd (rule, value, callback) {
            if (value) {
                if (this.psdRuleForm.newPsd !== this.psdRuleForm.endPsd) {
                    callback(new Error('确认密码必须和新密码相同'));
                } else {
                    callback();
                }
            }
            callback();
        },
        outLogin() {
            this.$api.login.outLogin().then(res=> {
                if(res.status) {
                    this.$router.options.routes = []
                    this.$router.replace({name:'login'})
                    window.localStorage.clear();
                    history.pushState(null, null, document.URL);
                    window.addEventListener('popstate', function () {
                        history.pushState(null, null, document.URL);
                    });
                    this.$event.$emit('clearTimer')

                }
            })
        },
        upDateUserInfo() {
            this.$api.index.getCurrUserInfo().then(res=> {
                console.log(res)
                let data = res.data.updateConfig
                this.form= res.data.userInfo;
                this.alluserInfo.filter(item => {
                    if(!data.baseInfo.showList.includes(item.label)){
                        item.show = false
                    } 
                    if(!data.baseInfo.mustList.includes(item.label)){
                        item.required = false
                    }
                    
                })
                this.bankInfo.filter(item => {
                    if(!data.bankInfo.showList.includes(item.label)){
                        item.show = false
                    } 
                    if(!data.bankInfo.mustList.includes(item.label)){
                        item.required = false
                    }
                })
               
               
                // this.bankInfoShowlist = data.bankInfo.showList
                // this.bankInfoMustlist = data.bankInfo.mustlist
                // this.baseInfoShowlist = data.baseInfo.showlist
                // this.baseInfoMustlist = data.baseInfo.mustlist
                this.citys = [res.data.userInfo.bankProvince,res.data.userInfo.bankCity]
                this.memo = data.memo
            })
            this.userInfoDialog = true
        },
        UpdateCurrUserInfo(formRules) {
            let {realName,userGroup,userGroupType,mobile,cardNumber,studentId,bankName,bankProvince,bankCity,bankCardNumber}=this.form
            let upDateFromQuery = {realName,userGroup,userGroupType,mobile,cardNumber,studentId,bankName,bankProvince,bankCity,bankCardNumber}
            this.$refs[formRules].validate((valid) => {
                if (valid) {
                    this.$api.index.UpdateCurrUserInfo(upDateFromQuery).then(res=> {
                        console.log(res)
                        if(res.status) {
                            this.$message({
                                message: '更新成功',
                                type: 'success'
                            });
                            this.userInfoDialog = false
                        }

                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },

        handleChange(citys) {
           this.form.bankProvince =citys[0]
           this.form.bankCity =citys[1]
       },


    },
    mounted() {

        this.$store.commit('setUserInfo',JSON.parse(localStorage.getItem('userInfo')))
        this.userInfo = this.$store.state.userInfo
        this.cityList = cityList.provinces
        this.$api.index.getShowClient().then(res=>{
            let that = this
            if(!res.data.showFirstPage){
                this.$api.reviewManage.getConfigValue1ByKey({configKey: "FlushExtendInfo" }).then(res => {
                    if(res.data==1){
                        this.userInfoDialog = true
                        this.upDateUserInfo();
                    }
                });
             }
        })
       

    },
    watch:{
        psdDialog(newVal) {
           if(!newVal) {
            this.$refs.psdRuleForm.clearValidate()
           }
        }

    }
}
</script>

<style scoped lang="less">
    .header-box {
        width: 100%;
    }
    .el-header {
        padding: 0 10px;
        height: 60px;
        line-height: 60px;
        background: #006AFF;
        box-shadow: 0px 4px 12px 0px rgba(0, 53, 128, 0.3);
        .heder-f {
            height: 60px;
            text-align: left;
            color: #fff;
            .login {
                display: inline-block;
                margin-left: 30px;
                vertical-align: middle;
            }
            span {
                display: inline-block;
                vertical-align: middle;
            }
        }
        .heder-r {
            margin-right: 30px;
            position: relative;
            .logTea {
                display: flex;
                justify-content: right;
                align-items: center;
                height: 60px;
                color: #fff;
                img {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    margin-right: 5px;
                    text-align: right;
                }
                em {
                    font-style:normal;
                    color: #fff;
                    max-width: 113px;
                    overflow: hidden;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                }

            }

        }

    }
    .dropdown-show{
                width: 150px!important;
            }

    .add-tea-box {
        // padding: 0px 30px;
        background: #fff;
    }
    .title-msg {
        font-size: 16px;
        font-weight: 600;
        color: #15151A;
        position: relative;
        margin-top: 20px;
    }
    .title-msg:after {
        content: ' ';
        position: absolute;
        left: -8px;
        top: 5px;
        width: 3px;
        height: 14px;
        background-color:#3388FF;
    }
    .add-tea-box /deep/ .el-input__inner {
        width: 240px;
        height: 40px;
    }
    .title-msg-top {
        margin-top: 0!important;
        margin-bottom: 10px!important;
    }
    .textareaBox {
        width: 100%!important;
    }
     /deep/ .el-form-item {
        display: inline-block;
        margin-bottom: 10px;
    }
    /deep/ .el-form-item__label {
        float: none;
    }
    /deep/ .el-form-item__content {
        margin-left: 0!important;
        // margin-right: 50px;
    }
    .editPsdForm /deep/ .el-input__inner {
        width: 280px;
    }
    .pubMsg {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>

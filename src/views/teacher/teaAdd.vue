<template>
    <div>
        <div class="add-tea-box">

            <el-form ref="form" :model="form" :rules="rules" label-width="80px"  class="demo-ruleForm">
                <div class="title-msg">
                    账号信息
                </div>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="roleId">
                    <el-select collapse-tags v-model="form.roleId" placeholder="请选择" multiple>
                     <el-option :label="item.text" :value="item.id" v-for="item in roleList" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="密码" :prop="ischecked">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="状态" style="display:block">
                    <el-radio-group v-model="form.state">
                        <el-radio :label= "1" >启用</el-radio>
                        <el-radio :label= "0">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="title-msg">
                    个人信息
                </div>
                <el-form-item label="教师姓名" prop="realName">
                    <el-input v-model="form.realName" placeholder="请输入教师姓名"></el-input>
                </el-form-item>
                 <el-form-item label="单位">
                    <el-input v-model="form.userGroup" placeholder="请输入单位"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="form.userGroupType" placeholder="请选择">
                     <el-option :label="item.lable" :value="item.id" v-for="item in typeList" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程名称">
                    <el-select collapse-tags v-model="form.courseCode" placeholder="请选择" filterable multiple>
                        <el-option :label="item.courseName" :value="item.courseCode" v-for="item in courseList" :key="item.courseCode"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="手机号">
                    <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
                 <el-form-item label="请输入身份证号">
                    <el-input v-model="form.cardNumber" placeholder="请输入身份证号"></el-input>
                </el-form-item>
                 <el-form-item label="学号/工号">
                    <el-input v-model="form.studentId" placeholder="请输入学号"></el-input>
                </el-form-item>
                <div class="title-msg">
                    银行卡信息
                </div>
                <el-form-item label="开户行">
                    <el-input v-model="form.bankName" placeholder="请输入开户行"></el-input>
                </el-form-item>
                <el-form-item label="开户行所在地">
                    <el-cascader
                    :options="cityList"
                    :props="props"
                    @change="handleChange"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="银行卡号">
                    <el-input v-model="form.bankCardNumber" placeholder="请输入银行卡号"></el-input>
                </el-form-item>


            </el-form>
        </div>
        <div class="add-tea-footer" :style="{width:addFooterW + 'px'}">
          <el-button size="small " round @click="goBack()">返回</el-button>
          <el-button type="primary" size="small" round @click="handleSave('form')">保存</el-button>  
        </div>
    </div>
</template>

<script>
import cityList from './citys.json'
import { checkUserName,checkPwd} from "@/utils/validate";
export default {
    name:'teaAdd',
    data() {
      return {
        siderUnfold:true,
        addFooterW:null,
        ischecked:'password',
        form: {
          userId:"",
          userName:'',
          roleId: [],
          password: '',
          state: 1,
          realName: '',
          userGroup: '',
          userGroupType: '',
          courseCode:[],
          mobile: '',
          cardNumber: '',
          studentId: '',
          bankName: '',
          bankProvince: "",
          bankCity: "",
          bankCardNumber: '',
        },
        roleType:2,
        roleList:[], //角色
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
        courseList:[],
        cityList:[],
        props: {
          value: 'label',
          children: 'cities'
        },

        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { validator: checkUserName,trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '请选择角色', trigger: 'change'  }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: checkPwd,trigger: 'blur'}
          ],
          realName: [
            { required: true, message: '请输入教师姓名', trigger: 'blur' }
          ]
        }
      }

    },
    methods: {
        handleSave(ruleName) {
            this.$refs[ruleName].validate((valid) => {
                if (valid) {
                    this.addTeacher()
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
 
        // 计算底部宽度
        footerW() {
            let screenWidth = document.body.clientWidth
            if(this.siderUnfold) {
                this.addFooterW = screenWidth - 180
            }else {
                this.addFooterW = screenWidth - 64
            }

        },
       handleChange(citys) {
           this.form.bankProvince =citys[0]
           this.form.bankCity =citys[1]
       },
      // 获取角色列表
       getRoleType() {
            this.$api.teacher.getRoleType({roleType : this.roleType}).then(res =>{
                this.roleList = res.data
            })
        },
        // 获取已绑定的角色列表
        getUserRoleIds(userId) {
           this.$api.system.getUserRoleIds({userId}).then(res => {
                   this.form.roleId = res.data
            }) 
        },
        // 获取已绑定的课程列表
        getTeaCourseJson(userId) {
           this.$api.teacher.getTeaCourseJson({userId}).then(res => {
               if(res.data.userCourse.length > 0) {
                   res.data.userCourse.forEach(item=> {
                       this.form.courseCode.push(item.courseCode)
                   })
               }
                   
            }) 
        },
        
        // 获取课程列表
        getCourseList() {
            this.$api.teacher.getCourseList().then(res =>{
                this.courseList = res.data
            })
        },
        // 新建编辑教师
        addTeacher() {
            this.$api.teacher.addTeacher({...this.form,roleId:this.form.roleId + '',courseCode:this.form.courseCode+''}).then(res =>{
                if(res.status) {
                    this.$message({
                        message:this.form.userId? '修改成功':'添加成功',
                        type: 'success'
                    });
                    this.goBack()
                }
                
            })
        },

        goBack() {
            this.$router.go(-1)
        }

    },
    mounted() {
        this.cityList = cityList.provinces
        this.siderUnfold = this.$store.state.siderUnfold
        this.footerW()
        window.onresize= () => {
            this.footerW()
        }
        let editRow = this.$route.params
        if(editRow.row) {
            this.ischecked = ''
            editRow = editRow.row
            Object.assign(this.form,{
                ...editRow,
                courseCode :[]
            })
            this.getUserRoleIds(editRow.userId)
            this.getTeaCourseJson(editRow.userId)
        }
        this.getRoleType() 
        this.getCourseList()
        
    },
    watch: {
        "$store.state.siderUnfold"(newval, olval) {
            this.siderUnfold = newval
            this.footerW()
        },
        deep:true
    }
}
</script>
<style lang="less" scoped>
.add-tea-box {
    padding: 20px 30px;
    background: #fff;
    /* position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 100000; */
}
.title-msg {
    font-size: 16px;
    font-weight: 600;
    color: #15151A;
    position: relative;
    margin: 16px 0;
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
.mian-con {
    padding-bottom: 68px;
}
.add-tea-box /deep/ .el-input__inner {
    width: 240px;
    height: 36px;
}
 /deep/ .el-form-item {
     display: inline-block;
     /* margin-bottom: 16px; */
 }
 /deep/ .el-form-item__label {
    float: none;
}
 /deep/ .el-form-item__content {
    margin-left: 0!important;
    margin-right: 100px;
}
.add-tea-footer {
    position: fixed;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 1;
    height: 48px;
    line-height: 48px;
    text-align: center;
}
.add-tea-footer /deep/ .el-button {
    padding: 7px 14px;
    width: 90px;
}
</style>

<!-- 测试功能：初始化扫描数据 -->

<template>
    <div class="container">
        <span class="condition">考试批次</span>
        <select name="selectExam" id="selectExam" @change="getExamCourseCode">
            <option v-for="exam in examList" :key="exam.examId" :value="exam.examId" >{{exam.examName}}</option>
        </select>
        <br>
        <span class="condition">课程</span>
        <select name="selectCourse" id="selectCourse">
            <option value="" selected>全部</option>
            <option v-for="course in courseList" :key="course.key" :value="course.key">{{course.value}}</option>
        </select>
        <br>
        <span class="condition">卷别</span>
        <select name="selectPaperType" id="selectPaperType">
            <option value="" selected>全部</option>
            <option v-for="ptype in paperType" :key="ptype" :value="ptype">{{ptype}}</option>
        </select>
        <br>
        <button @click="InitScanData">开始生成</button>
    </div>
</template>

<script>
    export default {
        name:'initData',
        data(){
            return{
                examList:[],
                courseList:[],
                paperType:['A','B','C','D','E','F'],
            }
        },
        methods:{
            //考试批次
            async getEnableExamJson () {
                let { data } = await this.$api.studentManage.getEnableExamJson()
                if (data.length) {
                 this.examList=data
                }
            },
            //获取课程
            getExamCourseCode () {
                console.log(document.getElementById("selectExam").value)
                this.$api.studentManage.getExamCourseCode({examId : document.getElementById("selectExam").value })
                .then(res => {
                    console.log(res)
                    if(res.status){
                        this.courseList = res.data
                    }else{
                        alert(res.msg+res.data);
                    }
                })
            },
            InitScanData(){
                this.$api.index.initTestScanData({
                    examId : parseInt(document.getElementById("selectExam").value),
                    courseCode : document.getElementById("selectCourse").value,
                    paperType : document.getElementById("selectPaperType").value
                }).then(res =>{
                    if(res.status==1){
                        //this.$data.errortip = res.message
                    }
                    else{
                        this.$data.errortip = res.message
                    }
                })
            }
        },
        async mounted() {
            await this.getEnableExamJson()
            this.getExamCourseCode()
        }
    }
</script>

<style lang="less" scoped>
.container{
    margin: 10px;
    span{
        display: inline-block;
        width: 100%;
    }
}
</style>
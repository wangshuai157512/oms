<template>
  <div >
    <div class="imgBox" v-if="imgList.length>0">
        <img :src="item" alt="" v-for="item in imgList" :key="item">
    </div>
  </div>
</template>

<script>
export default {
  name: "lookSigninDeltil",
  components: {
  
  },
  data() {
    return {
      doMain : 'http://172.16.16.212:8810',
      imgQuery:{},
      imgList:[]

      
    };
  },
  methods: {
    // 获扫签到表查询列表
    getSignImg() {
      this.$api.inquiryStatistics.getSignImg(this.imgQuery).then(res =>{
        if(res.data.imgList.length>0) {
          this.imgList = res.data.imgList
        }else{
          alert('未找到签到表信息')
          window.close()
        }
        
        
      })
    },
    

  },
  
  mounted() {
    this.imgQuery = this.$route.query
    this.getSignImg()

  }
};
</script>

<style scoped lang="less">
 
</style>
<template>
    <div class="senior-sign">
        <img v-for="item in imgs" :key="item"  :src="item" />
    </div>
</template>

<script>
  export default {
    name: "seniorSign",
    data () {
      return {
        imgs : []
      }
    },
    mounted () {
      this.getSignInfoImg()
    },
    methods : {
      async getSignInfoImg () {
        let query = this.$route.query
        let { data } = await this.$api.studentManage.getSignInfoImg(query)
        this.imgs = data
      }
    }
  }
</script>

<style scoped lang="less">
    .senior-sign {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>

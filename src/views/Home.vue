<template>
  <div class="home">
    <layout msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
let timer = null
import layout from '@/components/layout.vue'

export default {
  name: 'Home',
  components: {
    layout
  },
  methods:{
  },
  mounted() {
  }
 
 
}
</script>
<style lang="less" scoped>
  .home {
    height: 100%;
  }
</style>

<template>
  <div>
    <div class="search-result">
        <div>查询结果合计项 :</div>
        <div class="result" v-for="item in result" :key="item.key">
          <span>{{item.key}}</span>
          <i>{{item.value}}</i>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "search-result",
  props:{
    result:  {
      type:Array,
      default:[]
    }
  },
  data() {
    return {
      
    };
  }
};
</script>

<style scoped lang="less">
  .search-result {
    width: 100%;
    height: 36px;
    background: #fff;
    text-align: left;
    padding-left: 20px;
    box-sizing: border-box;
    position: relative;
    z-index: 5;
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #9599A6;
    .result {
      margin-right: 20px;
      span {
        margin-right: 5px;
      }
    }
    i {
      font-style: normal;
    }
  }
</style>

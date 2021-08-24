<template>
    <div class="pagination-container" v-if="paginationOptions.total && showChart">
          <el-pagination
              background
              :small="paginationOptions.small"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginationOptions.currentPage"
              :page-size="paginationOptions.pageSize"
              :layout="'total, sizes, prev, pager, next, jumper'"
              :total="paginationOptions.total">
          </el-pagination>
    </div>
</template>
<script>
export default {
    name:'OmsPage',
    props : {
      paginationOptions  : {
        type : Object,
        default : () => ({
          small : false,
          pageSize : 30,
          total : 0,
          currentPage : 1,
          pageSizes : [20,40,60,80]
        })
      },
       showChart: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {

      };
    },
    methods: {
      handleSizeChange(mun) {
         this.$emit('changeNum',mun)
      },
      handleCurrentChange (p) {
        this.$emit('changePage',p)
        this.$event.$emit('goTop')
      }
    },

}
</script>
<style lang="less" scoped>
.pagination-container {
    background-color: #fff;
    display: flex;
    justify-content: center;
    padding-bottom: 20px;
}
</style>

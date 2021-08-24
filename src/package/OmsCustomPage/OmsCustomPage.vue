<template>
  <div v-drag style="position: fixed;z-index:10000;">
    <el-dialog
      :title="title"
      :visible.sync="dialog"
      :width="getWidth"
      :top="top"
      :before-close="handleClose"
      :append-to-body="true"
      :fullscreen = "isFullScreen"
      :custom-class="!isFullScreen?'auto-scroll':''"
    >
      <!-- <span>这是一段信息</span> -->
      <slot name="content"></slot>
      <div slot="footer" class="dialog-footer">
        <slot name="footer"></slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const widthMap = {
    '30%' : '420px',
    '50%' : '620px'
  }
export default {
  name: "OmsCustomPage",
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    title : {
      type : String,
      default : '提示'
    },
    width : {
      type : String,
      default : '620px'
    },
    top : {
      type : String,
      default : '15vh'
    },
    // 是否全屏弹窗
    isFullScreen : {
      type : Boolean,
      default : false
    }
  },
  data() {
    return {};
  },
  computed : {
    getWidth () {
      if (this.width) {
         if (widthMap[this.width]) {
           return widthMap[this.width]
         } else {
           return this.width
         }
      } else {
        return '620px'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:dialog", false)
    }
  }
};
</script>

<style lang="less" scoped>
  .dialog-footer /deep/ .el-button--default:hover {
    background: #ecf5ff;
    color: #176DE6;
    border-color: #176DE6!important;
  }
  /deep/ .el-dialog__title {
    font-weight: 700;
  }
  /deep/ .el-dialog__body {
    padding:32px;
  }
  /deep/ .el-dialog.auto-scroll .el-dialog__footer {
    padding-top:0;
  }
  /deep/ .el-dialog .el-input {
    width: 240px;
    height: 36px;
  }
  /deep/ .el-dialog .el-input__inner,/deep/ .el-dialog .el-input__icon {
      height: 36px;
      line-height: 36px;
  }
  /deep/ .el-dialog .el-form-item__content{
    line-height:1;
    
  }
  /deep/ .el-dialog .default-upload-container {
    width: 240px;
    height: 36px;
    line-height: 36px;
  }
  /deep/ .el-form-item__label{
    line-height:1;
    padding-bottom:16px;
  }

  /deep/ .el-checkbox{
    margin-right:48px;
  }

  /deep/ .el-dialog .el-pagination__sizes .el-input{
    width: 100px;
  }
  /deep/ .el-dialog .el-pagination__editor.el-input{
    width: 50px;
  }
  /deep/ .el-dialog .el-pagination__sizes .el-input__inner,/deep/ .el-dialog .el-pagination__sizes .el-input__icon,/deep/ .el-dialog .el-pagination__jump .el-input__inner {
      height: 28px;
      line-height: 28px;
  }

</style>

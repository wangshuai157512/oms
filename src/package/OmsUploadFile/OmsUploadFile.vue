<template>
    <div>
        <el-upload
            action=""
            ref="upload"
            :multiple="multiple"
            :accept="accept"
            :limit="limit"
            :http-request="httpRequest"
            :show-file-list="showFileList"
            :before-upload="beforeAvatarUpload"
        >
            <template v-if="isHasSlot">
                <slot></slot>
            </template>
            <div v-else class="default-upload-container">{{getFileName}}</div>
        </el-upload>
    </div>
</template>

<script>
  export default {
    name: "OmsUploadFile",
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      accept: {
        type: String,
        default: 'xls,xlsx'
      },
      limit: {
        type: Number,
        default: 1
      },
      httpRequest: {
        type: Function,
        default: () => {
        }
      },
      fileSize: {
        type: String,
        default: '2'
      },
      showFileList: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        name: '点击选择文件'
      }
    },
    computed: {
      isHasSlot() {
        return this.$slots.default && this.$slots.default.length
      },
      getFileName () {
        if (this.multiple) {
          let newName = this.name.replace(/点击选择文件/g,'')
          return this.name === '点击选择文件'?this.name:newName.substring(0,newName.lastIndexOf('、'))
        } else {
          return this.name
        }
      }
    },
    methods: {
      beforeAvatarUpload(file) {
        let size = Math.floor(file.size / 1024 / 1024);//计算文件的大小　
        if (size > this.fileSize) {
          this.$message.error(`${'上传文件大小不能超过' + this.fileSize + 'M!'}`);
          return false
        }
        let FileExt = file.name.replace(/.+\./, "");
        console.log(this.accept,123)
        let arrAccept = this.accept.split(',')      
        if (arrAccept.indexOf(FileExt.toLowerCase()) === -1){ 
          this.$message({ 
              type: 'warning', 
              message: `请上传后缀名为${this.accept}的附件！`
          });                
          return false;       
        }     
        if (this.multiple) {
          this.name += `${file.name}、`
        } else {
          this.name = file.name
        }
        this.$refs.upload.clearFiles()
      },
      clearFileName () {
        this.name = '点击选择文件'
      }
    },
    mounted() {

    }
  }
</script>

<style lang="less" scoped>
    .default-upload-container {
        box-sizing: border-box;
        width: 280px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid #DDDDDD;
        background: rgba(255, 255, 255, 0.35);
        color: #C2C4CC;
        font-size: 13px;
        line-height: 40px;
        text-align: left;
        padding-left: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

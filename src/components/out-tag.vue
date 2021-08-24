<template>
  <div>
    <div class="show-tag">
      <template>
        <div class="home-icon" @click="handleHome"><i class="cedu-navi-home"></i></div>
      </template>
      <el-tabs
        v-model="currentName"
        type="card"
        closable
        @tab-remove="removeTab"
        @tab-click="pushPage"
      >
        <el-tab-pane
          v-for="item in editableTabs2"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "out-tag",
  data() {
    return {
      
    };
  },
  computed: {
    ...mapState(["editableTabs2"]),
    currentName : {
      get () {
        return this.$store.state.currentName
      },
      set (val) {
        this.$store.commit('setCurrentName',val)
      }
    }
  },
  
  methods: {
    handleHome() {
      let indexPage = false
      this.$router.options.routes.forEach(item=> {
        if(item.children) {
          item.children.forEach(itemChildren => {
            if(itemChildren.name === 'index') {
              indexPage = true
            }
          })
        }

      })
      if(indexPage) {
        this.$router.push({path:'/home'});
      }else {
         this.$router.push({name:"teacherReview"});
      }
      
      this.$store.commit('setCurrentName','')
    },
    pushPage(name) {
      this.$router.push(name);
    },
    removeTab(name) {
      let tagIndex = null;
      this.editableTabs2.forEach((item, index) => {
        if (item.name === name) {
          tagIndex = index;
        }
      });
      this.$store.commit("removeTab", { name });
      // 关闭标签页
      if (this.$route.name === name) {
        if (tagIndex === 0) {
          if (this.editableTabs2.length < 1) {
            this.$router.replace("/index");
            this.$store.commit('setCurrentName','')
          } else {
            this.$router.replace(this.editableTabs2[0].path);
            this.$store.commit('setCurrentName',this.editableTabs2[0].name)
          }
        } else if (tagIndex === this.editableTabs2.length - 1) {
          this.$router.replace(
            this.editableTabs2[this.editableTabs2.length - 1].path
          );
         this.$store.commit('setCurrentName',this.editableTabs2[this.editableTabs2.length - 1].name)
        } else {
          this.$router.replace(this.editableTabs2[tagIndex - 1].path);
          this.$store.commit('setCurrentName',this.editableTabs2[tagIndex - 1].name)
        }
      }

    },
  },
};
</script>

<style scoped lang="less">
.show-tag {
  width: 100%;
  height: 36px;
  background: #FCFCFC;
  text-align: left;
  padding-left: 50px;
  box-sizing: border-box;
  position: relative;
  box-shadow: 0px 4px 12px 0px rgba(33, 35, 38, 0.08);
  z-index: 5;
}
.home-icon {
  color: #3388FF;
  font-weight: 700;
  position: absolute;
  left: 20px;
  top: 8px;
}
.show-tag /deep/ .el-tabs--card>.el-tabs__header {
  border-bottom: 0;
  margin-bottom: 0;
}
.show-tag /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav {
  border: 0;
  border-radius:0;
}
.show-tag /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav .el-tabs__item{
    border: 0;
    border-radius:0;
    box-sizing: border-box;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #9599A6;
    padding: 0 14px;
    font-size: 13px;
}
.show-tag /deep/ .el-tabs__item.is-active {
    background: #EBF5FF;
    color: #15151A!important;
    font-size: 13px;
}
.show-tag /deep/ .el-tabs__nav-next,.show-tag /deep/ .el-tabs__nav-prev {
  height: 36px;
  line-height: 36px;
}
</style>

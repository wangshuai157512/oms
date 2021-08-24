<template>
  <div class="sider-container">
    <!-- <el-aside > -->
      <div class="siderBox" :style="{width:siderW}"> 
        <ul class="">
          <a href="javascript:;" class="switchover"><i class="fa fa-bars" @click="handleSolder()"></i></a>
          <li :class="index == chidrenShowIndex? 'partentActive':''" v-if="!item.noShowSider" v-for="(item,index) in silderList" :key="index" @mouseenter="enterPartent(index)" @mouseleave="leavePartent">
            <i :class="item.icon" class="flIcon"></i><span v-show="!isCollapse">{{item.title}}</span><i v-show="!isCollapse" class="fa fa-angle-right drop-icon frIcon"></i>
            <ul v-if="index == chidrenShowIndex" :style="liColumns > 1?{ width: 150*liColumns + 'px',right:-150*liColumns + 'px'} : ''">
                <li :class="itemChild.name === currentName? 'childrenActive':''" class="childrenHover" v-if="!itemChild.noShowSider" v-for="(itemChild,itemIndex) in item.children" :key="itemIndex" @click.stop="handleItemChild(itemChild.path)">
                    {{ itemChild.meta.childrenTitle }}
                </li>
            </ul> 
          </li>
        </ul>
      </div>
    <!-- </el-aside> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "out-sider",
  data() {
    return {
      isCollapse: false, //折叠菜单
      chidrenShowIndex:null, //二级菜单
      siderW:180,
      silderList: [],
      liColumns:1
    };
  },
  created() {
    this.silderList = this.$router.options.routes.filter(
      (item) => item.path !== "/login"
    );
    this.$event.$on('showSilderList',()=> {
      if(this.silderList.length < 1) {
        this.silderList = this.$router.options.routes.filter(
          (item) => item.path !== "/login"
        );
      }
      
    })
    
    
  },
  computed :{
    ...mapState(['currentName'])
  },
  methods: {
    enterPartent(index) {
      this.chidrenShowIndex = index
      this.silderList.forEach((item,hoverIndex)=> {
        if(index === hoverIndex) {
          let childrenNum = item.children.length
          this.liColumns = Math.ceil(childrenNum / 8)
        }
        
      })
    },
    leavePartent() {
      this.chidrenShowIndex = null
    },
    handleSolder() {
      if(!this.isCollapse) {
        this.siderW = '64px'
        this.$store.state.siderUnfold = false
      }else {
        this.siderW = '180px'
        this.$store.state.siderUnfold = true
      }
      this.isCollapse = !this.isCollapse
    },
    // 给标签页传值
    handleItemChild(path) {
      this.$router.push(path)
    },
    tagChang(val,old) {
      if(val.name !== 'index' && val.name !== 'teaAdd' && val.name !== 'paperQualitySpotCheck') {
        this.$store.commit('addTab',{
          name:val.name,
          path:val.path,
          title:val.meta.childrenTitle
        })
      }
      
    }
  },
  watch: {
    $route: {
      handler : 'tagChang'
    }
  },
  mounted() {
   
  }
};
</script>

<style scoped lang="less">
  .el-aside {
    overflow: visible;
    background: #243659;
    height: 100%;
    // width: 180px!important;
  }
  .hideAside {
    animation:hide 0.3s;
     animation-fill-mode:forwards;
     animation-timing-function:ease-out
  }
  @keyframes hide{
    0%{width:180px}
    100%{width:64px}
  }
  .showAside {
    animation:show 0.3s;
     animation-fill-mode:forwards;
     animation-timing-function:ease
  }
  @keyframes show{
    0%{width:64px}
    100%{width:180px}
  }
  .switchover {
    display: block;
    height: 36px;
    line-height: 36px;
    text-align: right;
    margin-right: 21px;
    font-size: 20px;
    color: #9599A6;
  }
  .siderBox {
    overflow: visible;
    background: #243659;
    height: 100%;
    width: 180px;
    // transition: width 0.1s;
    ul {
      li {
        height: 50px;
        line-height: 50px;
        font-weight: 500;
        color: #9599A6;
        position: relative;
        cursor: pointer;
        font-size: 14px;
        i,span{
          display: inline-block;
          vertical-align: middle;
        }
        .flIcon {
          margin-right: 10px;
          margin-left: 26px;
        }
        .frIcon {
          position: absolute;
          top: 19px;
          right: 24px;
        }
        ul {
          box-sizing: border-box;
           position: absolute;
            right: -150px;
            top: 0;
            width: 150px;           
            background: rgba(247, 251, 255, 1);
            box-shadow: 6px 0px 12px 0px rgba(0, 63, 153, 0.1);
            border-radius: 0px 4px 4px 0px;
            max-height: 352px;
            z-index: 99;
          li {
            display: inline-block;
            width: 126px;
            padding-left: 24px;
            height: 44px;
            line-height: 44px;
            font-size: 13px;
            color: #363940;
            font-weight: 400;             
            text-shadow: 6px 0px 12px rgba(0, 63, 153, 0.1);
            font-size: 12px;
          }
        }
      }
    }
  }
  .partentActive {
    color: #fff!important;
    background: #17294D!important;
  }
  .childrenActive {
    color: #3388FF!important;
  }
  .childrenHover:hover {
    background: #EBF5FF;
  }

</style>

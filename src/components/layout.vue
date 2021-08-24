<template>
    <div class="layout">
        <el-container>
            <oms-head/>
        </el-container>
        <el-container class='main'>
                <oms-sider/>
                <el-main>
                    <div class="mian-box">
                        <oms-tag/>
                            <keep-alive :include="getTabList">
                                <router-view :class="['mian-con',isFullScreen?'full-screen':'']"></router-view>
                            </keep-alive>
                        <search-result v-if='isShowSearchResult' :result='resultData' />
                    </div>
                </el-main>

        </el-container>
    </div>

</template>

<script>
    import OmsHead from '@/components/out-header.vue'
    import OmsSider from '@/components/out-sider.vue'
    import OmsTag from '@/components/out-tag.vue'
    import SearchResult from '@/components/search-result.vue'
    import { mapGetters , mapState} from 'vuex'
    export default {
        name:'layout',
        data () {
            return {
                resultData : []
            }
        },
        components: {
            OmsHead,
            OmsSider,
            OmsTag,
            SearchResult
        },
        computed : {
          ...mapGetters(['getTabList']),
          ...mapState(['isFullScreen']),
          isShowSearchResult () {
            return this.SHOW_RESULT_LIST.indexOf(this.$route.name) !== -1
          }
        },
        mounted () {
            this.$event.$on('searchResult',(data) => {
                this.resultData = data
            })
        }
    }
</script>

<style scoped lang='less'>
    .main {
        height: calc(100% - 60px);
    }
    .layout {
        height: 100%;
    }
    .mian-box {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .el-main {
        padding: 0;
    }
    .mian-con {
        box-sizing: border-box;
        padding: 16px 20px;
        background: #F4F5F8;
        // padding: 50px;
        // height: 600px;
        flex: 1 1;
        overflow-y: auto;
    }
    .mian-con.full-screen {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 100;
    }
</style>

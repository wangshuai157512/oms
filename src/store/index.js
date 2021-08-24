import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:{},
    editableTabs2: [],
    currentName : '',
    siderUnfold: true,
    isFullScreen : false,
  },
  getters :{
    getTabList (state) {
      let newTabList = []
      state.editableTabs2.forEach(item => newTabList.push(item.name))
      return newTabList
    },

  },
  mutations: {
    setUserInfo : (state,data) => {
      state.userInfo = data
    },
    addTab : (state,data) => {
     
      let isHasTab = state.editableTabs2.filter(item => item.name === data.name)
      state.currentName = data.name
      if (isHasTab.length < 1) {
        state.editableTabs2.push(data) 
      }
      if(data.name === 'clear') {
        state.editableTabs2 = []
      }
    },
    setCurrentName : (state,name) =>{
      state.currentName = name
    },
    removeTab (state,newTab) {
      state.editableTabs2 = state.editableTabs2.filter(item => item.name !== newTab.name)
    },
    fullScreen (state,flag) {
      state.isFullScreen = flag
    }
  },
  actions: {
  },
  modules: {
  }
})

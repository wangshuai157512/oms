import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    noShowSider: true,
  }

]


const router = new VueRouter({
  mode:"history",
  routes
})

const DEV_ROUTERS_MAP = {
  '查询统计' : [
    {
      path: '/teaReviewStatistics',
      name: 'teaReviewStatistics',
      component: () => import('@/views/inquiryStatistics/teaReviewStatistics'),
      meta: {
        childrenTitle: '教师评阅统计'
      }
    },
    {
      path: '/reviewWork',
      name: 'reviewWork',
      component: () => import('@/views/inquiryStatistics/reviewWork'),
      meta: {
        childrenTitle: '评阅工作量统计'
      }
    },

    {
      path: '/qualityWork',
      name: 'qualityWork',
      component: () => import('@/views/inquiryStatistics/qualityWork'),
      meta: {
        childrenTitle: '质检工作量统计'
      }
    },

    {
      path: '/examinationReviewWork',
      name: 'examinationReviewWork',
      component: () => import('@/views/inquiryStatistics/examinationReviewWork'),
      meta: {
        childrenTitle: '试卷评阅统计'
      }
    },
    {
      path: '/teaQualityStatistics',
      name: 'teaQualityStatistics',
      component: () => import('@/views/inquiryStatistics/teaQualityStatistics'),
      meta: {
        childrenTitle: '教师质检统计'
      }
    }, 
    {
      path: '/examAnalysis',
      name: 'examAnalysis',
      component: () => import('@/views/inquiryStatistics/examAnalysis'),
      meta: {
        childrenTitle: '考试分析'
      }
    }, 
    {
      path: '/paperAnalysis',
      name: 'paperAnalysis',
      component: () => import('@/views/inquiryStatistics/paperAnalysis'),
      meta: {
        childrenTitle: '试卷分析'
      }
    },
    
  ],
  '试卷管理' : [
    {
        path : '/answerCard',
        name : 'answerCard',
        component : () => import('@/views/Examination/answerCard'),
        meta: {
          childrenTitle: '答题卡列表'
        }
    },
  ]
}

router.$addRouter = allRouter => {
  router.matcher = new VueRouter({
    mode: 'history',
    routes: [...routes],
  }).matcher;
  allRouter.forEach(item=> {
    if (DEV_ROUTERS_MAP[item.title]) {
      item.children = [
        ...item.children,
        ...DEV_ROUTERS_MAP[item.title]
      ]
    }
    router.addRoute(item)
    router.options.routes.push(item)
 })
}
// router.beforeEach((to, from, next) => {
//   this.$store.commit('addTab',{
//     name :this.$route.name,
//     path :this.$route.path,
//     title :this.$route.meta.childrenTitle
//   })
//   next()

// })
export default router

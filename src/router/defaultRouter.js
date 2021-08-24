let defaultRouter = [
    {
        path: '/onlineReview',
        name: 'onlineReview',
        component: () => import('@/views/reviewManage/onlineReview'),
        noShowSider: true,
    },

    {
        path: '/qualityDetail',
        name: 'qualityDetail',
        component: () => import('@/views/reviewManage/qualityDetail'),
        noShowSider: true,

    },
    {
        path: '/Detail',
        name: 'Detail',
        component: () => import('@/views/reviewManage/Detail'),
        noShowSider: true,

    },

    {
        path : '/senior-management-detail',
        name : 'seniorManagementDetail',
        component : () => import('@/views/students/seniorManagementDetail'),
        noShowSider: true,
    },
    {
        path : '/senior-sign',
        name : 'seniorSign',
        component : () => import('@/views/students/seniorSign'),
        noShowSider: true,
    },

    {
        path : '/inquirePaper',
        name : 'inquirePaper',
        component : () => import('@/views/inquiryStatistics/inquirePaper'),
        noShowSider: true,
    },
    {
        path : '/lookSigninDeltil',
        name : 'lookSigninDeltil',
        component : () => import('@/views/inquiryStatistics/lookSigninDeltil'),
        noShowSider: true,
    },
    
    {
        path : '/answerSheetDIY',
        name : 'answerSheetDIY',
        component : () => import('@/views/Examination/answerSheetDIY'),
        noShowSider: true,
    }
]
export default defaultRouter
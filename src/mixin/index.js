export default {
  data () {
    return {
      SHOW_RESULT_LIST : ['reviewWork','qualityWork','teaQualityStatistics','teaReviewStatistics','examinationReviewWork'],
      SORT_ORDER : {
        'ascending' : 'asc',
        'descending' : 'desc'
      }
    }
  },
  methods : {
    //新页面跳转
    linkTo ({path,query}) {
      let link = this.$router.resolve({
        path, query
      })
      window.open(link.href,'_blank')
    },
    operations(num) {
      return this.$alert(`确定删除选中的<strong style="color:#3388FF">${num}</strong>数据？不可恢复！`, '系统提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        roundButton:true,
        type: 'warning'
      })
    },
    //是否禁用功能区按钮
    isDisable () {
      return !this.pageOptions.total
    },
    //图表显示是否禁用按钮
    isDisableFun () {
        if (!this.showChart) {
        return true
      }
      return this.isDisable()
    },
    //查询统计数据传递
    sendSearchResult (key = 'resultData') {
      this.$event.$emit('searchResult',this[key])
    },
    //表格排序
    tableSort (target,order,prop,defaultProp,defaultOrder = 'desc') {
      if (Object.prototype.toString.call(target) === '[object Object]') {
        if (order) {
          target['sidx'] = prop
          target['sord'] = this.SORT_ORDER[order]
        } else {
          target['sidx'] = defaultProp
          target['sord'] = defaultOrder
        }
      } else {
        throw new Error('target is not a object')
      }
    }
  }
}

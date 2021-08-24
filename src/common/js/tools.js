// 深拷贝函数 接收目标target参数
const deepClone = target => {
  let result;
  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = [];
      for (let i in target) {
        result.push(deepClone(target[i]))
      }
    } else if(target===null) {
      result = null;
    } else if(target.constructor===RegExp){
      result = target;
    }else {
      result = {};
      for (let i in target) {
        result[i] = deepClone(target[i]);
      }
    }
  } else {
    result = target;
  }
  return result;
}

class DrawImg {
  constructor (url,type,id,isHide = false,drawId) {
    this.url = url
    this.type = type
    this.id = id
    this.isHide = isHide
    this.drawId = drawId
  }
}

const debounce = (fn,wait) => {
  let timer = null
  return () => {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn,wait)
  }
}

const createFormData = (params) => {
  let formdata = new FormData()
  for (let item in params) {
    formdata.append(item,params[item])
  }
  return formdata
}
const format = (fn) => {
  let nowTime = ""

  let year = new Date().getFullYear();
  let month =new Date().getMonth() + 1 < 10? "0" + (new Date().getMonth() + 1): new Date().getMonth() + 1;
  let date =new Date().getDate() < 10? "0" + new Date().getDate(): new Date().getDate();
  let hh =new Date().getHours() < 10? "0" + new Date().getHours(): new Date().getHours();
  let mm =new Date().getMinutes() < 10? "0" + new Date().getMinutes(): new Date().getMinutes();
  let ss =new Date().getSeconds() < 10? "0" + new Date().getSeconds(): new Date().getSeconds();
  nowTime = year + "-" + month + "-" + date +" "+hh+":"+mm+':'+ss ;
  return nowTime
}

const getEchartsNeedData = (target,value) => {
  if (!Array.isArray(target) || !Array.isArray(value)) {
    throw new Error('请传入数组')
  }
  let needArr = []
  for (let item of value) {
      for (let targetItem of target) {
      if (item === targetItem.key) {
        needArr.push(targetItem.value)
      }
    }
  }
  return needArr
}

export default {
  deepClone,
  DrawImg,
  debounce,
  createFormData,
  format,
  getEchartsNeedData
}

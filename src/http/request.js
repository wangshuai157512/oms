import axios from 'axios'
import config from './config'
import Vue from 'vue'
import router from '@/router'
let loadingCount = 0,loading

const request = options => {
  options.headers = {
    'Authorization' : 'Bearer ' + localStorage.getItem('auth_token')
  }
  const { $event } = Vue.prototype
  if (loadingCount < 1 && options.url !=="/service/api/ClientData/CheckSingleLogin") {
    loading = $event.$loading({background:'transparent'})
  }
  loadingCount++
  return new Promise((resolve, reject) => {
    const instance = axios.create(config)
    // 添加请求拦截器
    instance.interceptors.request.use(function (config) {
      // 在发送请求之前做些什么
      return config;
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error);
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function (response) {
      loadingCount--
      if (loadingCount < 1) {
        setTimeout(() => {
          loading.close()
        },200)
      }
      // 对响应数据做点什么
      if(options.url =="/Service/Api/OnlineReview/GetStudentPaper" && response.data.status === 0){
        $event.$alert(response.data.message, "", {
            confirmButtonText: '确定',
            callback: action => {
              window.close();
            }
        })  
        return false
      }
      if (response.data.status === 0 && options.url !=="/service/api/ClientData/CheckSingleLogin") {
        let msgDuration= response.data.message.length>30?5000:3000
        $event.$message({
          type:'error',
          message:response.data.message,
          duration:msgDuration
        });
      }
      return response.data;
    }, function (error) {
      loadingCount--
      if (loadingCount < 1) {
        setTimeout(() => {
          loading.close()
        },200)
      }
      let { response } = error
      if(response && response.status === 401 && location.pathname !== '/') {
        $event.$emit('clearTimer')
        $event.$confirm('登录过期，请重新登陆。', '系统提示', {
          confirmButtonText: '确定',
          showCancelButton:false,
          showClose:false,
          closeOnClickModal:false,
          roundButton:true
        }).then(() => {
          window.localStorage.clear();
          router.replace('/')
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', function () {
              history.pushState(null, null, document.URL);
          });
        })
          
      }
      // 对响应错误做点什么
      return Promise.reject(error);
    });
    instance.request(options)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export default request

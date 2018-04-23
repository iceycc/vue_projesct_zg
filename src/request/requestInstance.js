import axios from 'axios'
import qs from 'qs'
import Config  from './requestOption'
import {EventBus,Constants} from '../config/index'
const _axios =  axios.create(Config)



// 请求的拦截器
_axios.interceptors.request.use( (config) => {
  // const token = localStorage.getItem('token')
  const uid = localStorage.getItem('uid')
  // 判断请求的类型
  // 如果是post请求就把默认参数拼到data里面
  // 如果是get请求就拼到params里面
  if(config.method === 'post') {
    let data = qs.parse(config.data)
    config.params = qs.stringify({
      uid: uid,
      ...data
    })
  } else if(config.method === 'get') {
    config.params = {
      uid: uid,
      ...config.params
    }
  }
  return config;
},  (error)=> {
  return Promise.reject(error);
})

// 添加响应拦截器
_axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default _axios;

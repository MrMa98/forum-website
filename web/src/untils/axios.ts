import axios from 'axios';
import router from '../router';
import { errorMap } from '../untils/errorCode'
import { openNotification } from './antvNotification';

//** 登录成功后需要刷新页面才能携带token， 应该能解决但是第15行也能完美解决 */
// axios.defaults.headers.common['token'] = localStorage.getItem('token');

// 创建一个新的 axios 实例
const http = axios.create({
  baseURL: 'http://127.0.0.1:3000', // 设置基础 URL
  withCredentials: true,
});

http.interceptors.request.use(function (request) {
  request.headers.token = localStorage.getItem('token');
  return request
})


// 添加响应拦截器
http.interceptors.response.use(function (response) {

  const { code, message, token } = response.data;

  if (token) {
    localStorage.setItem('token', token);
  }

  if (errorMap.has(code) && errorMap.get(code).route) {
    localStorage.setItem('token', '');
    router.push(errorMap.get(code).route);
  }

  if (errorMap.has(code) && !errorMap.get(code).route) {
    openNotification('bottomRight', 'error', message);
    return false;
  }

  if (code == 9999) {
    openNotification('bottomRight', '失败', message);
    return false;
  }

  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  return Promise.reject(error);
});

export default http
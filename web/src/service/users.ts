// import type { Users, Login } from '@/untils/type';
import http from '../untils/axios'

/** 获取用户信息 */
export function userInfo() {
  return http.get('/api/userInfo')
}

/** 添加用户自定义标签 */
export function addCustomTag(params: string) {
  return http.post('/api/user/add/tag', { tag: params })
}

/** 获取用户信息 */
export function getCustomTag() {
  return http.get('/api/user/tag')
}

/** 添加用户自定义标签 */
export function updateAvator(avator: File) {
  const formData = new FormData();
  formData.append('avator', avator);
  return http.post('/api/user/update/avator', formData)
}



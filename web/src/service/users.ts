// import type { Users, Login } from '@/untils/type';
import http from '../untils/axios'

/** 获取用户信息 */
export function userInfo() {
  return http.get('/api/userInfo')
}
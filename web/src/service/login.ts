import type { Users, Login } from '@/untils/type';
import http from '../untils/axios'

/** 账号密码登录 */
export function login(params: Login) {
  return http.post('/user/login', params)
}

/** 新用户注册 */
export function userRegister(params: Users) {
  return http.post('/user/register', params)
}

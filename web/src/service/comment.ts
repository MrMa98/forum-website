import type { CommentParams } from '@/untils/type'
import http from '../untils/axios'

/** 账号密码登录 */
export function addComment(params: CommentParams) {
  return http.post('api/comment/add', params)
}

export function getComment(id: string) {
    return http.get(`api/comment/all?id=${id}`)
}


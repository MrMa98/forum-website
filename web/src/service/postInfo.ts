import type { AddPostInfo, UpdatePostInfo } from '@/untils/type'
import http from '../untils/axios'

/** 添加帖子 */
export function addPost(params: AddPostInfo) {
  return http.post('/api/postinfo/add', params)
}

export function getPostByName(params: string) {
  return http.get(`/api/postinfo/findname?search=${params}`)
}

export function getPostById(params: string) {
  return http.get(`/api/postinfo/findid?search=${params}`)
}

export function updatePostById(params: UpdatePostInfo) {
  return http.post('/api/postinfo/edit', params)
}


export function deletePostById(id: string) {
  return http.get(`/api/postinfo/delete?id=${id}`)
}

export function recoverPostById(id: string) {
  return http.get(`/api/postinfo/recover?id=${id}`)
}

export function getPostByHottest() {
  return http.get('/api/postinfo/findhot')
}

export function getOperationLog() {
  return http.get('/api/postinfo/operation')
}
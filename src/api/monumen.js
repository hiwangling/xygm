import request from '@/utils/request'
export function get_inscription(query) {
  return request({
    url: '/cemetery/get_inscription',
    method: 'get',
    params: query
  })
}

export function inscription_add(data) {
  return request({
    url: '/cemetery/inscription_add',
    method: 'post',
    data
  })
}


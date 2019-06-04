import request from '@/utils/request'

export function listlink(query) {
  return request({
    url: '/linkman/list',
    method: 'get',
    params: query
  })
}

export function createlink(data) {
  return request({
    url: '/linkman/add',
    method: 'post',
    data
  })
}

export function updatelink(data) {
  return request({
    url: '/linkman/edit',
    method: 'post',
    data
  })
}

export function deletelink(query) {
  return request({
    url: '/linkman/del',
    method: 'get',
    params: query
  })
}

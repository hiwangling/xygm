import request from '@/utils/request'

export function listdead(query) {
  return request({
    url: '/bury/list',
    method: 'get',
    params: query
  })
}

export function adddead(data) {
  return request({
    url: '/bury/add',
    method: 'post',
    data
  })
}

export function updatedead(data) {
  return request({
    url: '/bury/edit',
    method: 'post',
    data
  })
}

export function deletedead(query) {
  return request({
    url: '/bury/del',
    method: 'get',
    params: query
  })
}

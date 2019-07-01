import request from '@/utils/request'

export function listScreen(query) {
  return request({
    url: '/dplyfjtp/list',
    method: 'get',
    params: query
  })
}

export function createScreen(data) {
  return request({
    url: '/dplyfjtp/add',
    method: 'post',
    data
  })
}

export function updateScreen(data) {
  return request({
    url: '/dplyfjtp/edit',
    method: 'post',
    data
  })
}

export function deleteScreen(query) {
  return request({
    url: '/dplyfjtp/del',
    method: 'get',
    params: query
  })
}


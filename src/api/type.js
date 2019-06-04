import request from '@/utils/request'

export function listType(query) {
  return request({
    url: '/cemetery_type/list',
    method: 'get',
    params: query
  })
}

export function createType(data) {
  return request({
    url: '/cemetery_type/add',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: '/cemetery_type/edit',
    method: 'post',
    data
  })
}

export function deleteType(query) {
  return request({
    url: '/cemetery_type/del',
    method: 'get',
    params: query
  })
}

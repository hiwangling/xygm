import request from '@/utils/request'

export function listAdmin(query) {
  return request({
    url: '/manager/list',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  return request({
    url: '/manager/add',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/manager/edit',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/manager/del',
    method: 'post',
    data
  })
}

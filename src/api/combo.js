import request from '@/utils/request'

export function listCombo(query) {
  return request({
    url: '/combo/list',
    method: 'get',
    params: query
  })
}

export function createCombo(data) {
  return request({
    url: '/combo/add',
    method: 'post',
    data
  })
}

export function updateCombo(data) {
  return request({
    url: '/combo/edit',
    method: 'post',
    data
  })
}

export function deleteCombo(query) {
  return request({
    url: '/combo/del',
    method: 'get',
    params: query
  })
}

export function getCombo(query) {
  return request({
    url: '/service_info/get_serviceinfo_all',
    method: 'get',
    params: query
  })
}

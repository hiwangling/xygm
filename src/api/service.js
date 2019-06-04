import request from '@/utils/request'

export function listService(query) {
  return request({
    url: '/service_info/list',
    method: 'get',
    params: query
  })
}

export function createService(data) {
  return request({
    url: '/service_info/add',
    method: 'post',
    data
  })
}

export function updateService(data) {
  return request({
    url: '/service_info/edit',
    method: 'post',
    data
  })
}

export function deleteService(query) {
  return request({
    url: '/service_info/del',
    method: 'get',
    params: query
  })
}

export function typeService(query) {
  return request({
    url: '/service_info/get_services',
    method: 'get',
    params: query
  })
}

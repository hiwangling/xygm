import request from '@/utils/request'

export function getsevices(query) {
  return request({
    url: '/cemetery/buy_services_list',
    method: 'get',
    params: query
  })
}

export function addservices(data) {
  return request({
    url: '/cemetery/buy_services_add',
    method: 'post',
    data
  })
}

export function editservices(data) {
  return request({
    url: '/cemetery/buy_services_edit',
    method: 'post',
    data
  })
}

export function delservices(query) {
  return request({
    url: '/cemetery/buy_cemetery_del',
    method: 'get',
    params: query
  })
}

export function payservices(data) {
  return request({
    url: '/cemetery/buy_services_pay',
    method: 'post',
    data
  })
}

export function getEditService(query) {
  return request({
    url: '/cemetery/buy_services_one_list',
    method: 'get',
    params: query
  })
}


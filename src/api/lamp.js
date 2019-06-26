import request from '@/utils/request'

export function lamplist(query) {
  return request({
    url: '/cemetery/lightup_list_byid',
    method: 'get',
    params: query
  })
}

export function lampadd(data) {
  return request({
    url: '/cemetery/lightup_add',
    method: 'post',
    data
  })
}

export function lampdelete(query) {
  return request({
    url: '/cemetery/buy_cemetery_del',
    method: 'get',
    params: query
  })
}

export function lamppay(data) {
  return request({
    url: '/cemetery/lightup_pay',
    method: 'post',
    data
  })
}

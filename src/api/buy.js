import request from '@/utils/request'

export function listbuy(query) {
  return request({
    url: '/cemetery/get_buy_cemetery',
    method: 'get',
    params: query
  })
}

export function addbuy(data) {
  return request({
    url: '/cemetery/buy_cemetery',
    method: 'post',
    data
  })
}

export function editbuy(data) {
  return request({
    url: '/cemetery/buy_cemetery_edit',
    method: 'post',
    data
  })
}

export function deletebuy(query) {
  return request({
    url: '/cemetery/buy_cemetery_del',
    method: 'get',
    params: query
  })
}
export function get_order_status(query) {
  return request({
    url: '/cemetery/get_order_status',
    method: 'get',
    params: query
  })
}
export function pay(data) {
  return request({
    url: '/cemetery/pay',
    method: 'post',
    data
  })
}


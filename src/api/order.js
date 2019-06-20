import request from '@/utils/request'

export function CemeteryOrderList(query) {
  return request({
    url: '/stat/buy_order_list',
    method: 'get',
    params: query
  })
}
export function export_order_stat(query) {
  return request({
    url: '/stat/export_order_stat',
    method: 'get',
    params: query
  })
}
export function buy_services_list(query) {
  return request({
    url: '/stat/buy_services_list',
    method: 'get',
    params: query
  })
}


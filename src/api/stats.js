import request from '@/utils/request'

export function AllDai(query) {
  return request({
    url: '/service_info/get_service_dai_count',
    method: 'get',
    params: query
  })
}
export function AllCount(query) {
  return request({
    url: '/cemetery/tong_ji_xiao_by_qu',
    method: 'get',
    params: query
  })
}
export function az_bury_list(query) {
  return request({
    url: '/stat/az_bury_list',
    method: 'get',
    params: query
  })
}
export function export_bury_stat(query) {
  return request({
    url: '/stat/export_bury_stat',
    method: 'get',
    params: query
  })
}
export function buy_lightup_list(query) {
  return request({
    url: '/stat/buy_lightup_list',
    method: 'get',
    params: query
  })
}
export function export_lightup_stat(query) {
  return request({
    url: '/stat/export_lightup_stat',
    method: 'get',
    params: query
  })
}
export function get_olddata(data) {
  return request({
    url: '/cemetery/get_olddata',
    method: 'post',
    data
  })
}

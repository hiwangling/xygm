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

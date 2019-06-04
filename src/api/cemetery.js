import request from '@/utils/request'
// 获取全部墓园
export function get_gardens(query) {
  return request({
    url: '/cemetery_classify/get_gardens',
    method: 'get',
    params: query
  })
}
// 获取全部墓区
export function get_areas(query) {
  return request({
    url: '/cemetery_classify/get_areas',
    method: 'get',
    params: query
  })
}
// 获取全部样式
export function get_styles(query) {
  return request({
    url: '/cemetery_style/all',
    method: 'get',
    params: query
  })
}
// 获取全部类型
export function get_types(query) {
  return request({
    url: '/cemetery_type/list',
    method: 'get',
    params: query
  })
}
// 获取全部状态
export function get_status(query) {
  return request({
    url: '/cemetery/get_uses_satus',
    method: 'get',
    params: query
  })
}

export function get_name(query) {
  return request({
    url: '/cemetery/get_cemetery_Info_name',
    method: 'get',
    params: query
  })
}

export function get_num(query) {
  return request({
    url: '/cemetery/tong_ji_xiao_by_qu',
    method: 'get',
    params: query
  })
}

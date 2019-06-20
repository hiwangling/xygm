import request from '@/utils/request'
// 退换迁历史记录
export function historyinfo(data) {
  return request({
    url: '/historyinfo/get_historyinfo',
    method: 'post',
    data
  })
}
// 退迁
export function move_cemetery(data) {
  return request({
    url: '/cemetery/move_cemetery',
    method: 'post',
    data
  })
}
// 换墓
export function change_cemetery(data) {
  return request({
    url: '/cemetery/change_cemetery',
    method: 'post',
    data
  })
}


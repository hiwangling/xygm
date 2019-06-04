import request from '@/utils/request'

export function listStyle(query) {
  return request({
    url: '/cemetery_style/list',
    method: 'get',
    params: query
  })
}

export function createStyle(data) {
  return request({
    url: '/cemetery_style/add',
    method: 'post',
    data
  })
}

export function updateStyle(data) {
  return request({
    url: '/cemetery_style/edit',
    method: 'post',
    data
  })
}

export function deleteStyle(query) {
  return request({
    url: '/cemetery_style/del',
    method: 'get',
    params: query
  })
}

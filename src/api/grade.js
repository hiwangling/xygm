import request from '@/utils/request'

export function listGrade(query) {
  return request({
    url: '/grade/list',
    method: 'get',
    params: query
  })
}

export function createGrade(data) {
  return request({
    url: '/grade/add',
    method: 'post',
    data
  })
}

export function updateGrade(data) {
  return request({
    url: '/grade/edit',
    method: 'post',
    data
  })
}

export function deleteGrade(query) {
  return request({
    url: '/grade/del',
    method: 'get',
    params: query
  })
}

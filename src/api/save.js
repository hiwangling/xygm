import request from '@/utils/request'

export function listSave(query) {
  return request({
    url: '/save/list',
    method: 'get',
    params: query
  })
}

export function createSave(data) {
  return request({
    url: '/save/add',
    method: 'post',
    data
  })
}

export function updateSave(data) {
  return request({
    url: '/save/edit',
    method: 'post',
    data
  })
}

export function deleteSave(query) {
  return request({
    url: '/save/del',
    method: 'get',
    params: query
  })
}

export function PaySave(data) {
  return request({
    url: '/save/jiesuan',
    method: 'post',
    data
  })
}

export function GoSave(data) {
  return request({
    url: '/save/jiesuan',
    method: 'post',
    data
  })
}

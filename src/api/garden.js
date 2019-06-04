import request from '@/utils/request'

export function listGarden(query) {
  return request({
    url: '/cemetery_classify/g_list',
    method: 'get',
    params: query
  })
}

export function createGarden(data) {
  return request({
    url: '/cemetery_classify/g_add',
    method: 'post',
    data
  })
}

export function updateGarden(data) {
  return request({
    url: '/cemetery_classify/g_edit',
    method: 'post',
    data
  })
}

export function deleteGarden(query) {
  return request({
    url: '/cemetery_classify/g_del',
    method: 'get',
    params: query
  })
}

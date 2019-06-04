import request from '@/utils/request'

export function AllCemetery(query) {
  return request({
    url: '/service_info/service_infos_by_cemetery',
    method: 'get',
    params: query
  })
}

export function AllCemeteryCid(query) {
  return request({
    url: '/service_info/get_service_bill_by_cid',
    method: 'get',
    params: query
  })
}

export function ExecuteService(data) {
  return request({
    url: '/servicebill/execute',
    method: 'post',
    data
  })
}

export function CatService(query) {
  return request({
    url: '/servicebill/get_one',
    method: 'get',
    params: query
  })
}

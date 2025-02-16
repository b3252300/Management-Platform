import http from '@/utils/request'


export function Test(data) {
  return http.request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/api/SecurityKey/Test',
    data
  })
}
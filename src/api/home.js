import http from '@/utils/request';

//get HomePage Data
export function GetHomeData(data) {
    return http.request({
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      method: 'post',
      url: '/api/WebApp/Management/1/Home/GetHomeData',
      data
    })
  }


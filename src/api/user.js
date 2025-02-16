import http from '@/utils/request';
import { encryptStorage } from "@/utils/EncryptStorage";


//登录
export function login(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId')
    },
    method: 'post',
    url: '/api/webapp/Eras/Login/Validation',
    data
  })
}


export function logout() {
  return http.request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    url: '/api/webapp/Management/1/login/logout',
    method: 'post',
    
  })
}
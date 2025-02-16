import http from '@/utils/request';
import { encryptStorage } from "@/utils/EncryptStorage";


//1.1 註冊裝置金鑰
export function Register(data) {
  return http.request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'x-No-Encryption':true, //不加密
      "x-No-LiffToken":true //不token
      
    },
    method: 'post',
    url: '/api/webapp/Eras/SecurityKey/Register',
    data
  })
}

//1.7 登出
export function Logout(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId')
      
    },
    method: 'post',
    url: '/api/webapp/Eras/Login/Logout',
    data
  })
}





//9.1 下拉選單-科別
export function Division(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId')
    },
    method: 'post',
    url: '/api/webapp/Eras/Dropdown/Division',
    data
  })
}


//0.2 判斷版本號
export function version(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      "x-No-LiffToken":true, //不Lifftoken
      'Authorization': encryptStorage.getItem('DeviceId')
      
    },
    method: 'post',
    url: '/api/webapp/Eras/FrontendVersion/Check',
    data
  })
}

//8.1 取檔案
export function Upload(id) {
  return http.request({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': encryptStorage.getItem('DeviceId'),  
        'x-No-Encryption':true, //不加密
        "x-No-Token":true, //不token
      },
      responseType: 'blob',
      method: 'get',
      url: `/api/File/${id}`, // 動態傳入 id
 
  })
}
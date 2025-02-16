import http from '@/utils/request'
import { encryptStorage } from "@/utils/EncryptStorage";

export function CaseTracking(data) {
  return http.request({
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    method: 'post',
    url: '/api/SecurityKey/Test',
    data
  })
}

export function Info(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId')
    },
    method: 'post',
    url: '/api/webapp/Eras/LineAccount/Info',
    data
  })
}
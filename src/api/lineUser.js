import http from '@/utils/request';
import { encryptStorage } from "@/utils/EncryptStorage";



//1.2 員工實名認證
export function RegisterStaff(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId')
      },
      method: 'post',
      url: '/api/webapp/Eras/Register/Staff',
      data
    })
  }
  
//1.3 民眾實名認證
  export function RegisterPatient(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId')
      },
      method: 'post',
      url: '/api/webapp/Eras/Register/Patient',
      data
    })
  }
  


  //2.1 門診-查診間清單
  export function GetClinicList(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId')
      },
      method: 'post',
      url: '/api/webapp/Eras/OpdRegister/GetClinicList',
      data
    })
  }


  //2.2 門診-預帶資料
  export function GetPatientInfo(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId')
      },
      method: 'post',
      url: '/api/webapp/Eras/OpdRegister/GetPatientInfo',
      data
    })
  }

  //2.3 門診-掛號
  export function OpdRegister(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId')
      },
      method: 'post',
      url: '/api/webapp/Eras/OpdRegister/Register',
      data
    })
  }

  //2.4 門診-查詢掛號紀錄
    export function QueryReservationList(data) {
      return http.request({
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': encryptStorage.getItem('DeviceId')
        },
        method: 'post',
        url: '/api/webapp/Eras/OpdRegister/QueryReservationList',
        data
      })
    }

//2.5 門診-取看診號
    export function GetCurrentNumber(data) {
      return http.request({
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': encryptStorage.getItem('DeviceId')
        },
        method: 'post',
        url: '/api/webapp/Eras/OpdRegister/GetCurrentNumber',
        data
      })
    }

//2.6 門診-取消掛號
export function CancelRegister(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId')
    },
    method: 'post',
    url: '/api/webapp/Eras/OpdRegister/CancelRegister',
    data
  })
}
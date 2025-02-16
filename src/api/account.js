import http from '@/utils/request';
import { encryptStorage } from "@/utils/EncryptStorage";

//1.2 帳號管理-個案帳號
export function AccountPatient(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId')
      },
      method: 'post',
      url: '/api/webapp/Eras/Account/Patient',
      data
    })
  }
 
  //1.5 帳號管理-個案帳號 匯出
  export function AccountDownloadPatient(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId'),
        'x-No-DecryptInit':true, //不解密
      },
      responseType: 'blob',
      method: 'post',
      url: '/api/webapp/Eras/Account/DownloadPatient',
      data
    })
  }

  //1.3 帳號管理-員工帳號
export function AccountStaff(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId')
    },
    method: 'post',
    url: '/api/webapp/Eras/Account/Staff',
    data
  })
}

  //1.4 帳號管理-員工帳號 匯出
  export function AccountDownloadStaff(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId'),
        'x-No-DecryptInit':true, //不解密
      },
      responseType: 'blob',
      method: 'post',
      url: '/api/webapp/Eras/Account/DownloadStaff',
      data
    })
  }

  //1.6 帳號管理-員工帳號 修改狀態
  export function UpdateStaffStatus(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId'),
      },
      method: 'post',
      url: '/api/webapp/Eras/Account/UpdateStaffStatus',
      data
    })
  }






  //2.1 個案管理-搜尋
  export function CaseList(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId'),   
      },
      method: 'post',
      url: '/api/webapp/Eras/Case/List',
      data
    })
  }
  //2.1 個案管理-匯出
  export function CaseDownload(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId'),
        'x-No-DecryptInit':true, //不解密
      },
      responseType: 'blob',
      method: 'post',
      url: '/api/webapp/Eras/Case/Download',
      data
    })
  }


  //3.1 個案詳情-基本資料
  export function CaseBasicData(data) {
    return http.request({
      headers: {
        'Content-Type': 'text/plain',
        'Authorization': encryptStorage.getItem('DeviceId'),   
      },
      method: 'post',
      url: '/api/webapp/Eras/Case/BasicData',
      data
    })
  }

    //3.2 個案詳情-手術
    export function CaseBasicOpr(data) {
      return http.request({
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': encryptStorage.getItem('DeviceId'),   
        },
        method: 'post',
        url: '/api/webapp/Eras/Case/Opr',
        data
      })
    }

//3.3 個案詳情-設定收案狀態
export function SetCaseStatus(data) {
      return http.request({
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': encryptStorage.getItem('DeviceId'),   
        },
        method: 'post',
        url: '/api/webapp/Eras/Case/SetCaseStatus',
        data
      })
}

//3.4 個案詳情-術前諮詢詳情
export function PreConsultant(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId'),   
    },
    method: 'post',
    url: '/api/webapp/Eras/Case/PreConsultant',
    data
  })
}

//3.5 個案詳情-諮詢時間存檔
export function SaveConsultant(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId'),   
    },
    method: 'post',
    url: '/api/webapp/Eras/Case/SaveConsultant',
    data
  })
}

//3.6 個案詳情-術後追蹤查詢
export function GetPostOperativeTrackRecord(data) {
  return http.request({
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': encryptStorage.getItem('DeviceId'),   
    },
    method: 'post',
    url: '/api/webapp/Eras/Case/GetPostOperativeTrackRecord',
    data
  })
}




//3.7 個案詳情-個案存檔
export function SaveCase(data) {
  return http.request({
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': encryptStorage.getItem('DeviceId'),  
      
    },
    method: 'post',
    url: '/api/webapp/Eras/Case/SaveCase',
    data
  })
}


//3.8 個案詳情-術後追蹤儲存
export function SavePostOperativeTrackRecord(data) {
  return http.request({
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': encryptStorage.getItem('DeviceId'),  
      
    },
    method: 'post',
    url: '/api/webapp/Eras/Case/SavePostOperativeTrackRecord',
    data
  })
}


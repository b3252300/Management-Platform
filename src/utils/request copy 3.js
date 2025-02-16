import axios from 'axios'
import {  onMounted } from "vue";
import { ElMessage } from 'element-plus'
import { getEnvs } from './envs'
import cookies from '@/utils/cookies'
import router from '@/router'
import { getBaseUrl } from "@/utils/explain"
import { useUserStore, useAppStore } from '@/store'
import { v4 as uuidv4 } from "uuid";
import useCryptoJs from "@/composable/aesUtils.js";
import { TOKEN, WHITE_CODE_LIST, LOGIN_ERROR_CODE, GLOBAL_DATA } from '@/config/constant'
import { encryptStorage } from "@/utils/EncryptStorage";
import { ElMessageBox } from 'element-plus'


//uuid
let DeviceId = encryptStorage.getItem('DeviceId')
if (!DeviceId) {
  encryptStorage.setItem("DeviceId", uuidv4());
}

// liff 設定
import useLiff from '@/composable/useLiff.js';
const liff = useLiff(); // 先呼叫函式取得返回的物件
const { lineInitGetBasicData } = liff;


class HttpRequest {
  // #baseUrl
  constructor() {
    this.baseUrl = getBaseUrl()
    // this.withCredentials = false
    this.timeout = 60 * 60 * 24 * 1000
    this.mockEnabled = true; // 開關：是否啟用模擬數據
  }




  getConfig() {
    var baseUrl = import.meta.env.VITE_API_ROOT;
    const appStore = useAppStore();

    if (import.meta.env.VITE_READ_LOCAL_CONFIG == "true") {
      var apiRootUrl = appStore.ApiRootUrl;

      if (apiRootUrl == undefined || apiRootUrl == "" || apiRootUrl == "undefined") {
        baseUrl = import.meta.env.VITE_API_ROOT;
      } else {
        baseUrl = apiRootUrl;
      }

    }
    appStore.SET_ApiRootUrl(baseUrl);
    // console.log(baseUrl);

    const config = {
      baseURL: baseUrl,
      timeout: this.timeout,
      // withCredentials: this.withCredentials,
      // headers: {
      //   'Content-Type': 'application/json;charset=UTF-8'
      // },
      // headers: {
      //   'Content-Type': 'text/plain'
      // },
    }

    return config
  }

  getParams(payload) {
    const { method, data } = payload;    

    if (['post', 'put', 'patch', 'delete'].indexOf(method) >= 0) {
      payload.Data = data;
    } else {
      
      payload.params = data
      delete payload.Data
    }
    return payload
  }

  checkStatus(status) {
    let errMessage = ''
    const userStore = useUserStore();

    switch (status) {
      case 400:
        errMessage = '請求錯誤'
        break
      case 401:
        errMessage = '無效的授權';
        userStore.SET_TOKEN();
        router.push({ name: 'Login' })
        break
      case 403:
        errMessage = '拒絕訪問'
        break
      case 404:
        errMessage = '請求錯誤'
        break
      case 405:
        errMessage = '請求錯誤'
        break
      case 408:
        errMessage = '請求錯誤'
        break
      case 500:
        errMessage = '請求錯誤'
        break
      case 501:
        errMessage = '請求錯誤'
        break
      case 502:
        errMessage = '請求錯誤'
        break
      case 503:
        errMessage = '請求錯誤'
        break
      case 504:
        errMessage = '請求錯誤'
        break
      case 505:
        errMessage = '請求錯誤'
        break
      default:
        errMessage = '請求錯誤'
    }
    return errMessage
  }

  // 拦截处理
  setInterceptors(instance) {
    const { EncryptInit, DecryptInit } = useCryptoJs();
    const that = this;

    // 請求攔截器
    instance.interceptors.request.use(
      async config => {
        if (!navigator.onLine) {
          ElMessage({
            message: '请检查您的网络是否正常',
            type: 'error',
            duration: 3 * 1000
          })
          return Promise.reject(new Error('请检查您的网络是否正常'))
        }


    //取得當前路徑是否為 /line 
    const currentMobile = router.currentRoute.value.meta.device == "line";
    // console.log(currentMobile, "取得當前路徑是否為 /line ");
    // console.log(config.headers['x-No-LiffToken'] === undefined, config.headers['x-No-LiffToken'] , "x-No-LiffToken");

    const { data, FileName } = config;
    const token = cookies.get(TOKEN)
 
    const list = {    
      "Token": currentMobile == false ? token : "",
      "ModuleId": "",      
      "DeviceId": encryptStorage.getItem('DeviceId'),
      "Version" :  import.meta.env.VITE_Version,
      "ActionId":uuidv4(),
      "Language":"",
      "Data": data
    };


      if(config.headers['x-No-LiffToken'] === undefined){
        if(currentMobile){
          const { liffIdToken, userId } = await lineInitGetBasicData();
          if(liffIdToken){ 
            if(import.meta.env.VITE_ID_TOKEN === "true"){
                    list.Data.LineIdToken = liffIdToken;
                    console.log("list.Data.LineIdToken --------->"+list.Data.LineIdToken);
            }else{
                    list.Data.LineIdToken = userId;
                    console.log("userId--------->"+userId);
            }
          }
         }
}
        if(config.headers['x-No-Encryption'] === "true"){

          config.data = list;  
          console.log('request不加密 response success:', config.url, config);
    
          return config
  
        }else{
          
          const multipartView = config.headers['Content-Type'] == 'multipart/form-data';
          
            const encryptedData = EncryptInit(list); //加密            
  
            if(!list.Data.LineIdToken && currentMobile && config.headers['x-No-LiffToken'] === undefined){
              return          
            } 

            // if(!multipartView){   
            //   config.data = encryptedData;        
            //     // console.log("encryptedData 加密 request", config);    
            //     // 解密響應數據
            //       const decryptedData = DecryptInit(encryptedData);
            //       console.log('encryptedData success 解密 request:', decryptedData);      
            //       return config        
            // }else{
            //   let formData = new FormData();
            //   console.log(config.data, "config.data");
            //   config.data = encryptedData;   
            //   formData.append('Data', JSON.stringify(config.data));
            //   formData.append('FileName', FileName);
            //   // formData.forEach((item)=>{
            //   //   console.log(item, "formData");
            //   // });
            //   const decryptedData = DecryptInit(encryptedData);
            //   console.log('encryptedData success 解密 request:', decryptedData); 
            //   console.log(config, "config");
            //   // config = formData;
            //   console.log(config, "formData");

            //   return formData   


            // }

            
  
              config.data = encryptedData;        
                // console.log("encryptedData 加密 request", config);    
                // 解密響應數據
                  const decryptedData = DecryptInit(encryptedData);
                  console.log('encryptedData success 解密 request:', decryptedData);      
                  return config       

        }


        
        

    
      },
      error => {
        return Promise.reject(new Error(error))
      }
    )

      // 響應攔截器
    instance.interceptors.response.use(
      res => {
        if (!navigator.onLine) {
          ElMessage({
            message: '请检查您的网络是否正常',
            type: 'error',
            duration: 3 * 1000
          })
          return Promise.reject(new Error('请检查您的网络是否正常'))
        }
 
        const result = res.data
        const type = Object.prototype.toString.call(result);
        console.log(res, "--------------res");

        console.log(type, "--------------type");
     

        
         const DataList ={
          "Data": null,
          "Code": null,
          "ElapsedSeconds":null,
          "Message": "",
          "Version": null,
          "ActionId": null
        }


        // 如果是文件流 直接返回
          const { Code, Data, Message } = result;
          if(Message === "Mock" || res.config.headers['x-No-Encryption'] === "true" || type === '[object Blob]' || type === '[object ArrayBuffer]'){

            console.log('response success Mock:', res);
            if(type === '[object Blob]'){
              return res
            }else{
              return result
            }
           

          }else{
             // 解密響應數據
             const decryptedData = DecryptInit(result);         
             DataList.Data = decryptedData.Data;
             DataList.Code = decryptedData.Code;
             DataList.ElapsedSeconds = decryptedData.ElapsedSeconds;
             DataList.Message = decryptedData.Message;
             DataList.Version = decryptedData.Version;
             DataList.ActionId = decryptedData.ActionId;

             if(decryptedData.Code !== "0" && decryptedData.Code !== "2"){
                    //${DataList.Message} ${(DataList.Code ? `(Code: ${DataList.Code})` : '')}
                    ElMessageBox.alert(`${DataList.Message}`, 'Error', {
                      // 如果你想禁用自動聚焦
                      // autofocus: false,
                      confirmButtonText: '確定',
                      center: true,
                      // callback: (action) => {
                      //   ElMessage({
                      //     type: 'info',
                      //     message: "關閉",
                      //   })
                      // },
                    })
             }else if(decryptedData.Code == "2"){
                DataList.Message = decryptedData.Message;
             }




             

             console.log('decryptedData response success 解密:-----', decryptedData);
             console.log('response DataList 解密:-----', DataList);
             return DataList
          }
 
        return result

      },
      error => {
        if (error && error.response) {
          error.message = that.checkStatus(error.response.status)
        }
        const isTimeout = error.message.includes('timeout');

        console.log(isTimeout, "isTimeout");
        ElMessage({
          message: isTimeout ? '网络请求超时' : error.message || '连接到服务器失败',
          type: 'error',
          duration: 2 * 1000
        })
        console.log(error, "error.message");
        return Promise.reject(new Error(error.message))
      }
    )
  }

  request(options) {
    const instance = axios.create()
    const baseOpt = this.getConfig()
    const params = Object.assign({}, baseOpt, this.getParams(options))
   
    this.setInterceptors(instance)
    // console.log(params);
    return instance(params)
  }
}

const http = new HttpRequest()
export default http

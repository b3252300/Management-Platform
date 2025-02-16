import axios from 'axios'
import { ref,computed, onMounted, watch  } from "vue";
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
let DeviceId = localStorage.getItem('DeviceId')
if (!DeviceId) {
  localStorage.setItem("DeviceId", uuidv4());
}





class HttpRequest {
  // #baseUrl
  constructor() {
    this.baseUrl = getBaseUrl()
    // this.withCredentials = false
    this.timeout = 60 * 60 * 24 * 1000
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
        errMessage = '错误请求'
        break
      case 401:
        errMessage = '未授权，请重新登录';
        userStore.SET_TOKEN();
        router.push({ name: 'Login' })
        break
      case 403:
        errMessage = '拒绝访问'
        break
      case 404:
        errMessage = '请求错误,未找到该资源'
        break
      case 405:
        errMessage = '请求方法未允许'
        break
      case 408:
        errMessage = '请求超时'
        break
      case 500:
        errMessage = '服务器端出错'
        break
      case 501:
        errMessage = '网络未实现'
        break
      case 502:
        errMessage = '网络错误'
        break
      case 503:
        errMessage = '服务不可用'
        break
      case 504:
        errMessage = '网络超时'
        break
      case 505:
        errMessage = 'http版本不支持该请求'
        break
      default:
        errMessage = '连接错误'
    }
    return errMessage
  }

  // 拦截处理
  setInterceptors(instance) {
    const { EncryptInit, DecryptInit } = useCryptoJs();
    const that = this;

    // 請求攔截器
    instance.interceptors.request.use(
      (config) => {
        if (!navigator.onLine) {
          ElMessage.error("請檢查您的網路是否正常");
          return Promise.reject(new Error("網路異常"));
        }

        const currentMobile = router.currentRoute.value.meta.device === "line";
        const token = cookies.get(TOKEN);
    
        const list = {
          Token: currentMobile ? "" : token,
          ModuleId: "",
          DeviceId: localStorage.getItem("DeviceId"),
          Version: import.meta.env.VITE_Version,
          ActionId: uuidv4(),
          Language: "",
          Data: config.data,
        };
    
        if (config.headers['x-No-LiffToken'] === undefined && currentMobile) {
          const LiffIdToken = localStorage.getItem("LiffgetIDToken");
          if (!LiffIdToken) {
       

            return; // 提早返回，等待登入流程完成
          }
          list.Data.LineIdToken = LiffIdToken;
        }
    
        if (config.headers['x-No-Encryption'] === "true") {
          config.data = list;
          console.log("不加密的請求:", config);
          return config;
        } else {

            if(list.Data["LineIdToken"] == undefined || !list.Data["LineIdToken"]){
              console.log(list.Data["LineIdToken"] == undefined, "list.Data.LineIdToken 不存在");

        
              return
            }
    
          console.log(list.Data["LineIdToken"] == undefined, "list.Data.LineIdToken 存在");
          const encryptedData = EncryptInit(list);
          config.data = encryptedData;

          // 解密響應數據
          const decryptedData = DecryptInit(encryptedData);
          console.log('encryptedData success 解密 request:', decryptedData);

          return config;
        }
      },
      (error) => Promise.reject(error)
    );
    

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
        // console.log(res, "--------------res");

        // console.log(type, "--------------type");
     

        
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

             if(decryptedData.Code !== "0"){
              ElMessageBox.alert(`${DataList.Message} ${(DataList.Code ? `(Code: ${DataList.Code})` : '')}`, 'Error', {
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
             }
             




             

             console.log('decryptedData response success 解密:-----', decryptedData);
             console.log('response DataList 解密:-----', DataList);
             return DataList
          }

       

        // console.log('decryptedData response success 解密:', DecryptInit("QiWDSJ5U3Kpi2GB4PFN8UFA4nDtrfqBsJMX5YQPcBOZi0sUTxzJKMOuepJlPWO3vtUPFo3QnDs9YIj1S6tMXScIMJOpOldSwu4QdEL3CCOAMiZA6K3KtSNicsMC9Ssv3DCZUd7CesdN+xYyewHHEJfh+eY2RCDTY0WYC+5qF3LY="));
                
 
       

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

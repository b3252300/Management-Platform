import { ref, computed, watch } from "vue";
import router from '@/router'

import { ElMessage } from 'element-plus'
import liff from "@line/liff";
import { ElMessageBox } from 'element-plus'


export default function lifffunction(){
const isLoading = ref(false);
let LiffProfile = ref({});
let idToken = ref("");
let isLoggedIn = ref("");
const listDeveloper = ref({});
const currentMobile = router.currentRoute.value.meta.device == "line";
console.log(currentMobile, "currentMobile 進入line 平台");
let liffToken = "";



let getIDToken = ()=>{
  if(currentMobile){  
    if (liff.isLoggedIn()) {
      const token = ref(liff.getIDToken());
      watch(token, (item)=>{
          localStorage.setItem("LiffgetIDToken", item);    
          console.log(item, "-*------------------liff.getIDToken()");  
          },{ immediate: true });
      }else{
        liff.isLoggedIn()
      }

    
  }
};

//是mobile 才執行 liff
if(currentMobile){
liff.ready.then(() => {
  isLoading.value = true;
})

liff.init({
  liffId: import.meta.env.VITE_LIFF_ID, // Use own LIFF ID
})
.then(() => {

  // LIFF SDK 初始化成功
  if(import.meta.env.VITE_OPEN_LIFF === "true"){   
    isLoading.value = true;
    //liff 登入驗證
    if (!liff.isLoggedIn()) {
            // alert("用戶未登入");   
            console.log("與您的LINE繫結中，請稍後...");
            liff.login();


     } else {  
      console.log("已登入Liff");    
  
      getIDToken(); 
      

      listDeveloper.value = {
        lineVersion: liff.getLineVersion(), //回傳 LINE 版本
        getOS: liff.getOS(), //應用程式的環境
        Version: liff.getVersion(), //"取得 LIFF SDK 的版本"
        isInClient: liff.isInClient() //"確認是否在line 瀏覽器中執行"
      }

          isLoggedIn.value = liff.isLoggedIn(); //檢查用戶是否登入
          idToken.value = liff.getDecodedIDToken(); //個人資料資訊
   
          liffToken= liff.getIDToken();

          //個人資料資訊
          liff.getProfile()
            .then(profile => {
                LiffProfile.value = profile;                
          });
          


          

          // console.log(liff.getAppLanguage(), "語系");
          // console.log(liff.getVersion(),"取得 LIFF SDK 的版本");
          // console.log(liff.isInClient(),"確認是否在line 瀏覽器中執行");
          // console.log(liff.isLoggedIn(), "檢查用戶是否登入。");
          // console.log(liff.getOS(), "應用程式的環境");
          // console.log(liff.getContext());
          
       
     }
  }

}).finally(()=>{
  setTimeout(()=>{
    isLoading.value = false;
  });

});
}

const getLiffIDToken = () => {
  if (currentMobile && liff.isLoggedIn()) {
    const token = liff.getIDToken();
    if(token){
      return token;
    }
    liff.login({ redirectUri: import.meta.env.VITE_API_ROOT+"/line" });
 
  }
};



// 定義登出函式
const logout = () => {
//是mobile 才執行 liff  
  if(currentMobile){
    if (liff.isLoggedIn()) {
        liff.logout();
        liff.closeWindow();
     }
  }
};

const Lifflogin = ()=>{
  liff.login();
}


const LiffClose = ()=>{
  liff.closeWindow();
}


//呼叫Liff QRCode
const LiffScanCodeV2 = ()=>{
//是mobile 才執行 liff  
if(currentMobile){
  if(liff.isInClient()){
    liff
    .scanCodeV2()
    .then((result) => {
      // result = { value: "" }
    })
    .catch((error) => {
      console.log("error", error);
    });
  }else{
    ElMessage({
      message: '此裝置不支援',
      type: 'error',
      duration: 3 * 1000
    });
    setTimeout(()=>{
      liff.closeWindow();
    }, 3000);
    
 
  }
}
}


const textLiffMessages =ref("");
const LiffMessages = ()=>{

if (liff.isInClient()) {
  
  liff.sendMessages([
    {
      type: "text",
      text: textLiffMessages.value,
    },
  ])
  .then(() => {
    console.log("訊息已發送");
  })
  .catch((err) => {
    console.log("error", err);
  });

} else {
  ElMessageBox.alert(`${textLiffMessages.value}`, '通知', {
    confirmButtonText: '確定',
    center: true,
    callback: () => {
                  ElMessage({
                    type: 'info',
                    message: "目前不在 LINE App 內，部分功能可能無法使用",
                  })
                }
  })
  console.log(textLiffMessages.value, "textLiffMessages");
  console.warn('目前不在 LINE App 內，部分功能可能無法使用');
}
}




    return {  
      LiffProfile,
        idToken,   
        isLoggedIn,
        Lifflogin,
        liffToken,
        listDeveloper,
        LiffScanCodeV2,
        textLiffMessages,
        LiffMessages,
        logout,
        isLoading,
        getIDToken,
        getLiffIDToken,
        LiffClose
     

    }
}
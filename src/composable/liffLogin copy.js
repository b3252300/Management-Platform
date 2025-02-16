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
const token = ref(null); // 預設值為 null
const currentMobile = router.currentRoute.value.meta.device == "line";
console.log(currentMobile, "currentMobile 進入line 平台");



const getIDToken2 = () => {
  const token = ref(null); // 預設值為 null
  
  if (!currentMobile) {
    console.warn("非行動裝置或非 LINE 瀏覽器，無法執行 LIFF");
    return token; // 提前結束，避免執行不必要的程式碼
  }

  if (!liff.isLoggedIn()) {
    console.warn("尚未登入 LIFF，將跳轉至登入流程...");
    liff.login(); // 重導至登入
    return token; // 不再繼續執行
  }
}


//是mobile 才執行 liff
if(currentMobile){
liff.ready.then(() => {
  token.value = liff.getIDToken();
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
      getIDToken2();
      
     
      listDeveloper.value = {
        lineVersion: liff.getLineVersion(), //回傳 LINE 版本
        getOS: liff.getOS(), //應用程式的環境
        Version: liff.getVersion(), //"取得 LIFF SDK 的版本"
        isInClient: liff.isInClient() //"確認是否在line 瀏覽器中執行"
      }

          isLoggedIn.value = liff.isLoggedIn(); //檢查用戶是否登入
          idToken.value = liff.getDecodedIDToken(); //個人資料資訊
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


let getIDToken = ()=>{
  if(currentMobile){  
  
    const token = ref(liff.getIDToken());
    watch(token, (item)=>{
      localStorage.setItem("LiffgetIDToken", item);    
      console.log(item, "-*------------------liff.getIDToken()");  
    },{ immediate: true });    
  }
};



// const getIDToken2 = () => {
//   let token = ref(null); // 預設值為 null
//   token.value = liff.getIDToken();
//   // if (liff.isLoggedIn()) { // 確保使用者已登入 LIFF
//   //   token.value = liff.getIDToken();
//   // } else {
//   //   console.warn('尚未登入 LIFF');
//   //   router.push({ name: 'lineLoading' })
//   // }
//   return token;
// };



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
    console.log("message sent");
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
        listDeveloper,
        LiffScanCodeV2,
        textLiffMessages,
        LiffMessages,
        logout,
        isLoading,
        getIDToken,
        getIDToken2,
        LiffClose
     

    }
}
import liff from "@line/liff";
import router from '@/router'
import { ElMessageBox } from 'element-plus'

export default function useLiff() {
  const liffId = import.meta.env.VITE_LIFF_ID;  
  let liffSystem = ""
  let lineVersion = ""
  let liffVersion = ""
  let isLoggedIn = ""

  


const lineInitGetBasicData = async () => {
 const currentMobile = router.currentRoute.value.meta.device == "line";
 const OPEN_LIFF =  import.meta.env.VITE_OPEN_LIFF === "true";

    try {
        if(OPEN_LIFF){   
            const isInClient = await liff.isInClient(); // 判斷LIFF APP是否透過Line內部瀏覽器開啟。
            liffSystem = liff.getOS();
            lineVersion = liff.getLineVersion();
            liffVersion = liff.getVersion();

            let liffIdToken = "";
            let userId = "";

   
            if(currentMobile){
              await liff.init({ liffId: liffId })

              if (liff.isLoggedIn() || isInClient) {
                  isLoggedIn =  liff.isLoggedIn();
                  liffIdToken =  await liff.getIDToken();
                  // console.log("liff.getIDToken()--------", liffIdToken);
                  // console.log("liff.isInClient()--------", isInClient);

                  let isId = await liff.getProfile();
                  userId = isId.userId;

       
              }else{
                    liff.login();
              }

            }
            const Lifflogin =  async ()=>{
                await liff.login();
            }

            return {  isLoggedIn, Lifflogin, liffIdToken,  userId, liffSystem, lineVersion, liffVersion, isInClient };
        }

    } catch (error) {
      console.log(error);
    }

    return

  };

  const LiffClose = ()=>{
    const  isInClient = liff.isInClient(); // 判斷LIFF APP是否透過Line內部瀏覽器開啟。
    if(isInClient){
     liff.closeWindow();
    }
  }

  const liffCloseWindow = (txt) => {
  
    const  isInClient = liff.isInClient(); // 判斷LIFF APP是否透過Line內部瀏覽器開啟。

   
    if(isInClient){
      // setTimeout(() => liff.closeWindow(), 2000);

      liff.sendMessages([
          {
            type: "text",
            text: txt,
         },
      ]).then(() => {
        console.log("message sent");
        liff.closeWindow();
      
      }).catch((err) => {
        console.log("error", err);

        ElMessageBox.alert(`無法發送訊息至LINE聊天室`,  {       
          confirmButtonText: '確定',
          showClose: false,
          center: true            
        }).finally(() => {
          liff.closeWindow();
        });

      })
     
    }

  };


  return { lineInitGetBasicData, liffCloseWindow, LiffClose };
}

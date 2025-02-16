import liff from "@line/liff";
import router from '@/router'
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'

export default function useLiff() {
  const liffId = import.meta.env.VITE_LIFF_ID;
  let isInClient = ""
  let liffSystem = ""
  let lineVersion = ""
  let liffVersion = ""
  let liffIdToken = "";


  const lineInitGetBasicData = async () => {
const currentMobile = router.currentRoute.value.meta.device == "line";
const OPEN_LIFF =  import.meta.env.VITE_OPEN_LIFF === "true";
    try {
      isInClient = liff.isInClient(); // 判斷LIFF APP是否透過Line內部瀏覽器開啟。
      liffSystem = liff.getOS();
      lineVersion = liff.getLineVersion();
      liffVersion = liff.getVersion();
      let liffIdToken = "";
      if(currentMobile && OPEN_LIFF){
        await liff
          .init({ liffId: liffId })
          .then(() => {
            if (liff.isLoggedIn()) {

            liffIdToken = liff.getIDToken();
            console.log(liffIdToken , "Liff");
            }else{
              liff.login();
            }
          })
          .catch((err) => {
            console.log(err.code, err.message);
          });

        }

  const textLiffMessages = ref("");
  const LiffMessages = async () => {
    if (liff.isInClient()) {
      try {
        await liff.sendMessages([
          {
            type: "text",
            text: textLiffMessages.value,
          },
        ]);
        console.log("訊息已發送");
      } catch (err) {
        console.error("發送訊息錯誤：", err);
      }
    } else {
      ElMessageBox.alert(`${textLiffMessages.value}`, '通知', {
        confirmButtonText: '確定',
        center: true,
        callback: () => {
          ElMessage({
            type: 'info',
            message: "目前不在 LINE App 內，部分功能可能無法使用",
          });
        },
      });
      console.warn('目前不在 LINE App 內，部分功能可能無法使用');
    }
  };
  const LiffClose = async ()=>{
    await liff.closeWindow();
  }

    return { textLiffMessages, LiffMessages, LiffClose, liffIdToken, liffSystem, lineVersion, liffVersion };


    } catch (error) {
      console.log(error);
    }

  return
  };



  return { lineInitGetBasicData };
}

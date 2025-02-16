import { version } from '@/api/common.js';
import { encryptStorage } from "@/utils/EncryptStorage";
import { ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router';

export function useVersion() {
  let params = {};
  const countKey = "reloadCount"; // 用於存儲重新整理次數的 key
  let count = parseInt(localStorage.getItem(countKey)) || 0; // 從 localStorage 獲取次數，默認為 0
  const route = useRoute();

  //取得 Aes key
  const AES_KEY = encryptStorage.getItem('AES_KEY');
  // if (AES_KEY && import.meta.env.MODE != "development") {
  if (AES_KEY && import.meta.env.MODE != "development" && import.meta.env.MODE != "devsite") {
    version(params)
      .then((res) => {
        console.log(res, "判斷版本號");
        const { Data, Code } = res; // 使用可選鏈接，避免解構錯誤

        if (!Data) {
          ElMessageBox.alert(`偵測版本更新`, {
            autofocus: false,
            showClose: false,
            confirmButtonText: '確定',
            center: true
          }).then((res) => {
            window.location.reload();//刷新當前頁
          });
          // window.location.reload(); // 執行重新整理
          // localStorage.setItem(countKey, count); // 更新 localStorage 中的次數
          // if (count < 2) {
          //   count++; // 增加重新整理次數
          //   localStorage.setItem(countKey, count); // 更新 localStorage 中的次數
          //   // history.go(0);
          //   window.location.reload();//刷新當前頁
          //   // window.location.reload(); // 執行重新整理
          // }
          //  

          return;

        }




      })
      .catch((error) => {
        console.error("發生錯誤", error);
      });
  }


}

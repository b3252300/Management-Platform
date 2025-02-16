//AES 加解密設定

import CryptoJS from "crypto-js";
import { encryptStorage } from "@/utils/EncryptStorage";


export default function useCryptoJs() {

  let AesKey = "";
  let AesIV = "";

  if(encryptStorage.getItem('AES_KEY')){
    const AES_KEY =   JSON.parse(encryptStorage.getItem('AES_KEY'));
    AesKey = AES_KEY.AesKey;
    AesIV = AES_KEY.AesIV;
  }


 // 加密
  const EncryptInit = (data) => {
    const input = typeof data === "string" ? data : JSON.stringify(data);
    const Encrypt = CryptoJS.AES.encrypt(
      input,
      CryptoJS.enc.Utf8.parse(AesKey),
      {
        iv: CryptoJS.enc.Utf8.parse(AesIV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();

    return Encrypt;
  };


  // 解密
  const DecryptInit = (data) => {
    try {
      const decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(AesKey), {
        iv: CryptoJS.enc.Utf8.parse(AesIV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);
  
      if (!decrypted) throw new Error("解密結果為空，可能是密文格式不正確。");
  
      const Decrypt = JSON.parse(decrypted);
      return Decrypt;
      
    } catch (error) {
      console.error("Decryption failed:", error.message);
      return null;
    }
  };

  return { EncryptInit, DecryptInit };
}

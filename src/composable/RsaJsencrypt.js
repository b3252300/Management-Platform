import { JSEncrypt } from 'jsencrypt'
import { v4 as uuidv4 } from "uuid";
import { Register } from '@/api/common.js';
import { encryptStorage } from "@/utils/EncryptStorage";
import { ElMessage } from 'element-plus'
// import {  version } from '@/api/common.js';
//uuid
// let DeviceId = localStorage.getItem('DeviceId')
// if (!DeviceId) {
//   localStorage.setItem("DeviceId", uuidv4());
// }





//取得 Aes key
const AES_KEY = encryptStorage.getItem('AES_KEY');


if(!AES_KEY || AES_KEY === null){

//生成公私鑰
let  jSEncryptObj  = new JSEncrypt();
jSEncryptObj.getKey();
const publicKey = jSEncryptObj.getPublicKey(); //公鑰
const privateKey = jSEncryptObj.getPrivateKey();//私鑰


//RSA加密
var encryptor  = new JSEncrypt();
// var publicKey  = "-----BEGIN PUBLIC KEY----- MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHHp2rUMD+XEgsvaWvkpn1TxdLyz sl2T/rk/sdAGV7J5nK2N06TnfEFJzMVOQvLEfmFexT9VclbZGEQpw6u5MFURclJI x+cjOhb6v7PxmuOikaJaApJYhKc/iyE+QJo7ojnn8lttpRCNKowg/eW2zDtDt++q Y1mYGCYuZ1+T7NO/AgMBAAE= -----END PUBLIC KEY-----"
encryptor.setPublicKey(publicKey) ////设置公钥
let rsaPassWord   = encryptor.encrypt('abcd');//要加密的内容
// console.log(rsaPassWord, "rsa 加密");


//RSA 解密
var decrypt = new JSEncrypt()//创建解密对象实例
// var priKey  = '-----BEGIN RSA PRIVATE KEY----- MIICWwIBAAKBgHHp2rUMD+XEgsvaWvkpn1TxdLyzsl2T/rk/sdAGV7J5nK2N06Tn fEFJzMVOQvLEfmFexT9VclbZGEQpw6u5MFURclJIx+cjOhb6v7PxmuOikaJaApJY hKc/iyE+QJo7ojnn8lttpRCNKowg/eW2zDtDt++qY1mYGCYuZ1+T7NO/AgMBAAEC gYBr2yQ9b+JNhzbglSq15/b4knYZhXtIpyvzcp+Fe7vlPMhge3z9EkDQAHRmDKfO /MU8pGLWiKzuFjensnOWUI21da2/FXqV5jQFZUl5u2BJBHyePCzQ7pSXWs6Ouqx8 gTaZZzRA9/Prv23vIDJNOujpA+on/lgaBfayqtr1cafkAQJBAMtkSQD7bk1fG2Ez 0qXNORsKK7WJt/QZdQaQ6/LKhloZLoZtsRiBQka3UqCXrvjhc5lwrxGsVRfYEApU ylH334ECQQCPYLWmanvmy5q1nxfACYSvvQ04+ucvHCzcn2gAUCRs//c1K3QKCMa4 RqQyUjDQAuPdOWx9lbKsko/0UyOFdlM/AkACzjdTlCRJXO57wMM/Fj2baeCAeI3Z CCDdHlKi3rhLtd02bXzr4ZyQbSbuoCkBtdpqW2uOytnBonFWMyU3TDwBAkAQ+qHo WDneBgSHN5Tnb/kfmqLDOatA//QsGFCHoPX/Vnye9ktimNF3px3wu5z+NSlo3FEF ukGTgDO9+k59kpqfAkEAjxmx25WZrbbpDmY94po5vo4PuU2UIGmEuR3Pmaoc2thj GSSN5GMqRpqHSQZqSjrECzbPE0dtXUN7jo2qhqxyDA== -----END RSA PRIVATE KEY-----'
decrypt.setPrivateKey(privateKey)//设置秘钥
var uncrypted = decrypt.decrypt(rsaPassWord)//解密之前拿公钥加密的内容
// console.log(uncrypted, "rsa 解密");



//  let params = { 
//   "RsaPublicKey":publicKey,
//   "DeviceId":DeviceId
//  };

// Test(params)
//   .then((res) => {
 
//     var resRSA = decrypt.decrypt(res);
//     localStorage.setItem("AES_KEY", resRSA);   
    
//     console.log(res, "res 後端資料回傳，未解密");
//     console.log(resRSA, "res 後端資料回傳，解密");
//     // console.log(uncrypted, "產出內容");
//   })
//   .finally((err) => {

//   });


// DeviceId = localStorage.getItem('DeviceId');
// let params = { 
//   "Token": "",
//   "ModuleId": "",
//   "DeviceId": DeviceId,
//   "Data": {
//     "RsaPublicKey": publicKey
//   }
//  };
 let params = { 
  "RsaPublicKey": publicKey
 };

 Register(params)
  .then((res) => {
   
    var resRSA = decrypt.decrypt(res); // res 後端資料回傳，解密
    encryptStorage.setItem("AES_KEY", resRSA);   
    // alert(resRSA);

    
    console.log(res, "res 後端資料回傳，未解密");

    console.log(resRSA, "res 後端資料回傳，解密");
    // console.log(uncrypted, "產出內容");
    // alert("正在取得AES");
  })
  .catch((err) => {
    alert(err);
    ElMessage({
      message: isTimeout ? '网络请求超时' : err.message || '註冊失敗',
      type: 'error',
      duration: 2 * 1000
    })
    console.error(err, "註冊失敗")
  })
  .finally((err) => {

  });
}





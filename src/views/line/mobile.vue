<template>

<div class="title">與您的LINE連結中，請稍後</div>


</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import useLiff from '@/composable/useLiff.js';
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { encryptStorage } from "@/utils/EncryptStorage";
import  "@/composable/RsaJsencrypt.js";

// liff 設定
const liff = useLiff(); // 先呼叫函式取得返回的物件
const { lineInitGetBasicData } = liff;

const router = useRouter();
const route = useRoute();



//http://localhost:9528/line?action=Outpatient

//取得 Aes key
const AES_KEY = encryptStorage.getItem('AES_KEY');

onMounted(async ()=>{
    if(import.meta.env.VITE_OPEN_LIFF === "true"){  
    const { isLoggedIn, Lifflogin, isInClient } = await lineInitGetBasicData();
    console.log(isLoggedIn, "isLoggedIn");
    console.log(isInClient, "isInClient");

    if(isLoggedIn || isInClient){
        if(AES_KEY){
            console.log(route.query, "route.query")
        if(route.query['action'] == "Outpatient"){
            //門診掛號
            router.push({ name: 'Outpatient' }) 
              // http://192.168.26.194:9528/line?action=Outpatient
        }else if(route.query['action'] == "QueryCancellation"){
            //查詢取消
            router.push({ name: 'QueryCancellation' }) 
            // http://192.168.26.194:9528/line?action=QueryCancellation

        }else{
            router.push({ name: 'lineLogin' }) 
        }
//https://localhost:7033/api/line/LiffRedirect
     }

    }else{
        Lifflogin();
    }
}
});
     




</script>

<style lang="scss" scoped>

.title {
    font-size: 20px;
    line-height: 1.4;
    letter-spacing: 2px;
    margin-bottom: 8px;
    text-align: center;
    font-weight: 500;


}
</style>

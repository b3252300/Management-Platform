<template>
    <div>
        13
        {{ kk }}

    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import useLiff from '@/composable/useLiff.js';

const liff = useLiff(); // 先呼叫函式取得返回的物件
const { lineInitGetBasicData } = liff;


onMounted(async () => {
  const { liffIdToken, LiffMessages, textLiffMessages } = await lineInitGetBasicData();
  console.log(liffIdToken, "liffIdToken");
  textLiffMessages.value= "123456";
  LiffMessages();
});
</script>



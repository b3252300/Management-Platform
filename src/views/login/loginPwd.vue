<template>
  <el-form ref="ruleForm" :model="form" :rules="rules" label-width="0" class="login-ruleForm">
    <el-form-item prop="StaffCode" :error="accountErrorText">
      <el-input
        ref="StaffCode"
        v-model="form.StaffCode"
        class="h40"        
        name="StaffCode"
        placeholder="請輸入帳號"
        :clearable="false"
        tabindex="1"
        type="text"
        maxlength="100"
        autocomplete="off"
        size="large"
      />
    </el-form-item>

    <el-form-item prop="password" :error="passwordErrorText" style="margin-bottom: 10px;">
      <el-input
        ref="password"
        v-model="form.password"
        class="h40"
        show-password
        name="password"
        placeholder="請輸入密碼"
        :clearable="false"
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
      
        @keyup.enter="loginHandle"
        size="large"
      />
    </el-form-item>
    <el-form-item>
        <el-checkbox label="記住我" v-model="remember">
          記住我
        </el-checkbox>
       
    </el-form-item>

    <el-form-item style="margin-bottom: 0">
      <BtnLoading title="登入" :isLoading="loading" @confirm="loginHandle" :isDisabled="isDisabled"/>
    </el-form-item>
  </el-form>
  <toast ref="toastRef" />

</template>

<script setup>
import { ref, onBeforeMount, reactive, watch, watchEffect } from 'vue';
import { encryptStorage } from "@/utils/EncryptStorage";
import { useUserStore, useAppStore } from '@/store';
import {  login } from '@/api/user';
import  BtnLoading from '@/components/loading/btnLoading.vue';
// import LoginFunction from '@/utils/login';
import toast from '@/components/toast/index.vue';
import { useRouter, useRoute } from 'vue-router';
import {  Info } from '@/api/manage';
import { ElMessage } from 'element-plus'

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const loading = ref(false);
const isDisabled = ref(true);
const ruleForm = ref();

const trigger = ['blur', 'change'];


const remember = ref(false);
const form = reactive({
  StaffCode: '',
  password: '',
});

if(encryptStorage.getItem("StaffCode")){
  form.StaffCode = encryptStorage.getItem("StaffCode")
}
if(encryptStorage.getItem("remember") === "true"){
  remember.value  = true
}


watch(remember, () => {
if (remember.value && form.StaffCode) {

  encryptStorage.setItem("StaffCode", form.StaffCode);
  encryptStorage.setItem("remember", remember.value);
} else {
  encryptStorage.removeItem("StaffCode");
  encryptStorage.removeItem("remember");
}
});

watchEffect(()=>{
  if(form.StaffCode && form.password){
    isDisabled.value = false;
  }else{
    isDisabled.value = true;
  }

});


const validateRequired = (rule, value, callback) => {
  if (value === '') {
    // note by chihhao
    // 登入表單非病人使用, 可以不加入多語系
    //toastRef.value.show({ text: 'User Name or Password is blank' })
    callback(new Error('必填'));
  } else {
    callback();
  }
};

const rules = {
  StaffCode: [{ required: true, validator: validateRequired, trigger }],
  password: [{ required: true, validator: validateRequired, trigger }],
};


onBeforeMount(() => {
  getQueryParams();
});

function getQueryParams() {
  const query = route.query;
}

const dialogRef = ref(null);

function loginHandle() {
  ruleForm.value.validate((valid) => {
    if (valid) {
      try {
        const params = {
          StaffCode: form.StaffCode,
          Passcode: form.password,

        };       
        login(params).then((res)=>{
          const { Code, Data, Message } = res;
          loading.value = true;     
          if(Code == 0){
            const { Token,  DisplayName } = Data;
            console.log(Data, "login");
            
            encryptStorage.setItem("Token", Token);
            encryptStorage.setItem("DisplayName", DisplayName);
           
            ElMessage({
            message: '登入成功',
            type: 'success',
            duration: 3 * 1000
          });
          router.push({ name: 'CaseTracking' })
        
          }       

        }).finally(()=>{
          loading.value = false;

        })

      } catch (e) {
        console.warn(e);
      }
  }
});
}

 //測試用
//  const params = {};
// Info(params).then((res)=>{
//   console.log(res, "2.1 門診-預帶資料(暫時)");
// })
// .catch((err) => {
//           console.error(err, "失敗")
// });
  



defineOptions({
  name: 'LoginPwd',
});
</script>

<style lang="scss" scoped>
::v-deep{
  .el-form-item__content{
    justify-content: space-between;
    a{
      color: $primary-color;
    }
  }
}

</style>

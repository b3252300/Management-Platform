<template>

          <div class="title">聯新關骨樂活吧</div>
          <div class="title">實名認證</div>

        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="民眾" name="case"></el-tab-pane>
            <el-tab-pane label="員工" name="second"></el-tab-pane>
        </el-tabs>
        <!-- <div class="description"></div> -->
  <el-form  ref="formRef" :rules="rules"  :model="formInline" class="mobile-form-inline" status-icon>
    <el-form-item prop="UserId" v-if="activeName === 'case'">
      <el-input v-model="formInline.UserId" size="large" :clearable="true"  placeholder="身分證字號"  clearable />
    </el-form-item>       
  <el-form-item v-if="activeName === 'case'">
    <el-date-picker
      v-model="formInline.Birthday"
      type="date"
      size="large"
      format="YYYY/MM/DD"
      value-format="YYYY-MM-DD"
      placeholder="生日"
      class="style-Calendar">
    </el-date-picker>
  </el-form-item>

  <el-form-item v-if="activeName === 'second'">
      <el-input v-model="formInline.EmployeeID" size="large" :clearable="true"  placeholder="請輸入6碼員工編號" clearable />
    </el-form-item>
    <el-form-item  v-if="activeName === 'second'">
      <el-input v-model="formInline.EipPassword"
         size="large"
         placeholder="請輸入EIP密碼" 
         show-password
         name="password"
         :clearable="true"
         tabindex="2"
         maxlength="16"
         type="password"
         autocomplete="off"
         clearable />
    </el-form-item>

    <div v-if="activeName === 'case'" class="user-material">
        確認即表示您已詳閱並同意<br>
        <a href="#">個人資料保護及資訊安全政策</a><br>
       
    </div>

     <el-form-item>
      <el-button type="primary" @click="onSubmit(formRef)" size="large"  class="w-100 btn_primary" :disabled="isDisabled">{{ titleLogin }}</el-button>
    </el-form-item>
    <el-form-item class="mb-0">
        <el-button  @click="onReset" size="large"  type="primary"   class="w-100 btn_plain_primary">返回</el-button>
    </el-form-item>
  </el-form>

</template>
<script setup>
import { ref, reactive, onMounted, watch   } from 'vue'

import {  RegisterStaff, RegisterPatient } from '@/api/lineUser';
import {  Info } from '@/api/manage';



// import  lifffunction from '@/composable/liffLogin.js'
// const {   textLiffMessages, LiffMessages, LiffClose   } = lifffunction();


 
const activeName = ref("case");
const description = ref("");
const titleLogin = ref("");
const isDisabled = ref(true);
const formRef = ref();
const formInline = reactive({
  UserId: '',
  Birthday: '',
  EmployeeID:'',
  EipPassword:''

})
let paramsList = {};


const onSubmit = (formEl) => {

  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      isDisabled.value = true;
      
      watch(activeName, (val)=>{
        console.log(val, "val-------------------------");
        if(val === "case"){
          textLiffMessages.value= "您好，已完成認證。\n後續請留意每日ERAS諮詢通知、收案通知,如有任何問題，請與我們聯繫。\nTEL：03-4941234 #2035";
          console.log(formInline.UserId !== "" && formInline.Birthday !== "", 'formInline.UserId !== "" && formInline.Birthday !== ""');
          //民眾實名認證
          if(formInline.UserId !== "" && formInline.Birthday ==""){

     
          paramsList ={
            "IdNo": formInline.UserId,
            "BirthDate": formInline.Birthday
            }
           console.log(val === "case", "val", paramsList);
          
          RegisterPatient(paramsList).then((res)=>{
            const { Code } = res; 
            console.log(res, "1.3 民眾實名認證");
            if(Code == "0"){        
                LiffMessages();
                LiffClose();                   
            }
          });
  
           }
        }else if(val === "second"){
          //員工實名認證
          textLiffMessages.value= "您好，已完成認證。\n後續請留意每日ERAS諮詢通知、收案通知,如有任何問題，請與我們聯繫。\nTEL：03-4941234 #2035";
          console.log(formInline.EmployeeID !== "" && formInline.EipPassword !== "", 'formInline.EmployeeID !== "" && formInline.EipPassword !== ""');

          
          if(formInline.EmployeeID !== "" && formInline.EipPassword !== ""){
          paramsList ={
            "StaffCode": formInline.EmployeeID,
            "Passcode": formInline.EipPassword
            }
            
           console.log(val === "case", "val", paramsList);
           RegisterStaff(paramsList).then((res)=>{          
            const { Code } = res; 
            console.log(res, "1.4 員工實名認證");
            if(Code == "0"){        
                LiffMessages();
                LiffClose();                   
            }
          });

        }


        }


      },{ immediate: true });
          formInline.UserId = "";
          formInline.Birthday = ""
          formInline.EmployeeID = "";
          formInline.EipPassword = "";
    } else {
      console.log('error submit!')
    }
  })
}

const onReset = () => {
  console.log('onReset!')
}

const descriptionFn = (val)=>{
  if(val == 'case'){
    titleLogin.value = "進行驗證";
    description.value = "我們將會同時建立會員資料，帳號為病歷留存手機，密碼為身分證字號"
}else{
  titleLogin.value = "登入";
  description.value = "歡迎聯新國際醫院照護團隊夥伴";
}
}

watch(activeName, (val)=>{
  descriptionFn(val)
},{ immediate: true });



watch(formInline, (val)=>{
  if((val.UserId  !== "" && val.Birthday !== "") || (val.EmployeeID  !== "" && val.EipPassword  !== "")){
    isDisabled.value = false
  }
  // if(val.EmployeeID !== "" && val.EipPassword !== ""){
  //   isDisabled.value = false
  // }
},{ immediate: true })



onMounted(() => {
      //行動裝置日期鍵盤關掉
      const inputElement = document.querySelector('.style-Calendar .el-input__inner');
      if (inputElement) {
        inputElement.setAttribute('inputmode', 'none');
      }
    });

// 驗證規則
const rules = {
  UserId: [      
        { 
          pattern: /^[A-Z][12]\d{8}$/, 
          message: '身分證字號格式不正確', 
          trigger: 'blur' 
        },
      ],
    };




const tableData = ref([]);




//  //測試用
// const params = {};
// Info(params).then((res)=>{
//   const { Code, Data, Message } = res; 
//   tableData.value = Data;
//   console.log(res, "2.1 門診-預帶資料(暫時)");
// })
// .catch((err) => {
//           console.error(err, "失敗")
// });
  


 

//  let    regex = /^[A-Z][12]\d{8}$/;
//  const aa = "H123456789";
//  console.log( regex.test(aa), "fff");
</script>
<style lang="scss" scoped>

.el-form-item{
  width: 100%;
}
.el-date-editor {
    --el-date-editor-width:100%;
}
::v-deep{
  .el-tabs__header{
    margin-bottom: 18px;
  }
}
::v-deep(.el-date-editor.el-input){
    width: 100%;
}

.logo{
  text-align: center;
  margin-bottom: 1vw;

}

.title {
    font-size: 20px;
    line-height: 1.4;
    letter-spacing: 2px;
    margin-bottom: 8px;
    text-align: center;
    font-weight: 500;

}
.description {
      color: #9F9F9F;
      font-size: 15px;
      line-height: 1.3;
      margin-bottom: 20px;
      width: 100%;
      letter-spacing: 2px;
      min-height: 39px;
  
    }

.user-material {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 20px;
    margin-top: 16px;
    a{
      color: #008CD6;
    }
}
</style>
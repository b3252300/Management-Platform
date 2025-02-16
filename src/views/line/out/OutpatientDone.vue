<template>
    <h1 class="page_titl_line" >
     
     <el-button class="btn_goback" text  circle @click="goBack" />
     <span>{{ $route.meta.title }}</span>
     </h1>
  
     門診掛號成功
    <el-descriptions   class="text-information" :column="1">
      <el-descriptions-item  label="日期">
        {{ GetDateYYYYMMDD(OutpatientList.ClinicDate) }}  
        ({{ parseTime(GetDateYYYYMMDD(OutpatientList.ClinicDate), '{a}') }}) 
        {{ isApn(OutpatientList.Apn) }}
      </el-descriptions-item>
      <el-descriptions-item label="院區">{{ OutpatientList.Campus }}</el-descriptions-item>
      <el-descriptions-item label="科別">
        {{ OutpatientList.DivisionName }}
        {{ OutpatientList.ClinicName }} 診
  
      </el-descriptions-item>
      <el-descriptions-item label="醫師">{{ OutpatientList.DoctorName }}</el-descriptions-item>
  
    </el-descriptions>  

  <div class="Instructions">
    <div class="title">就診說明</div>
    <div class="content">1.此診08:30開始。報到時08:30~12:15
最晚請於12:15之前向診間進行報到，逾報到        截止時間，將無法提供看診服務。

2.預約掛號後未能來院看診時，請於一天前取消      掛號。</div>
</div>


    <BtnLoading title="完成" :isLoading="loading" @confirm="onSubmit(formRef)" :isDisabled="isDisabled"/>   
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import Cookies from 'js-cookie';
  import { useRouter, useRoute  } from 'vue-router'
  import useDate from '@/utils/date.js';
  import { parseTime } from '@/utils/index.js';
  import { GetPatientInfo, OpdRegister } from '@/api/lineUser';
  import  BtnLoading from '@/components/loading/btnLoading.vue';
  const {  GetDateYYYYMMDD } = useDate();
  const router = useRouter();
  const route = useRoute();
  const isDisabled = ref(true);

  const loading = ref(false)
  const formRef = ref();



  const OutpatientList = JSON.parse(Cookies.get('outpatientVerifyData'));
console.log(outpatientVerifyData, "outpatientVerifyData");
  
  //看診時段 0:無 1:早 2:午 3:晚
  const isApn = (item)=>{
  if(item == 1){
    return "早診"
  }else if(item == 2){
    return "午診"
  }else if(item == 3){
    return "晚診"
  }else{
    return
  }
  }
  
  const outpatientVerifyData = JSON.parse(Cookies.get('outpatientVerifyData'));
console.log(outpatientVerifyData); // 顯示 Cookie 中的資料
  
  const onSubmit = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        loading.value = true;
    let params = {
      "IdNo":sizeForm.IdNo, //身分證字號
          "PatientName":sizeForm.PatientName, //姓名
          "Phone":sizeForm.Phone, //電話
          "BirthDate":sizeForm.BirthDate, //生日
          "DivisionCode": OutpatientList.value.DivisionCode, //科別代碼
          "ClinicCode": OutpatientList.value.ClinicCode, //診間代碼
          "DoctorCode": OutpatientList.value.DoctorCode, //醫生代碼
          "ClinicDate": OutpatientList.value.ClinicDate, //看診日期
          "Apn": OutpatientList.value.Apn, //看診時段 0:無 1:早 2:午 3:晚
    }
  OpdRegister(params).then((res)=>{
      const { Code, Data } = res; 
      console.log(res, "2.3 門診-掛號");
  
      if(Code == "0"){   
        loading.value = false;
        router.push({ name: 'OutpatientDone'});
      }
      }).finally(()=>{
      
      })
      } else {
        console.log('error submit!')
      }
    })
  }
  
  
  
  
  </script>
  
  
  <style lang="scss" scoped>
  
  ::v-deep{
      .el-date-editor {
      --el-date-editor-width:100%;
      }
      .el-descriptions__body{
    background-color: transparent;
  }
  .el-descriptions__body .el-descriptions__table .el-descriptions__cell{
      font-size: 16px;
      letter-spacing: 2px;
      &:last-child{
        padding-bottom: 0;
      }
  
  }
  }
  
  
  .text-information {
      background: #F4FFDD;
      padding: 12px 16px;
      border: solid #8FC31F thin;
      margin-bottom: 20px;
  
  }
  
  </style>
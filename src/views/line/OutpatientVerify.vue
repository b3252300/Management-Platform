<template>
  <h1  class="page_titl_line">
    <template   v-if="registereding" class="page_titl_line">
      <el-button class="btn_goback" text  circle @click="goBack" />
      <span>{{ $route.meta.title }}</span>
    </template>
   </h1>


  <el-descriptions v-if="registereding"   class="text-information" :column="1">
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

<div v-else class="registered_Done">
  <h3 class="registered_Done_title">門診掛號成功</h3>
  <el-descriptions   class="text-information" :column="1">

    <el-descriptions-item  label="日期">
      {{ GetDateYYYYMMDD(tabledata.ClinicDate) }}  
      ({{ parseTime(GetDateYYYYMMDD(tabledata.ClinicDate), '{a}') }}) 
      {{ isApn(tabledata.Apn) }}
    </el-descriptions-item>
    <el-descriptions-item label="科別">
      {{ tabledata.DivisionName }}
      {{ tabledata.ClinicName }} 診
    </el-descriptions-item>
    <el-descriptions-item label="診號">{{ tabledata.ViewNumber }}</el-descriptions-item>

    <el-descriptions-item label="醫師">{{ tabledata.DoctorName }}</el-descriptions-item>
    <el-descriptions-item label="地點">{{ tabledata.Location }}</el-descriptions-item>
    <el-descriptions-item label="建議看診時間">{{ GetHHmm(tabledata.EstimatedTime) }}</el-descriptions-item>
  </el-descriptions>
</div>




 <el-form v-if="registereding" 
     ref="formRef"
    :rules="rules"
    :model="sizeForm"
    label-width="auto"
    :label-position="labelPosition"
    size="large">
    <el-form-item label="身分證字號" prop="IdNo"> 
      <el-input v-model="sizeForm.IdNo"  placeholder="身分證字號"/>
    </el-form-item>
    <el-form-item label="姓名" prop="PatientName"> 
      <el-input v-model="sizeForm.PatientName" placeholder="姓名"/>
    </el-form-item>
    <el-form-item label="生日" prop="BirthDate">
           <!-- <el-date-picker
             v-model="sizeForm.BirthDate"
             type="date"
             size="large"
             format="YYYY/MM/DD"
             value-format="YYYY-MM-DD"
             placeholder="生日 範例:1999/01/01"
             class="style-Calendar">
           </el-date-picker> -->
    <el-date-picker   v-if="isMobileDeviceView" 
      v-model="sizeForm.BirthDate"
      :clearable="false"
      type="date"
      size="large"
      format="YYYY/MM/DD"
      value-format="YYYY/MM/DD"
      placeholder="範例:1991/01/01"
      :default-value="dataDate"
      :class="[{'is-error': formInlineErrors} , 'style-Calendar']">
    </el-date-picker>
    <el-input  v-else 
      v-model="sizeForm.BirthDate"
      size="large"
      placeholder="範例:1991/01/01"
      ref="birthdayInput"
      class="input-with-select">   
      <template #suffix>
        <el-button class="btn_Calendar" :icon="Calendar">
       
          <input        
          v-model="dataDate" 
        
          @change="onChange"  
          type="date"/>
        </el-button>
      </template>
    </el-input>
    <!-- <el-input v-else
      v-model="sizeForm.BirthDate"
      ref="birthdayInput"
      format="YYYY/MM/DD"
      :clearable="false"
      type="date"
      value-format="YYYY/MM/DD"
      size="large"
      @change="onChange"
      :suffix-icon="Calendar"
      :class="[{'is-error': formInlineErrors} , 'style-Calendar', {'text-black':blackColor}]"
      placeholder="" :data-date="dataDate"/> -->



    </el-form-item>
    <el-form-item label="聯絡電話" prop="Phone"> 
      <el-input v-model="sizeForm.Phone" type="text" placeholder="聯絡電話"/>
    </el-form-item>


  
    <el-form-item  class="mb-2" style="padding-top: 4px;">
      <BtnLoading title="我要掛號" :isLoading="loading" @confirm="onSubmit(formRef)" :isDisabled="isDisabled"/>    
    </el-form-item>
    <el-form-item class="mb-0">
        <el-button  @click="onReset" size="large"  type="primary"   class="w-100 btn_plain_primary" >返回</el-button>
    </el-form-item>
 </el-form>


 <el-descriptions v-else   class="RemarkList" title="就診說明"  :column="1">
    <el-descriptions-item class="mb-1" v-for="item in Remark">    
      {{ item }}
    </el-descriptions-item>
  </el-descriptions>
  <BtnLoading v-if="!registereding" title="完成"  @confirm="onFinish()" :isDisabled="false"/>    
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute  } from 'vue-router'
import useDate from '@/utils/date.js';
import { parseTime } from '@/utils/index.js';
import { GetPatientInfo, OpdRegister } from '@/api/lineUser';
import  BtnLoading from '@/components/loading/btnLoading.vue';
import { Calendar } from '@element-plus/icons-vue'
import { ElLoading } from 'element-plus'
import svgLoading from '@/composable/svgLoading.js'
//liff
import useLiff from '@/composable/useLiff.js';
const liff = useLiff(); // 先呼叫函式取得返回的物件
const { LiffClose } = liff;
let Statsloading = ref(false);

const {  GetDateYYYYMMDD, GetHHmm, GetDateTimeYYYYMMDDApi } = useDate();
const router = useRouter();
const route = useRoute();
const isDisabled = ref(true);
const labelPosition = ref('top')
const loading = ref(false)
const formRef = ref(null);
const registereding = ref(true);

//客製生日
const dataDate = ref("");
const birthdayInput = ref(null);
const blackColor = ref(false);


const sizeForm = reactive({
  IdNo: '',
  PatientName: '',
  BirthDate: '',
  Phone: ''
});

const OutpatientList = ref([]);
if(history.state.plan){
  OutpatientList.value = JSON.parse(history.state.plan);
}









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


const rules = reactive({
    IdNo: [
        { required: true, message: '不可空白', trigger: 'blur' },
        {  pattern: /^[A-Z][12]\d{8}$/,  message: '身分證字號格式不正確', trigger: 'blur' },      
    ],
    PatientName:[
        { required: true, message: '不可空白', trigger: 'blur' }
    ],
    BirthDate:[    
        { required: true, message: '不可空白' },
        {   message: '格式不正確', pattern: /^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/}
    ],
    Phone:[
    { required: true, message: '不可空白', trigger: 'blur' },
    {  trigger: 'blur', message: '聯絡電話格式不正確', pattern: /^\+?[\d()\-\s]+$/}
    ]
});




watch(sizeForm, (val)=>{
  if(val.IdNo  !== "" && val.PatientName !== "" && val.BirthDate !== "" &&   (val.Phone !== null && val.Phone !== "")){
    console.log(val.IdNo  !== "", "val.IdNo  !== ''");
    console.log(val.PatientName  !== "", "val.PatientName  !== ''");
    console.log(val.BirthDate  !== "", "val.BirthDate  !== ''");
    console.log( !val.Phone, "val.Phone0  !== ''");
    isDisabled.value = false
  }else{
    isDisabled.value = true
  }
  // if(val.EmployeeID !== "" && val.EipPassword !== ""){
  //   isDisabled.value = false
  // }
},{ immediate: true })



function onReset(){   
    router.push({ name: 'OutpatientIndex'})

}

onMounted(() => {
      //行動裝置日期鍵盤關掉
      // const inputElement = document.querySelector('.style-Calendar .el-input__inner');
      // if (inputElement) {
      //   inputElement.setAttribute('inputmode', 'none');
      // }

    //  const plan = JSON.parse(route.query.plan); // 將字串反序列化為物件
    //   console.log(plan, "反序列化的物件");      
});

const goBack = () => {
  loading.value = true;
  router.push({ name: 'OutpatientIndex'})
  console.log('go back')
}
const tabledata =ref();
// const tabledata =ref({
//     "IdNo": "",
//     "PatientName": "",
//     "BirthDate": "",
//     "Location": "門診大樓/3樓",
//     "Number": 33,
//     "EstimatedTime": "2024-11-26T11:40:00",
//     "Remark": "此診報到時間12:15結束，最晚請於12:15之前向診間進行報到。逾報到截止時間，將無法提供看診服務。\n●預約掛號後未能來院看診時，請於一天前取消掛號。",
//     "DivisionName": "骨科",
//     "ClinicDate": "2024-11-26T00:00:00",
//     "Apn": 1,
//     "ClinicCode": "000303",
//     "ClinicName": "303",
//     "DoctorName": "鄭向恆"
//   });

 


// list.forEach((item, index) => {
//   Remark.value += `${index + 1}. ${item}<br>`; // 累加結果並換行
// });

// console.log(Remark.value);
// 預設值為當前年份 -30
onMounted(() => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 30);
  nextTick(() => {
    dataDate.value = GetDateTimeYYYYMMDDApi(today);
  });

});

const onChange = ()=>{

  blackColor.value = true;
  sizeForm.BirthDate = GetDateYYYYMMDD(dataDate.value);
  if(sizeForm.BirthDate == 'Invalid date'){
    sizeForm.BirthDate= "";
    blackColor.value = false;
  }
}



let paramsList = {}
GetPatientInfo(paramsList).then((res)=>{
    const { Code, Data } = res; 
    console.log(res, "2.2 門診-預帶資料");
    Statsloading.value = ElLoading.service({
    lock: false,
    svg:svgLoading,
    text: 'loading',
    background: 'transparent',
  })
    if(Code == "0"){        
      sizeForm.IdNo = Data.IdNo !== null ? Data.IdNo : sizeForm.IdNo;
      sizeForm.PatientName = Data.PatientName;
      sizeForm.BirthDate = Data.BirthDate ? GetDateYYYYMMDD(Data.BirthDate) : "";
      sizeForm.Phone = Data.Phone;
      blackColor.value = true;
      onMounted(() => {
        nextTick(() => {
            dataDate.value = GetDateTimeYYYYMMDDApi(sizeForm.BirthDate); 
        });
      });
      if(sizeForm.BirthDate == 'Invalid date'){
          sizeForm.BirthDate= "";
          blackColor.value = false;
        }  
    }
    }).finally(()=>{
      Statsloading.value.close()
})


const Remark = ref();

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

    if(Code == 0){   
      loading.value = false;
      tabledata.value = Data;
      registereding.value = false;
      if(tabledata.value?.Remark){
        Remark.value = tabledata.value.Remark.split("\n");
      }
   
    }

    }).finally(()=>{
      loading.value = false;
    })
    } else {
      console.log('error submit!')
    }
  })
}

const onFinish = ()=>{

  LiffClose();
}

import mobilefunction from '@/utils/mobile.js';
const {  isMobileDevice } = mobilefunction();
const isMobileDeviceView = ref();
if (isMobileDevice()) {
  isMobileDeviceView.value = false
  console.log("is mobile device");
} else {
  isMobileDeviceView.value = true
  console.log("not mobile device");
}
</script>


<style lang="scss" scoped>
.btn_Calendar{
  position: relative;
  border: none;
  padding-right: 0;
  &:hover{
    background-color: transparent;
  }
  input {
    width: 100%;
    height: 100%;
    opacity: 0;
}
::v-deep{
  > span{
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
  }
>.el-icon {
    pointer-events: none;
    svg path{
      fill: #a8abb2;
    }
}
}



}
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

.RemarkList{
  ::v-deep{
    .el-descriptions__title {
      color: #333333;
      font-size: 15px;
      font-weight: normal;
    }
    span.el-descriptions__content {
        margin-bottom: 12px;
        font-size: 15px;
        display: flex;
    }
  }
  }
.text-information {
    background: #F4FFDD;
    padding: 12px 16px;
    border: solid #8FC31F thin;
    margin-bottom: 20px;

}
.registered_Done_title{
  font-size: 24px;
  font-weight: 500;
  color: #008CD6;
  text-align: center;
  margin-bottom: 20px;
}
.style-Calendar{
  &.text-black{
    ::v-deep{
    .el-input__inner{
      &:before {
        color: #333;
      }
      
      }
     }
    
  }
  ::v-deep{
    .el-input__inner{
      text-align: left;
      color: transparent;
      &:before {
        content: attr(data-date); 
        position: absolute;
        font-size: inherit;
        top: 2px;
        pointer-events: none;
        left: 3%;
        color: #A8ABB2;
        background: #fff;
      }
    }
    .el-input__suffix-inner{
        display: none;
    }
  }

}
</style>
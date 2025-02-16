<template>

          <div class="title">聯新關骨樂活吧</div>
          <div class="title">實名認證</div>

        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="民眾" name="case"></el-tab-pane>
            <el-tab-pane label="員工" name="second"></el-tab-pane>
        </el-tabs>
        <!-- <div class="description"></div> -->

<el-form  ref="formRef" :rules="rules"  :model="formInline" class="mobile-form-inline">
    <el-form-item prop="UserId" v-if="activeName === 'case'">
      <el-input   :class="{ 'is-error': formInlineErrors }"  @focus="onfocus" v-model="formInline.UserId" size="large" :clearable="true"  placeholder="身分證字號"  clearable />
    </el-form-item>    

    
  <el-form-item  prop="Birthday" v-if="activeName === 'case'" style="margin-bottom: 10px;">
    <!-- <el-input
    v-model="formInline.Birthday"
    @focus="onFocus"
    @blur="onBlur"
    :type="inputType"
    size="large"
    format="YYYY/MM/DD"
    value-format="YYYY/MM/DD"
    :placeholder="currentPlaceholder"
    :suffix-icon="Calendar"
    :class="[{'is-error': formInlineErrors}, 'style-Calendar']"/>
 -->

    <el-date-picker v-if="isMobileDeviceView"  
      v-model="formInline.Birthday"
      @focus="onfocus"
      :clearable="false"
      type="text"
      size="large"
      format="YYYY/MM/DD"
      value-format="YYYY/MM/DD"
      placeholder="範例:1991/01/01"
      :class="[{'is-error': formInlineErrors} , 'style-Calendar']"
      :default-value="dataDate">


    </el-date-picker>

    <!-- <el-input v-else
      v-model="formInline.Birthday"
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
    <el-input  v-else 
      v-model="formInline.Birthday"
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
  </el-form-item>


  <el-form-item v-if="activeName === 'second'">
      <el-input @focus="onfocus" v-model="formInline.EmployeeID" size="large" 
       :clearable="true"  
       placeholder="請輸入6碼員工編號" 
       :class="{ 'is-error': formInlineErrors }" 
       clearable />
    </el-form-item>
    <el-form-item  v-if="activeName === 'second'"  style="margin-bottom: 10px;">
      <el-input v-model="formInline.EipPassword"
         @focus="onfocus"
         :class="{ 'is-error': formInlineErrors }" 
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
    <div class="form-item__error">{{ Messages_error }}</div>

    <div v-if="activeName === 'case'" class="user-material">
        確認即表示您已詳閱並同意<br>
        <a href="#" @click.prevent="dialogTableVisible = true">個人資料保護及資訊安全政策</a><br>
       
    </div>

     <el-form-item style="margin-top: 20px; margin-bottom: 20px;">
      <BtnLoading v-if="activeName === 'second'" :title="titleLogin" :isLoading="loadingStaff" @confirm="onSubmitStaff(formRef)" :isDisabled="isDisabled" class="w-100 btn_primary"/> 
      <BtnLoading v-if="activeName === 'case'" :title="titleLogin" :isLoading="loadingPatient" @confirm="onSubmitPatient(formRef)" :isDisabled="isDisabled" class="w-100 btn_primary"/> 
      <!-- <el-button  v-if="activeName === 'second'" type="primary" @click="onSubmitStaff(formRef)" size="large"  class="w-100 btn_primary" :disabled="isDisabled">{{ titleLogin }}</el-button>
      <el-button  v-if="activeName === 'case'" type="primary" @click="onSubmitPatient(formRef)" size="large"  class="w-100 btn_primary" :disabled="isDisabled">{{ titleLogin }}</el-button> -->
    </el-form-item>
    <!-- <el-form-item class="mb-0">
        <el-button  @click="onReset" size="large"  type="primary"   class="w-100 btn_plain_primary">返回</el-button>
    </el-form-item> -->
  </el-form>

<el-dialog v-model="dialogTableVisible" class="container-dialog"  title="隱私權保護政策" @close="resetScrollTop"  style="max-width: 768px; width: 90%;">
  <el-scrollbar  ref="scrollbarRef" style="height:75vh">
    親愛的會員，您好：
    感謝您使用「專家視訊諮詢」服務，以下為專家視訊諮詢會員使用規範，使用服務前請務必閱讀。
<ol>
  <li>預約<br>為維護諮詢服務品質，專家視訊諮詢一次僅服務一人。視訊諮詢時間開始前4小時，無法進行預約。
預約提醒</li>
</ol>
<ol>
  <li>預約提醒<br>預約專家視訊諮詢成功後，可至「預約紀錄」查看您的預約，本APP會在視訊諮詢時間前24小時、前1小時、前10分鐘與前1分鐘推播通知提醒您，請您務必記得您預約的時間。
</li>
</ol>
<ol>
  <li>開始諮詢<br>預約專家視訊諮詢時間開始前1分鐘，即可進入專家視訊諮詢服務，當專家與會員雙方均進入視訊時，系統會開始計時，請準時進入視訊服務以享有完整諮詢時間。
</li>
</ol>
<ol>
  <li>視訊諮詢結束<br>會員於開始視訊後，過程中若中途離線，包含但不限於：點選結束視訊按鈕、關閉APP或網路斷線等，皆視為該次視訊結束，請務必在專家視訊諮詢前確認您的網路連線裝置(智慧型手機、平板或電腦等)及網路環境等軟硬體是否穩定且流暢。
</li>
</ol>

<ol>
  <li>改期與取消<br>於預約時段內因會員個人因素遲到或不到，視為取消該次諮詢服務，且將無法退款。</li>
</ol>
<ol>
  <li>視訊諮詢工具<br>在開始視訊諮詢前，請先確認您的視訊鏡頭、麥克風、耳機及喇叭功能是否正常，且所在環境網路穩定、流暢，以確保視訊通訊品質。</li>
</ol>

<ol>
  <li>改期、取消與退款</li>
  <li>改期、取消與退款您知悉並同意專家視訊諮詢服務經預約後，距諮詢時間開始前24小時內即不可取消退費，您有責任於預約本服務前，事先評估並確認具有使用本服務之需求。</li>
  <li>因會員個人因素需要更改諮詢日期或諮詢時間時，請於諮詢時間前自行取消諮詢並重新預約。如於預約諮詢時間開始前4小時內需更改時，請您聯繫客服人員處理。服務電話：(03)-493-6872。</li>
  <li>如因您的個人事由，無法如期使用並需取消已預約之專家視訊諮詢服務時，請於您該次諮詢時間24小時前完成取消預約程序，系統將全額退款給您；若未在24小時前取消者，將不予退款。完成取消預約程序後，系統將於3至5個工作天內將款項退回至您所使用的信用卡帳戶中，惟其實際退款處理天數，仍依各銀行作業時間為準。</li>
  <li>如因非可歸責於使用者之原因，使當次專家視訊諮詢服務無法執行或中斷時，本APP將與您聯繫另行預約諮詢時間，或視  情形退還全部或部分之諮詢服務費用。</li>
  <li>錄音錄影<br>為確保專家視訊諮詢服務之品質，視訊過程將全程錄影及錄音。當您使用視訊專家諮詢服務時，即視為您同意過程將全程錄影及錄音。如您欲自行將專家視訊諮詢過程予以錄音或錄影時，請事先取得專家之同意，以免觸法。</li>
</ol>


<el-button type="primary" size="large" style="width: 100%; margin-top: 24px;" @click="resetScrollTop">確定</el-button>
</el-scrollbar>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, watch, nextTick   } from 'vue'
import {  RegisterStaff, RegisterPatient } from '@/api/lineUser';
import useDate  from '@/utils/date';
import  BtnLoading from '@/components/loading/btnLoading.vue';
import { ElMessageBox} from 'element-plus'
import { Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
const { GetDateYYYYMMDD, GetDateTimeYYYYMMDDApi } = useDate();


import mobilefunction from '@/utils/mobile.js';
import moment from 'moment';

//liff
import useLiff from '@/composable/useLiff.js';
const liff = useLiff(); // 先呼叫函式取得返回的物件
const { LiffClose, liffCloseWindow, lineInitGetBasicData } = liff;

const formInlineErrors = ref(false);
const Messages_error = ref("");
const textLiffMessages = ref(""); 
const activeName = ref("case");
const description = ref("");
const titleLogin = ref("");
const isDisabled = ref(true);
const loadingStaff = ref(false)
const loadingPatient = ref(false)
const formRef = ref();
const dialogTableVisible = ref(false);
const scrollbarRef = ref(null);
const formInline = reactive({
  UserId: '',
  Birthday: '',
  EmployeeID:'',
  EipPassword:''

})


//客製生日
const dataDate = ref("");
const birthdayInput = ref(null);
const blackColor = ref(false);


let paramsList = {};
const onSubmitStaff = (formEl) => {
//員工實名認證
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      loadingStaff.value=true;
      isDisabled.value = true;
          
          if(formInline.EmployeeID !== "" && formInline.EipPassword !== ""){
          paramsList ={
            "StaffCode": formInline.EmployeeID,
            "Passcode": formInline.EipPassword
            }
            
           textLiffMessages.value= "您好，已完成認證。\n後續請留意每日ERAS諮詢通知、收案通知,如有任何問題，請與我們聯繫。\nTEL：03-4941234 #2035";
          
           RegisterStaff(paramsList).then((res)=>{          
            const { Code, Message } = res; 
            console.log(res, "1.4 員工實名認證");
            if(Code == "0"){    
              
              onMounted(async ()=>{
                const { isInClient } = await lineInitGetBasicData();
                console.log(isInClient, "isInClient");
                
                if(!isInClient){
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
                }
                
              });
              liffCloseWindow(textLiffMessages.value);

              
          
                              
            }else if (Code == "2") {
              Messages_error.value = Message;
              formInlineErrors.value = true;               
            }
           


          }).finally(()=>{
            loadingStaff.value = false;  
         
          });

        }

      
    
          formInline.UserId = "";
          formInline.Birthday = ""
          formInline.EmployeeID = "";
          formInline.EipPassword = "";
          // dataDate.value= "範例:1991/01/01";
          blackColor.value = false;
    } else {
      console.log('error submit!')
    }
  })
}



// 預設值為當前年份 -30
onMounted(() => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 30);
  nextTick(() => {
    dataDate.value = GetDateTimeYYYYMMDDApi(today);
  });

});


const resetScrollTop = () => {
  dialogTableVisible.value = false;
  if (scrollbarRef.value?.wrapRef) {
    scrollbarRef.value.wrapRef.scrollTop = 0;
  }
};
const openDialog = () => {
  dialogTableVisible.value = true;
  nextTick(() => {
    resetScrollTop();
  });
};


const onChange = ()=>{
  blackColor.value = true;
  formInline.Birthday = GetDateYYYYMMDD(dataDate.value);
  if(formInline.Birthday == 'Invalid date'){
    formInline.Birthday = "";
    blackColor.value = false;

  }
}


const onSubmitPatient = (formEl) => {
//民眾實名認證
  if (!formEl) return

  formEl.validate((valid) => {
    if (valid) {
      isDisabled.value = true;
      loadingPatient.value=true;
        
          //民眾實名認證
          if(formInline.UserId !== "" && formInline.Birthday !== ""){
          paramsList ={
            "IdNo": formInline.UserId,
            "BirthDate": formInline.Birthday
            }

            // 設定訊息內容
            textLiffMessages.value = "您好，聯新關骨樂活吧已完成認證。\n您可使用下方各項選單功能，後續也請留意重要推播提醒(例：術前提醒、術後關懷衛教等)";

  
         
            RegisterPatient(paramsList).then((res) => {
              const { Code, Message } = res;
              console.log(res, "1.3 民眾實名認證");
                if (Code == "0") {       
                    onMounted(async ()=>{
                      const { isInClient } = await lineInitGetBasicData();
                      console.log(isInClient, "isInClient");
                      if(!isInClient){               
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
                      }
                     });           
                     liffCloseWindow(textLiffMessages.value);

                    
                 }else if (Code == "2") {
                    Messages_error.value = Message;
                    formInlineErrors.value = true; 
                  }

              }).finally(() => {
                  loadingPatient.value = false;
               });
          }
      
    
          formInline.UserId = "";
          formInline.Birthday = ""
          formInline.EmployeeID = "";
          formInline.EipPassword = "";          
          // dataDate.value= "範例:1991/01/01";
          blackColor.value = false;
    } else {
      console.log('error submit!')
    }
  })
}


const onfocus = ()=>{
  Messages_error.value = "";
  formInlineErrors.value = false; 
  // const today = new Date();
  // today.setFullYear(today.getFullYear() - 30);
  // nextTick(() => {
  //   formInline.Birthday = GetDateTimeYYYYMMDDApi(today);
  // });
}


const onReset = async () => {

  LiffClose();

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
  Messages_error.value = "";
  descriptionFn(val);

},{ immediate: true });



watch(formInline, (val)=>{
  if((val.UserId  !== "" && val.Birthday !== "") || (val.EmployeeID  !== "" && val.EipPassword  !== "")){
    isDisabled.value = false
  }
  // if(val.EmployeeID !== "" && val.EipPassword !== ""){
  //   isDisabled.value = false
  // }
},{ immediate: true })



// onMounted(() => {
//       //行動裝置日期鍵盤關掉
//       const inputElement = document.querySelector('.style-Calendar .el-input__inner');
//       if (inputElement) {
//         inputElement.setAttribute('inputmode', 'none');
//       }
//     });

// 驗證規則
const rules = reactive({
  UserId: [      
        { 
          pattern: /^[A-Z][12]\d{8}$/, 
          message: '身分證字號格式不正確', 
          trigger: 'blur' 
        },
      ],
  Birthday:[
    {   message: '格式不正確', pattern: /^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/}
  ]    
});




const {  isMobileDevice } = mobilefunction();
const isMobileDeviceView = ref();
if (isMobileDevice()) {
  isMobileDeviceView.value = false
  console.log("is mobile device");
} else {
  isMobileDeviceView.value = true
  console.log("not mobile device");
}





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



</script>
<style lang="scss" scoped>

.form-item__error {
    font-size: 14px;
    color: var(--el-color-danger);
    text-align: right;
}
.el-form-item{
  width: 100%;
}
.el-date-editor {
    --el-date-editor-width:100%;
}
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
.is-error .el-input__wrapper {
  border-color: var(--el-color-danger) !important;
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.is-error .el-date-editor {
  border-color: var(--el-color-danger) !important;
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}

.el-tabs__header{
    margin-bottom: 18px;
}
  
input[type="date"]{
  font-size: 15px;
  text-align: left;
  color: #A8ABB2;
}
input::-webkit-calendar-picker-indicator { background-color:white}
input::-webkit-datetime-edit-text { 
  text-align: left;
}
// ::-webkit-datetime-edit-month-field { color:#555555 }
// ::-webkit-datetime-edit-day-field { color: #555555; }
// ::-webkit-datetime-edit-year-field { color:#555555; }
// input::-webkit-calendar-picker-indicator{ 
//   display: none;
//   background-image: url("@/assets/imgs/Calendar.svg");
//       background-position:center;
//        background-size:15px;
//        background-repeat:no-repeat;

// }

}
::v-deep(.el-date-editor.el-input){
    width: 100%;
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
    margin-top: 16px;
    a{
      color: #008CD6;
    }
}


</style>
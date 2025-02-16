<template>
  <h1 class="page_titl_line">
    <el-button v-if="QueryDone" class="btn_goback" text circle @click="goBack" />
    <span>{{ $route.meta.title }}</span>
  </h1>

  <div v-if="QueryDone" class="container-list">
    <div v-if="isDone" class="Scheduling-text">
      <el-button v-for="item in tableData" tag="div" tabindex="0" role="button" @click="confirm(item)"
        class="text-BasicInformation" v-loading="cardloading">
        <div class="text-primary doctorName">
          <img src="@/assets/imgs/icon_bone.svg" />{{ item.DivisionName }} <span>{{ item.DoctorName }}</span>
        </div>
        <div class="doctorTime">
          {{ GetDateYYYYMMDD(item.ClinicDate) }}
          ({{ parseTime(GetDateYYYYMMDD(item.ClinicDate), '{a}') }}) {{ isApn(item.Apn) }}
        </div>
        <div>{{ item.ClinicName }}診 {{ item.ViewNumber }}號 ( 建議於{{ GetHHmm(item.EstimatedTime) }}分前報到 )</div>
      </el-button>
      <el-empty v-if="emptyView" description="沒有資料" :image="$imgNotFound" />
    </div>
    <Done v-else :Data="DoneList" :CurrentNumber="CurrentNumber" @Refresh="onRefresh" @onClose="onClose"
      @CancelRegister="onCancelRegister" />
  </div>
  <el-form v-else ref="formRef" :rules="rules" :model="sizeForm" label-width="auto" :label-position="labelPosition"
    size="large">
    <el-form-item label="身分證字號" prop="userID">
      <el-input v-model="sizeForm.userID" placeholder="身分證字號" />
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

      <el-date-picker v-if="isMobileDeviceView" v-model="sizeForm.BirthDate" :clearable="false" type="date"
        size="large" format="YYYY/MM/DD" value-format="YYYY/MM/DD" placeholder="範例:1991/01/01" :default-value="dataDate"
        :class="[{ 'is-error': formInlineErrors }, 'style-Calendar']">
      </el-date-picker>
      <el-input v-else v-model="sizeForm.BirthDate" size="large" placeholder="範例:1991/01/01" ref="birthdayInput"
        class="input-with-select">
        <template #suffix>
          <el-button class="btn_Calendar" :icon="Calendar">

            <input v-model="dataDate" @change="onChange" type="date" />
          </el-button>
        </template>
      </el-input>
      <!-- <el-input
        v-else
        v-model="sizeForm.BirthDate"
        ref="birthdayInput"
        format="YYYY/MM/DD"
        :clearable="false"
        type="date"
        value-format="YYYY/MM/DD"
        size="large"
        @change="onChange"
        :suffix-icon="Calendar"
        :class="[{ 'is-error': formInlineErrors }, 'style-Calendar', { 'text-black': blackColor }]"
        placeholder=""
        :data-date="dataDate"/> -->



    </el-form-item>

    <el-form-item class="mb-2" style="padding-top: 4px">
      <BtnLoading title="查詢" :isLoading="formloading" @confirm="onSubmit(formRef)" :isDisabled="isDisabled" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import BtnLoading from '@/components/loading/btnLoading.vue';
import Done from '@/views/line/content/QueryCancellationDone.vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { QueryReservationList, GetPatientInfo, GetCurrentNumber } from '@/api/lineUser';
import useDate from '@/utils/date.js';
import { ElLoading } from 'element-plus';
import { parseTime } from '@/utils/index.js';
import { ElMessageBox } from 'element-plus';
import { Calendar } from '@element-plus/icons-vue';

const { GetDateYYYYMMDD, GetHHmm, GetNowDateYYYYMMDD, GetDateTimeYYYYMMDDApi } = useDate();
const emptyView = ref(false);
const router = useRouter();
const isDisabled = ref(true);
const labelPosition = ref('top');
const formRef = ref();
const cardloading = ref(false);
const formloading = ref(false);
const QueryDone = ref(false);
const tableData = ref([]);
const gobackList = ref({}); //清單跳轉到詳細頁面，儲存userID 和  BirthDate
const DoneList = ref({});
const isDone = ref(true);
const CurrentNumber = ref('-');
const sizeForm = reactive({
  userID: '',
  BirthDate: '',
});

const rules = reactive({
  userID: [
    { required: true, message: '不可空白', trigger: 'blur' },
    { required: true, pattern: /^[A-Z][12]\d{8}$/, message: '身分證字號格式不正確', trigger: 'blur' },
  ],
  BirthDate: [
    { required: true, message: '不可空白', trigger: 'blur' },
    { message: '格式不正確', pattern: /^(19|20)\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/ }
  ],
});




//客製生日
const dataDate = ref('');
const birthdayInput = ref(null);
const blackColor = ref(false);
// 預設值為當前年份 -30
onMounted(() => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 30);
  nextTick(() => {
    dataDate.value = GetDateTimeYYYYMMDDApi(today);
  });

});

const onChange = () => {
  blackColor.value = true;
  sizeForm.BirthDate = GetDateYYYYMMDD(dataDate.value);
  if (sizeForm.BirthDate == 'Invalid date') {
    sizeForm.BirthDate = '';
    blackColor.value = false;
  }
};

watch(
  sizeForm,
  (val) => {
    if (!val.userID || !val.BirthDate) {
      isDisabled.value = true;
    } else {
      isDisabled.value = false;
    }
  },
  { immediate: true }
);

let params = {};
GetPatientInfo(params)
  .then((res) => {
    const { Code, Data } = res;
    console.log(res, '2.2 門診-預帶資料');
    cardloading.value = ElLoading.service({
      lock: false,
      text: 'loading',
      background: 'transparent',
    });
  
    if (Code == '0') {
      sizeForm.userID = Data.IdNo !== null ? Data.IdNo : sizeForm.IdNo;
      sizeForm.BirthDate = Data.BirthDate !== null  ? GetDateYYYYMMDD(Data.BirthDate) : "";
      blackColor.value = true;
      onMounted(() => {
        nextTick(() => {
          dataDate.value = GetDateTimeYYYYMMDDApi(sizeForm.BirthDate);
        });
      });
     
      if (sizeForm.BirthDate == 'Invalid date') {
        dataDate.value = '';
        blackColor.value = false;
      }
    }
  })
  .finally(() => {
    if (cardloading.value) {
      cardloading.value.close();
    }

  });

const onSubmit = (formEl) => {
  if (!formEl) return;

  formEl.validate((valid) => {
    if (valid) {
      isDisabled.value = true;
      formloading.value = true;
      if (sizeForm.userID !== '' && sizeForm.BirthDate !== '') {
        // let paramsList ={
        //   "IdNo": sizeForm.userID,
        //   "BirthDate": sizeForm.BirthDate
        //   }
        //   QueryReservationList(paramsList).then((res)=>{
        //     const { Code, Data } = res;
        //     console.log(res, "2.4 門診-查詢掛號紀錄");

        //     if(Code == "0"){

        //       if(Data.List.length <= 0){
        //         ElMessageBox.alert(`查無資料`, {
        //           confirmButtonText: '確定',
        //           center: true
        //          })
        //       }else{
        //         QueryDone.value = true;
        //         formloading.value = false;
        //         tableData.value = Data.List;
        //       }

        //     }
        //   })
        //   .finally(()=>{
        //     formloading.value = false;
        //   })
        apiQueryReservationList(sizeForm.userID, sizeForm.BirthDate);
        gobackList.value.userID = sizeForm.userID;
        gobackList.value.BirthDate = sizeForm.BirthDate;
      }

      isDisabled.value = true;
      sizeForm.userID = '';
      sizeForm.BirthDate = '';
      dataDate.value = '';
      blackColor.value = false;
    } else {
      console.log('error submit!');
    }
  });
};

const goBack = () => {
  if (isDone.value) {
    //回到輸入基本資料那頁
    QueryDone.value = false;
    router.push({ name: 'QueryCancellation' });
    console.log('go back');
  } else {
    //回到查詢掛號清單
    isDone.value = true;
    apiQueryReservationList(gobackList.value.userID, gobackList.value.BirthDate);
  }
};

const confirm = (val) => {
  isDone.value = false;
  // cardloading.value = true
  DoneList.value = reader(val);
  console.log(DoneList.value);
  if (GetDateYYYYMMDD(val.ClinicDate) == GetNowDateYYYYMMDD()) {
    apiCurrentNumber(val.DivisionCode, val.DoctorCode);
  } else {
    CurrentNumber.value = -1;
  }
};

const onRefresh = (val) => {
  console.log(val, 'val');
  apiCurrentNumber(val.DivisionCode, val.DoctorCode);
};

const onCancelRegister = () => {
  isDone.value = true;
  apiQueryReservationList(gobackList.value.userID, gobackList.value.BirthDate);
}

const onClose = (val) => {
  console.log(val, 'onClose');
  if (val) {
    isDone.value = true;
    QueryDone.value = true;

    apiQueryReservationList(gobackList.value.userID, gobackList.value.BirthDate);
  }
};
watch(
  isDone,
  (item) => {
    console.log(item, '監聽');
    if (item === false) {
      //監聽診號是否有變
    }
  },
  { immediate: true }
);

// onMounted(() => {
//         //行動裝置日期鍵盤關掉
//         const inputElement = document.querySelector('.style-Calendar .el-input__inner');
//         if (inputElement) {
//           inputElement.setAttribute('inputmode', 'none');
//         }
// });




//看診時段 0:無 1:早 2:午 3:晚
const isApn = (item) => {
  if (item == 1) {
    return '早診';
  } else if (item == 2) {
    return '午診';
  } else if (item == 3) {
    return '晚診';
  } else {
    return;
  }
};

function apiCurrentNumber(DivisionCode, DoctorCode) {
  cardloading.value = ElLoading.service({
    lock: false,
    text: 'loading',
    background: 'transparent',
  });
  let paramsList = {
    DivisionCode: DivisionCode,
    DoctorCode: DoctorCode,
  };
  GetCurrentNumber(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      console.log(res, '2.5 門診-取看診號');
      if (Code == '0') {
        CurrentNumber.value = Data.CurrentNumber;
      }
    })
    .finally(() => {
      if (cardloading.value) {
        cardloading.value.close();
      }

    });
}

function apiQueryReservationList(userID, BirthDate) {
  // cardloading.value = true;

  let paramsList = {
    IdNo: userID,
    BirthDate: BirthDate,
  };
  QueryReservationList(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      console.log(res, '2.4 門診-查詢掛號紀錄');

      if (Code == '0') {
        if (Data.List.length <= 0) {
          tableData.value = Data.List;
          if (tableData.value.length > 0) {
            emptyView.value = false
          } else {
            emptyView.value = true
          }
          ElMessageBox.alert(`查無資料`, {
            confirmButtonText: '確定',
            center: true,
          });
        } else {
          QueryDone.value = true;
          formloading.value = false;
          tableData.value = Data.List;
        }
      }
    })
    .finally(() => {
      cardloading.value = false;
      formloading.value = false;
    });
}

function reader(val) {
  const show = {
    PatientName: val.PatientName,
    ClinicDate: val.ClinicDate, //看診日期
    Apn: val.Apn, //看診時段 0:無 1:早 2:午 3:晚
    Location: val.Location, //Location
    ViewNumber: val.ViewNumber, //看診號
    DivisionName: val.DivisionName, //科別名稱
    DivisionCode: val.DivisionCode,
    ClinicName: val.ClinicName, //診間名稱
    ClinicCode: val.ClinicCode,
    Remark: val.Remark, //就診說明
    DoctorName: val.DoctorName, //醫生名稱
    DoctorCode: val.DoctorCode,
    EstimatedTime: val.EstimatedTime, //預計看診時間
    IdNo: val.IdNo, //身分證字號
    BirthDate: val.BirthDate,
  };
  return show;
}

import mobilefunction from '@/utils/mobile.js';
const { isMobileDevice } = mobilefunction();
const isMobileDeviceView = ref();
if (isMobileDevice()) {
  isMobileDeviceView.value = false;
  console.log('is mobile device');
} else {
  isMobileDeviceView.value = true;
  console.log('not mobile device');
}
</script>

<style lang="scss" scoped>
.btn_Calendar {
  position: relative;
  border: none;
  padding-right: 0;

  &:hover {
    background-color: transparent;
  }

  input {
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  ::v-deep {
    >span {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
    }

    >.el-icon {
      pointer-events: none;

      svg path {
        fill: #a8abb2;
      }
    }
  }



}

::v-deep {
  .el-date-editor {
    --el-date-editor-width: 100%;
  }
}

.doctorName {
  margin-bottom: 6px;
  font-size: 16px;
}

::v-deep {
  .text-BasicInformation {
    font-size: 15px;
    line-height: 1.5;
    letter-spacing: 2px;
    font-weight: 400;
    color: #333;
    display: block;
    height: auto;
    text-align: left;

    &:last-child {
      margin-bottom: 0;
    }

    >span {
      display: block;
    }

    +.text-BasicInformation {
      margin-left: 0;
    }
  }
}

ul.Scheduling-text-ul {
  display: flex;
  flex-direction: column;
  row-gap: 8px;

  >li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: solid #dcdfe6 thin;
    padding: 10px 16px;

    .el-button {
      padding: 8px 21px;
    }
  }
}

.Scheduling-text {
  display: flex;
  flex-direction: column;
  row-gap: 16px;

  .title {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    line-height: 1.8;
  }
}

.style-Calendar {
  &.text-black {
    ::v-deep {
      .el-input__inner {
        &:before {
          color: #333;
        }
      }
    }
  }

  ::v-deep {
    .el-input__inner {
      text-align: left;
      color: transparent;

      &:before {
        content: attr(data-date);
        position: absolute;
        font-size: inherit;
        top: 2px;
        pointer-events: none;
        left: 3%;
        color: #a8abb2;
        background: #fff;
        height: 90%;
      }
    }

    .el-input__suffix-inner {
      display: none;
    }
  }
}
</style>

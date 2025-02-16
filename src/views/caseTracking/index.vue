<template>
  <div class="container_page_title">
    <h1 class="page_title">{{ $route.meta.title }}</h1>

    <el-button @click="toggleCollapse" class="style_mobile sort-descending" text></el-button>
  </div>

  <el-collapse-transition>
    <div class="style_mobile__content" v-show="collapseAction">
      <el-form :inline="true" ref="formRef" :model="formInline" class="form-content">
        <el-form-item label="手術日期">
          <el-date-picker
            v-model="formInline.Date"
            size="large"
            type="daterange"
            start-placeholder="起始日期"
            end-placeholder="結束日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            style="width: 230px"
            clearable
          />
        </el-form-item>

        <el-form-item label="手術科別">
          <el-select
            v-model="formInline.DivisionCode"
            placeholder="手術科別"
            size="large"
            style="width: 120px"
            clearable>
                <template #label="{ label, value }">
                      <span>{{ label }} </span>
                </template>
            <el-option v-for="item in option" :label="item.Name" :value="item.Code" />
          </el-select>
        </el-form-item>
        <el-form-item label="個案姓名">
          <el-input v-model="formInline.Name" size="large" style="width: 168px" placeholder="個案姓名" clearable>
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="個案身分證字號">
          <el-input v-model="formInline.IdNo" size="large" style="width: 168px" placeholder="個案身分證字號" clearable>
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="個案醫師">
          <el-input
            v-model="formInline.DoctorName"
            size="large"
            style="width: 168px"
            placeholder="主治醫師姓名"
            clearable
          >
            <template #prefix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="住院狀況">
          <el-select v-model="formInline.IpdStatus" placeholder="住院狀況" size="large" style="width: 120px" clearable>
            <el-option label="未住院" value="0" />
            <el-option label="住院中" value="1" />
            <el-option label="已出院" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="術後追蹤時間點">
          <el-select
            v-model="formInline.FollowType"
            placeholder="術後追蹤時間點"
            size="large"
            style="width: 160px"
            clearable
          >
            <el-option label="術後一天" value="1" />
            <el-option label="出院後五天" value="2" />
            <el-option label="出院後兩周" value="3" />
            <el-option label="術後一個月" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="追蹤狀況">
          <el-select
            v-model="formInline.ReplyStatus"
            placeholder="追蹤狀況"
            size="large"
            @change="changeReplyStatus"
            style="width: 130px"
            clearable
          >
            <el-option label="未完成追蹤" value="0" />
            <el-option label="已完成追蹤" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="諮詢日期">
 
          <el-date-picker
            v-model="formInline.ConsultDate"
            size="large"
            type="date"
            placeholder="諮詢日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            style="width:160px"
          />
        </el-form-item>
        <el-form-item label="諮詢狀況">
          <el-select
            v-model="formInline.ConsultStatus"
            placeholder="諮詢狀況"
            size="large"
            style="width: 120px"
            clearable
          >
            <el-option label="未預約" value="0" />
            <el-option label="已預約" value="1" />
            <el-option label="已完成" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <BtnLoading
            style="width: 72px"
            title="清空"
            class="btn_resetForm"
            isType=""
            :isLoading="formResetloading"
            @confirm="resetForm(formRef)"
            :isDisabled="false"
          />
          <BtnLoading
            style="width: 72px"
            class="btn_success_Form"
            title="搜尋"
            isType="success"
            :isLoading="formloading"
            @confirm="onSubmit(formRef)"
            :isDisabled="false"
          />
        </el-form-item>
        <el-form-item class="float-right">
          <BtnLoading
            style="width: 72px"
            class="ml-auto d-md-flex d-none btn_down"
            title="匯出"
            isType="primary"
            :isPlain="true"
            :isLoading="handleDownload_Loading"
            @confirm="handleDownload(formInline)"
            :isDisabled="false"
          />
        </el-form-item>
      </el-form>
    </div>
  </el-collapse-transition>

  <el-scrollbar>
    <el-table
      v-if="tableData.length > 0"
      border
      v-loading="loading"
      ref="singleTableRef"
      :data="tableData"
      height="75vh"
      style="width: 100%"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="index" label="序" width="56" :resizable="false" />
      <el-table-column v-if="IpdStatusView" prop="BedName" label="病房" width="95" :resizable="false" />
      <el-table-column prop="Name" label="個案姓名" :resizable="false" />
      <el-table-column prop="IdNo" label="身分證字號" :resizable="false" />
      <el-table-column prop="BirthDate" label="生日" :resizable="false">
        <template #default="scope">
          {{ GetDateYYYYMMDD(scope.row.BirthDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="Age" label="年齡" :resizable="false" />
      <el-table-column prop="Phone" label="聯絡電話" :resizable="false">
        <template #default="scope">
          {{ scope.row.Phone }}
        </template>
      </el-table-column>

      <el-table-column prop="OprDate" label="手術日期" sortable :resizable="false">
        <template #default="scope">
          {{ GetDateYYYYMMDD(scope.row.OprDate) }}
        </template>
      </el-table-column>

      <el-table-column prop="DivisionName" label="手術科別" :resizable="false" />
      <el-table-column prop="DoctorName" label="主治醫師" :resizable="false" />
      <el-table-column label="個案管理" :resizable="false">
        <template #default="scope">
          <el-button class="btn_state" size="small" :icon="MoreFilled" @click="SendValid(scope.row)" />
        </template>
      </el-table-column>
      <template #empty> 查無資料 </template>
    </el-table>
    <el-table height="75vh" v-if="emptyView" style="width: 100%" border>
      <template #empty>
        <el-empty description="沒有資料" :image="$imgNotFound" />
      </template>
    </el-table>
  </el-scrollbar>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { Search, CloseBold, Select, MoreFilled } from '@element-plus/icons-vue';
import { CaseList, CaseDownload } from '@/api/account';
import { Division } from '@/api/common';
import { ElMessageBox } from 'element-plus';
import { ElLoading } from 'element-plus';
import svgLoading from '@/composable/svgLoading.js';
import BtnLoading from '@/components/loading/btnLoading.vue';

import { useRouter } from 'vue-router';
const router = useRouter();
import { encryptStorage } from "@/utils/EncryptStorage";
import DownloadlFunction from '@/utils/download.js';
const { Download } = DownloadlFunction();
let Statsloading = ref(false);
const collapseAction = ref(false);
const toggleCollapse = () => {
  collapseAction.value = !collapseAction.value;
};
import useDate from '@/utils/date';
import moment from 'moment';
const { GetDateYYYYMMDD } = useDate();
const loading = ref(false);
const formResetloading = ref(false); //清空loading
const formloading = ref(false); // 搜尋loading
const emptyView = ref(false);
const handleDownload_Loading = ref(false); // 匯出loading
const IpdStatusView = ref(false);
const singleTableRef = ref(null);
const option = ref([]);
const formRef = ref([]);

const formInline = reactive({
  Date: null,
  DivisionCode: null, //手術科別
  Name: null, //姓名
  IdNo: null, //身分證字號
  DoctorName: null, //醫生
  IpdStatus: null, //住院狀態 0:未住院 1:住院中 2:已出院
  FollowType: null, //術後追蹤時間點 2:出院後5天 3:術後2周 4:術後1個月
  ReplyStatus: null, //推播回覆狀況 0:未回覆 1:已回覆
  ConsultDate: null, //諮詢日期
  ConsultStatus: null, //諮詢狀況 0:未預約 1:已預約 2:已完成
});



// const params = {};
// CaseTracking(params).then((res)=>{
//   const { Code, Data, Message } = res;
//   tableData.value = Data;
// });

// const changeDatePicker = () => {
//   formInline.ConsultDate = '';
// };



onMounted(()=>{
  let params = {};
Division(params).then((res) => {
  const { Code, Data } = res;
  console.log(res, '9.1 下拉選單-科別');
  if (Code == '0') {
    option.value = Data.List;
  }
});
});


const tableData = ref([]);
const formInlineSave = {};
const onSubmit = () => {
  formloading.value = true;

  if (
    formInline.Date == null &&
    formInline.ConsultDate == null &&
    formInline.DivisionCode == null &&
    formInline.Name == null &&
    formInline.IdNo == null &&
    formInline.DoctorName == null &&
    formInline.IpdStatus == null &&
    formInline.FollowType == null &&
    formInline.ReplyStatus == null &&
    formInline.ConsultStatus == null
  ) {
    ElMessageBox.alert('請選擇查詢條件', '提示', {
      confirmButtonText: '確定',
      center: true,
    });
    formloading.value = false;

 
  } else if (formInline.FollowType == null && formInline.ReplyStatus) {
    ElMessageBox.alert('請選擇術後追蹤時間點', '提示', {
      confirmButtonText: '確定',
      center: true,
    });
    formloading.value = false;
  } else {
    api(formInline);
  }
};

const handleDownload = (val) => {


  if (
    formInline.Date == null &&
    formInline.ConsultDate == null &&
    formInline.DivisionCode == null &&
    formInline.Name == null &&
    formInline.IdNo == null &&
    formInline.DoctorName == null &&
    formInline.IpdStatus == null &&
    formInline.FollowType == null &&
    formInline.ReplyStatus == null &&
    formInline.ConsultStatus == null
  ) {
    ElMessageBox.alert('請選擇查詢條件', '提示', {
      confirmButtonText: '確定',
      center: true,
    });
    formloading.value = false;
  } else if (formInline.FollowType == null && formInline.ReplyStatus) {
    ElMessageBox.alert('請選擇術後追蹤時間點', '提示', {
      confirmButtonText: '確定',
      center: true,
    });
    formloading.value = false;
  } else {
    let paramsList = {
    DateBegin: val.Date ? val.Date[0] : null,
    DateEnd: val.Date ? val.Date[1] : null,
    DivisionCode: val.DivisionCode,
    DoctorName: val.DoctorName,
    IdNo: val.IdNo,
    Name: val.Name,
    IpdStatus: val.IpdStatus,
    FollowType: val.FollowType,
    ReplyStatus: val.ReplyStatus,
    ConsultDate: val.ConsultDate,
    ConsultStatus: val.ConsultStatus,
  };
  handleDownload_Loading.value = true;

  CaseDownload(paramsList).then((res) => {
    console.log(res, '1.5 帳號管理-個案帳號 匯出');
    if(res){
      Download(res);
    }

  
    
  }).finally(() => {
    handleDownload_Loading.value = false;
  });

  }
};




const SendValid = (val) => {
  console.log(formInlineSave, "formInlineSave");
  for (const key in formInline) {
  
  if (formInline.hasOwnProperty(key)) {
    if(formInline[key] !== null){
      encryptStorage.setItem("searchList", JSON.stringify(formInline));   
    }
 
  }
}

  router.push({
    path: '/case-tracking/Details',
    state: { plan: JSON.stringify(val) }, // 將物件轉成字串
  });
};

// const changeReplyStatus = ()=>{
//   if(!formInline.FollowType){
//     ElMessageBox.alert("請選擇術後追蹤時間點", '提示', {
//                       confirmButtonText: '確定',
//                       center: true
//                 })
//   }
// }

const resetForm = (formEl) => {
  formInline.Date = null;
  formInline.Name = null; //姓名
  formInline.IdNo = null; //身分證字號
  formInline.DoctorName = null; //醫生
  formInline.IpdStatus = null; //住院狀態 0:未住院 1:住院中 2:已出院
  formInline.FollowType = null; //術後追蹤時間點 1:術後1天 2:出院後5天 3:出院後2周 4:術後一個月
  formInline.ReplyStatus = null; //推播回覆狀況 0:未回覆 1:已回覆
  formInline.ConsultStatus = null; //諮詢狀況 0:未預約 1:已預約 2:已完成
  formInline.ConsultDate = null;
  formInline.DivisionCode = null;
  // formInline.ConsultDate = null;//諮詢日期
  // if (option.value.length == 1) {
  //   formInline.DivisionCode = option.value[0].Code; //手術科別
  // }

  // api(formInline);

// formResetloading.value = true;

  };

let StorageformInline  = encryptStorage.getItem("searchList");
if(StorageformInline){
   StorageformInline  = JSON.parse(encryptStorage.getItem("searchList"));

  api(StorageformInline);

}else{
  // 取得今天的日期，格式為 YYYY-MM-DD
const today = moment().format('YYYY/MM/DD');
formInline.ConsultDate = today;
console.log(new Date().toString())
  api(formInline);
}


function api(val) {
  let paramsList = {
    DateBegin: val.Date ? val.Date[0] : null,
    DateEnd: val.Date ? val.Date[1] : null,
    DivisionCode: val.DivisionCode,
    DoctorName: val.DoctorName,
    IdNo: val.IdNo,
    Name: val.Name,
    IpdStatus: parseInt(val.IpdStatus),
    FollowType: parseInt(val.FollowType),
    ReplyStatus: parseInt(val.ReplyStatus),
    ConsultDate: val.ConsultDate,
    ConsultStatus: parseInt(val.ConsultStatus),
  };
  console.log(paramsList, 'paramsListparamsListparamsListparamsList');
  Statsloading.value = ElLoading.service({
    lock: false,
    text: 'loading',
    svg:svgLoading,
    background: 'transparent',
  });
  CaseList(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      console.log(res, '2.1 個案管理-搜尋');
      if (Code == '0') {


            

        if (val.IpdStatus) {
          IpdStatusView.value = true;
        } else {
          IpdStatusView.value = false;
        }

        tableData.value = Data.List;
        if (tableData.value.length > 0) {
          emptyView.value = false;
        } else {
          emptyView.value = true;
        }
        if(StorageformInline){
        
            for (const key in val) {
  
              if (formInline.hasOwnProperty(key)) {
                formInline[key] = val[key];
                }
            }
          encryptStorage.removeItem("searchList");
        }


      }

      formloading.value = false;


    })
    .finally(() => {
      formloading.value = false;
      formResetloading.value = false;
      Statsloading.value.close();
    });
}




</script>
<style lang="scss" scoped>
::v-deep {
  .el-loading-spinner .el-loading-text {
    margin: 3px 0 0 0;
  }
}
</style>

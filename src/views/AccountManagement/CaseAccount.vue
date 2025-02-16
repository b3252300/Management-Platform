<template>
  <h1 class="page_title">{{ $route.meta.title }}</h1>
  <div class="d-flex">
    <el-form :inline="true" ref="formRef" :model="formInline" class="form-content">
      <el-form-item label="身分證字號/姓名/LINE名稱">
        <el-input v-model="formInline.user" size="large" style="width: 273px" placeholder="身分證字號/姓名/LINE名稱">
          <template #prefix>
            <el-icon class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="個案狀態">
        <el-select v-model="formInline.type" placeholder="請選擇狀態" size="large" style="width: 240px">
          <el-option label="未收案" value="0" />
          <el-option label="收案中" value="1" />
          <el-option label="已結案" value="2" />
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
          title="搜尋"
          class="btn_success_Form"
          isType="success"
          :isLoading="formloading"
          @confirm="submitForm(formInline)"
          :isDisabled="false"
        />
      </el-form-item>
    </el-form>
    <BtnLoading
      style="width: 72px"
      class="ml-auto btn_down"
      title="匯出"
      isType="primary"
      :isPlain="true"
      :isLoading="handleDownload_Loading"
      @confirm="handleDownload()"
      :isDisabled="false"
    />
  </div>
  <el-scrollbar>
    <el-table
      v-if="tableData.length > 0"
      border
      ref="singleTableRef"
      :data="tableData"
      height="80vh"
      style="width: 100%"
      v-loading="loading"     
    >
      <el-table-column type="index" label="序" width="56" :resizable="false" />
      <el-table-column prop="IdNo" label="身分證字號" width="118" :resizable="false" />
      <el-table-column prop="Name" label="姓名" width="180" :resizable="false" />

      <el-table-column class="table_card_LineName" prop="LineName" label="LINE名稱" width="294" :resizable="false">
        <template #default="scope">
          <div class="card_LineName">
            <img
              v-if="scope.row.LinePictureUrl"
              class="img_LineName"
              :src="scope.row.LinePictureUrl"
              :alt="scope.row.LineName"
            />
            {{ scope.row.LineName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="Phone" label="聯絡電話" width="180" :resizable="false" />
      <el-table-column prop="JoinDateTime" label="加入時間" width="180" :resizable="false">
        <template #default="scope">
          {{ GetDateTimeYYYYMMDDHHmm(scope.row.JoinDateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="Status" label="狀態" sortable :resizable="false">
        <template #default="scope">
          <div class="d-flex align-items-center gap-2">
            <span :class="stylePoint(scope.row.Status)">
              <span class="icon_point"></span>
              {{ StatusTitle(scope.row.Status) }}</span
            >

            <el-button class="btn_state" size="small" :icon="MoreFilled" @click="SendValid(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table height="80vh" v-if="emptyView" style="width: 100%" border>
      <template #empty>
        <el-empty description="沒有資料" :image="$imgNotFound" />
      </template>
    </el-table>
  </el-scrollbar>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Search, CloseBold, Select, MoreFilled } from '@element-plus/icons-vue';
import { AccountPatient, AccountDownloadPatient } from '@/api/account';
import useDate from '@/utils/date';
import DownloadlFunction from '@/utils/download.js';
import BtnLoading from '@/components/loading/btnLoading.vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { ElLoading } from 'element-plus';
import svgLoading from '@/composable/svgLoading.js';
const router = useRouter();
let Statsloading = ref(false);
const { Download } = DownloadlFunction();
const formResetloading = ref(false); //清空loading
const formloading = ref(false); // 搜尋loading
const handleDownload_Loading = ref(false); // 匯出loading
const emptyView = ref(false);
const { GetDateTimeYYYYMMDDHHmm } = useDate();
const loading = ref(false);
const singleTableRef = ref(null);
const formRef = ref(null);
const formInline = reactive({
  user: '',
  type: '',
});
const tableData = ref([]);
//收案狀態 0:未收案 1:收案中 2:結案
const stylePoint = (Status) => {
  if (Status == 2) {
    return 'style_green';
  } else if (Status == 1) {
    return 'style_blue';
  } else if (Status == 0) {
    return 'style_default';
  }
};

//收案狀態 0:未收案 1:收案中 2:結案
const StatusTitle = (Status) => {
  if (Status == 0) {
    return '未收案';
  } else if (Status == 1) {
    return '收案中';
  } else if (Status == 2) {
    return '已結案';
  }
};

const resetForm = (formEl) => {
  formInline.user = '';
  formInline.type = '';
  // formResetloading.value = true;
  // api(null, null);

};

const handleSortChange = ({ prop, order }) => {
  if (prop === 'JoinDateTime' && order) {
    // 若按 JoinDateTime 排序，仍保留 Status 的近到遠排序
    tableData.value = tableData.value.sort((a, b) => {
      if (a.Status === b.Status) {
        return order === 'ascending'
          ? new Date(a.JoinDateTime) - new Date(b.JoinDateTime)
          : new Date(b.JoinDateTime) - new Date(a.JoinDateTime);
      }
      return a.Status - b.Status; // Status 排序不變
    });
  }
};

const handleDownload = () => {
  handleDownload_Loading.value = true;
  let paramsList = {
    Content: formInline.user,
    Status: parseInt(formInline.type),
  };

  AccountDownloadPatient(paramsList).then((res) => {
    handleDownload_Loading.value = false;
    console.log(res, '1.5 帳號管理-個案帳號 匯出');
    Download(res);
  });
};

const SendValid = (val) => {
  // router.push({ name: 'Details' });
  const show = { ...val, PatientRowId: val.RowId }; // 添加 PatientRowId 屬性
  console.log(val);
  if (val.HasOpr) {
    router.push({
      path: '/case-tracking/Details',
      state: { plan: JSON.stringify(val) }, // 將物件轉成字串
    });
  } else {
    ElMessageBox.alert('查無資料', '提示', {
      confirmButtonText: '確定',
      center: true,
    });
  }
};

const submitForm = (formEl) => {
  if (!formEl) return;

  
    
    api(formInline.user, formInline.type);
  

};

const api = (Content, Status) => {
  let paramsList = {
    Content: Content == null ? null : Content,
    Status: Status == null ? null :parseInt(Status),
  };
  Statsloading.value = ElLoading.service({
    lock: false,
    text: 'loading',
    svg:svgLoading,
    background: 'transparent',
  });
  AccountPatient(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      console.log(res, '1.2 帳號管理-個案帳號');
      if (Code == '0') {
        tableData.value = Data.List ? Data.List : [];
        console.log(tableData.value.length > 0, 'tableData.value');
        if (tableData.value.length > 0) {
          emptyView.value = false;
        } else {
          emptyView.value = true;
        }

        //   if(Data.List){
        //   tableData.value = Data.List.sort((a, b) => {
        //    if (a.Status === b.Status) {
        //     return new Date(a.JoinDateTime) - new Date(b.JoinDateTime); // 日期升序
        //    }
        //     return a.Status - b.Status;
        //  });
        //      console.log(tableData.value);
        //   }
      }
    })
    .finally(() => {
      formloading.value = false;
      formResetloading.value = false;
      Statsloading.value.close();
    });
};

api(null, null);
</script>
<style lang="scss" scoped>
img.img_LineName {
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 100%;
  border: solid #dcdfe6 thin;
}
.card_LineName {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  column-gap: 14px;
}
::v-deep {
  .el-loading-spinner .el-loading-text {
    margin: 3px 0 0 2px;
  }
}
.table_card_LineName {
  @media (max-width: 767px) {
    width: auto;
  }
}


</style>

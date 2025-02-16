<template>
  <h1 class="page_title">{{ $route.meta.title }}</h1>
  <div class="d-flex">
    <el-form :inline="true" ref="formRef" :model="formInline" class="form-content">
      <el-form-item label="員編/姓名/部門/LINE名稱">
        <el-input v-model="formInline.user" size="large" style="width: 273px" placeholder="員編/姓名/部門/LINE名稱">
          <template #prefix>
            <el-icon class="el-input__icon"><Search /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="狀態">
        <el-select v-model="formInline.type" placeholder="請選擇狀態" size="large" style="width: 240px">
          <el-option label="有效" value="1" />
          <el-option label="停用" value="2" />
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
          :isDisabled="isDisabled_formReset"
        />
        <BtnLoading
          style="width: 72px"
          title="搜尋"
          class="btn_success_Form"
          isType="success"
          :isLoading="formloading"
          @confirm="submitForm(formInline)"
          :isDisabled="isDisabled_form"
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
      @confirm="handleDownload(formInline)"
      :isDisabled="isDisabled_Download"
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
      <el-table-column prop="StaffCode" width="102" label="員工編號" :resizable="false" />
      <el-table-column prop="Name" label="姓名" width="180" :resizable="false" />
      <el-table-column prop="LineName" label="LINE名稱" width="294" :resizable="false">
        <template #default="scope">
          <div class="card_LineName">
            <img class="img_LineName" :src="scope.row.LinePictureUrl" :alt="scope.row.LineName" />
            {{ scope.row.LineName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="DivisionName" label="部門名稱" width="180" :resizable="false" />
      <el-table-column prop="JoinDateTime" label="加入時間" width="180" :resizable="false">
        <template #default="scope">
          {{ GetDateTimeYYYYMMDDHHmm(scope.row.JoinDateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="Status" :sort-by="sortStatus" label="狀態" sortable :resizable="false">
        <template #default="scope">
          <div class="d-flex align-items-center gap-2 btn_state_has">
            <span :class="stylePoint(scope.row.Status)">
              <span class="icon_point"></span>
              {{ StatusTitle(scope.row.Status) }}</span
            >

            <el-button
              v-if="scope.row.Status === 1"
              class="btn_state btn_Close"
              size="small"
              :icon="CloseBold"
              @click="SendValid(scope.row)"
            />
            <el-button
              v-if="scope.row.Status === 2"
              class="btn_state btn_Valid"
              size="small"
              :icon="Select"
              @click="SendValid(scope.row)"
            />
          </div>
        </template>
      </el-table-column>
      <template #empty> 查無資料 </template>
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
import { Search, CloseBold, Select } from '@element-plus/icons-vue';
import { AccountStaff, AccountDownloadStaff, UpdateStaffStatus } from '@/api/account';
import useDate from '@/utils/date';
import DownloadlFunction from '@/utils/download.js';
import BtnLoading from '@/components/loading/btnLoading.vue';
import { ElLoading } from 'element-plus';
import svgLoading from '@/composable/svgLoading.js';
const { Download } = DownloadlFunction();
let Statsloading = ref(false);
const { GetDateTimeYYYYMMDDHHmm } = useDate();
const loading = ref(false);
const formResetloading = ref(false); //清空loading
const formloading = ref(false); // 搜尋loading
const handleDownload_Loading = ref(false); // 匯出loading
const singleTableRef = ref(null);
const formRef = ref(null);
const emptyView = ref(false);
const isDisabled_formReset = ref(false);
const isDisabled_form = ref(false);
const isDisabled_Download = ref(false);
const formInline = reactive({
  user: '',
  type: '',
});
const tableData = ref([]);
const stylePoint = (Status) => {
  if (Status === 2) {
    return 'style_red';
  } else if (Status === 1) {
    return 'style_green text-black';
  } else {
    return 'style_default';
  }
};

const StatusTitle = (Status) => {
  if (Status === 1) {
    return '有效';
  } else if (Status === 2) {
    return '停用';
  } else {
    return '';
  }
};

const resetForm = (formEl) => {
  formInline.user = '';
  formInline.type = '';
 
  // isDisabled_formReset.value = true;

};

//sort-change 狀態 > 新到舊
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

const sortStatus = (row) => {
  return row.Status;
};

const handleDownload = () => {
  handleDownload_Loading.value = true;
  isDisabled_Download.value = true;
  let paramsList = {
    Content: formInline.user,
    Status: parseInt(formInline.type),
  };

  AccountDownloadStaff(paramsList).then((res) => {
    handleDownload_Loading.value = false;
    console.log(res, '1.5 帳號管理-員工帳號 匯出');
    Download(res);
    isDisabled_Download.value = false;
  });
};

const submitForm = (formEl) => {
  if (!formEl) return;
  // formloading.value = true;
  // isDisabled_form.value = true;
  
    api(formInline.user, formInline.type);
 

};

const SendValid = (val) => {
  console.log(val.RowId, 'SendValid');
  updateApi(val.RowId, val.Status);
};

const api = (Content, Status) => {
  let paramsList = {
    Content: Content == null ? '' : Content,
    Status: parseInt(Status),
  };
  Statsloading.value = ElLoading.service({
    lock: false,
    text: 'loading',
    svg:svgLoading,
    background: 'transparent',
  });
  AccountStaff(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      console.log(res, paramsList, '1.3 帳號管理-員工帳號');
      if (Code == '0') {
        tableData.value = Data.List ? Data.List : [];

        if (tableData.value.length > 0) {
          emptyView.value = false;
        } else {
          emptyView.value = true;
        }

        //  if(Data.List){
        //     tableData.value = Data.List.sort((a, b) => {
        //       if (a.Status === b.Status) {
        //           return new Date(a.JoinDateTime) - new Date(b.JoinDateTime); // 日期升序
        //       }
        //           return a.Status - b.Status;
        //     });
        //   }
      }
    })
    .finally(() => {
      formloading.value = false;
      formResetloading.value = false;
      isDisabled_form.value = false;
      isDisabled_formReset.value = false;
      Statsloading.value.close();
    });
};

api(null, 0);

const updateApi = (RowId, Status) => {
  let paramsList = {
    RowId: RowId,
    Status: Status == 1 ? '2' : '1',
  };

  UpdateStaffStatus(paramsList).then((res) => {
    const { Code } = res;
    console.log(res, '1.6 帳號管理-員工帳號 修改狀態');
    if (Code == '0') {
      api(null, 0);
    }
  });
};
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
    margin: 3px 0 0 0;
  }
}
</style>

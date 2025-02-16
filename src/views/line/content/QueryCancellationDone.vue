<template>
  <div class="container-Checklist">
    <el-descriptions :title="props.Data.PatientName" :column="1">
      <el-descriptions-item label="時間">
        {{ GetDateYYYYMMDD(props.Data.ClinicDate) }}
        ({{ parseTime(GetDateYYYYMMDD(props.Data.ClinicDate), '{a}') }})
        {{ isApn(props.Data.Apn) }}
      </el-descriptions-item>
      <el-descriptions-item label="地點">{{ props.Data.Location }} {{ props.Data.ClinicName }}診</el-descriptions-item>
      <el-descriptions-item label="科別">{{ props.Data.DivisionName }}</el-descriptions-item>
      <el-descriptions-item label="醫師">{{ props.Data.DoctorName }}</el-descriptions-item>
      <el-descriptions-item label="建議看診時間">{{ GetHHmm(props.Data.EstimatedTime) }}</el-descriptions-item>
    </el-descriptions>
    <div class="container-number">
      <div class="content_num style_border_blue">
        <div class="num">{{ props.Data.ViewNumber ? props.Data.ViewNumber : '-' }}</div>
        <div class="txt">你的診號</div>
      </div>
      <div class="content_num style_border_green">
        <div class="num">
          <template v-if="props.CurrentNumber !== -1">
            {{ props.CurrentNumber }}
          </template>
          <span v-else>尚未開始</span>
        </div>
        <div class="txt">即時診號</div>
      </div>
    </div>

    <div class="UpdateTime" v-if="!OpenClinic()">
      更新時間 {{ RefreshDate }}
      <el-button
        class="ml-2 el-button-transparent"
        v-if="!isdisabled"
        :icon="Refresh"
        circle
        text
        size="large"
        @click="onRefresh"
        :disabled="isdisabled"
      />

      <el-button class="ml-2" v-else circle size="large" :disabled="isdisabled" v-if="countdownText">{{
        countdownText
      }}</el-button>
    </div>
    <div class="DescriptionText" v-for="item in isRemark">{{ item }}</div>
  </div>
  <div class="d-flex">
    <BtnLoading
      v-if="btnCancel"
      title="取消預約"
      isType="danger"
      :isPlain="true"
      :isLoading="loading"
      @confirm="centerDialogVisible = true"
      :isDisabled="false"
    />
    <el-button type="primary" @click="onClose()" size="large" class="w-100 btn_primary">確定</el-button>
  </div>

  <el-dialog v-model="centerDialogVisible" title="確定取消掛號" style="max-width: 316px; width: 100%" align-center>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">返回</el-button>
        <el-button type="primary" @click="onIsCancel()"> 確定取消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useDate from '@/utils/date.js';
import { parseTime } from '@/utils/index.js';
import BtnLoading from '@/components/loading/btnLoading.vue';
import { CancelRegister } from '@/api/lineUser';
import { ElMessageBox } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

//liff
import useLiff from '@/composable/useLiff.js';
const liff = useLiff(); // 先呼叫函式取得返回的物件
const { LiffClose } = liff;

const router = useRouter();
const { GetDateYYYYMMDD, GetHHmm, GetNowDateTimeYYYYMMDDHHmm } = useDate();
const isRemark = ref();
const isdisabled = ref(false);
const btnCancel = ref(true);
const loading = ref(false);
const centerDialogVisible = ref(false);
let RefreshDate = ref(GetNowDateTimeYYYYMMDDHHmm());
const props = defineProps({
  Data: {
    type: Object,
    default: {},
  },
  CurrentNumber: {
    type: String,
    default: '',
  },
});

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

if (props.Data.Remark) {
  isRemark.value = props.Data.Remark.split('\n');
}

const emit = defineEmits(['Confirm', 'Refresh', 'onClose']);
const onIsCancel = () => {
  let paramsList = {
    IdNo: props.Data.IdNo,
    BirthDate: GetDateYYYYMMDD(props.Data.BirthDate),
    DivisionCode: props.Data.DivisionCode,
    ClinicCode: props.Data.ClinicCode,
    DoctorCode: props.Data.DoctorCode,
    ClinicDate: GetDateYYYYMMDD(props.Data.ClinicDate),
    Apn: props.Data.Apn,
    ViewNumber: props.Data.ViewNumber,
  };
  loading.value = true;

  CancelRegister(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      console.log(res, '2.6 門診-取消掛號');

      if (Code == '0') {
        loading.value = false;
        ElMessageBox.alert(`取消成功`, {
          showClose: false,
          confirmButtonText: '確定',
          center: true,
        }).then(() => {
          emit('CancelRegister');
        });

        btnCancel.value = false;
      }
    })
    .finally(() => {
      centerDialogVisible.value = false;
      loading.value = false;
    });
};
let countdownText = ref();
const onRefresh = () => {
  isdisabled.value = true;
  RefreshDate.value = GetNowDateTimeYYYYMMDDHHmm();

  // 倒數 5 秒
  let countdown = 5;
  countdownText.value = `${countdown}`;
  const interval = setInterval(() => {
    countdown--;
    countdownText.value = `${countdown}`;
    if (countdown <= 0) {
      isdisabled.value = false; // 5 秒後設為 false
      countdownText.value = '';
      clearInterval(interval); // 清除計時器
    }
  }, 1000); // 每秒執行一次

  const list = {
    DivisionCode: props.Data.DivisionCode,
    DoctorCode: props.Data.DoctorCode,
  };

  emit('Refresh', list);
};

const onClose = () => {
  emit('onClose', true);
};

function OpenClinic() {
  // 看診時間的時間戳
  const appointmentTimestamp = +new Date(props.Data.ClinicDate);
  // 今天時間的時間戳
  const todayTimestamp = +new Date(); // 取得當前時間戳
  //看診時間 >= 今天時間
  const show = ref(appointmentTimestamp >= todayTimestamp);
  return show.value;
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-descriptions__title {
    font-weight: 400;
    &::before {
      content: '';
      border-left: solid #008cd6 2px;
      padding-left: 10px;
    }
  }
  .el-descriptions__body .el-descriptions__table .el-descriptions__cell {
    font-size: 15px;
    padding-bottom: 0;
  }
}
.container {
  &-Checklist {
    border: solid #dcdfe6 thin;
    padding: 10px 16px;
    margin-bottom: 24px;

    .DescriptionText {
      margin-top: 16px;
    }
  }
  &-number {
    margin-top: 16px;
    display: flex;
    column-gap: 16px;
    margin-bottom: 8px;
    .content_num {
      max-width: 176px;
      height: 116px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: #fafafa;
      border-radius: 10px;
      .num {
        font-size: 40px;
        font-weight: 500;
        letter-spacing: 2px;
        line-height: 48px;
        > span {
          font-size: 20px;
        }
      }
      .txt {
        font-size: 15px;
        font-weight: 400;
        color: #333;
      }
    }
  }
}
.style_border_blue {
  border: solid #8fc31f thin;
  .num {
    color: #8fc31f;
  }
}
.style_border_green {
  border: solid #008cd6 thin;
  .num {
    color: #008cd6;
  }
}
.UpdateTime {
  color: #9f9f9f;
  @media screen and (max-width: 575px) {
    text-align: center;
  }
}

.el-button {
  --el-button-disabled-bg-color: #fafafa;
  --el-button-disabled-border-color: #dcdfe6;
  --el-button-disabled-text-color: #333333;
}
.el-button-transparent {
  background: transparent;
}
</style>

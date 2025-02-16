<template>
  <h1 class="page_title">
    <el-button class="btn_goback" text circle @click="goBack(LeaveOKCode)" data-name="goBack" />
    <span class="style_mobile_lg">{{ $route.meta.title }}</span>
  </h1>

  <el-table height="75vh" v-if="Object.keys(BasicinformationData) == 0" style="width: 100%" border>
    <template #empty>
      <el-empty v-if="emptyView" description="沒有資料" :image="$imgNotFound" />
      <div v-else></div>

    </template>
  </el-table>
  <template v-else>
    <Information :Data="BasicinformationData" />

    <el-scrollbar class="container_scrollbar">
      <div class="caselist">
        <el-segmented
          @change="ChangeCaselist"
          :direction="direction"
          v-model="caselist_value"
          :options="caselist_card"
          v-loading="loading.caselist"
          style="min-width: 174px; width: fit-content">
          <template #default="{ item }">
            <div class="caselist_card btn_caselist_seleted">
              <el-tag v-if="item.type" class="icon_ERAS" size="small" color="#EB823D" effect="dark" round>ERAS</el-tag>
              <div class="caselist_content">
                <div class="caselist_OprDate">{{ GetDateYYYYMMDD(item.label) }}</div>
                <div class="caselist_name">
                  <div style="min-width: 30px">{{ item.value.DivisionName }}</div>
                  {{ item.value.DoctorName }}
                </div>
              </div>
            </div>
          </template>
        </el-segmented>
      </div>
    </el-scrollbar>

    <div class="container_menu">
      <el-scrollbar class="container-tab">
        <div class="d-flex">
          <el-tabs v-model="activeName" class="activeName-tabs" :before-leave="beforeLeave">
            <el-tab-pane label="術前諮詢" name="1"></el-tab-pane>
            <el-tab-pane label="手術" name="2"></el-tab-pane>
            <el-tab-pane label="術後追蹤" name="3" :disabled="!isDisabledTab"></el-tab-pane>
          </el-tabs>
        </div>
      </el-scrollbar>
      <div v-if="activeName == 1 || activeName == 3" class="container_btn">
        <div class="d-none d-md-flex">
          <!-- <BtnLoading
            :title="isDisabled ? '編輯' : '取消'"
            isType=""
            :isLoading="loading.EditBtn"
            @confirm="editFrom"
            :isDisabled="showCaseStatus == 3 ? true : isCaseDisabled.Edit"/> -->

          <el-button  size="large" :loading="loading.EditBtn" @click="editFrom" :disabled="showCaseStatus == 3 ? true : isCaseDisabled.Edit">
            <span style="vertical-align: middle">{{ isDisabled ? '編輯' : '取消' }}</span>
          </el-button>

          <el-button
            v-if="activeName != 3"
            type="primary"
            size="large"
            :loading="loading.saveBtn"
            class="btn_save"
            style="align-items: center"
            :disabled="isCaseDisabled.Done"
            @click="submitForm(isRowId, fileList)">
            <span style="vertical-align: middle">儲存</span>
          </el-button>
          <el-button
            v-else
            type="primary"
            size="large"
            :loading="loading.saveBtn"
            class="btn_save"
            style="align-items: center"
            :disabled="isCaseDisabled.Done || (form_day.ReplyDate == '' && form_day.CareType == 0)"
            @click="submitReplyForm(cardParamsList, ReplyFile)">
            <span style="vertical-align: middle">儲存</span>
          </el-button>
        </div>
        <div  class="d-flex d-md-none">
          <template v-if="isDisabled">
            <!-- <BtnLoading
              :title="isDisabled ? '編輯' : '取消'"
              isType=""
              :isLoading="loading.EditBtn"
              @confirm="editFrom"
              :isDisabled="showCaseStatus == 3 ? true : isCaseDisabled.Edit"
              name="editBtn"
            /> -->
            <el-button  size="large" :loading="loading.EditBtn" @click="editFrom" :disabled="showCaseStatus == 3 ? true : isCaseDisabled.Edit">
            <span style="vertical-align: middle">{{ isDisabled ? '編輯' : '取消' }}</span>
          </el-button>

          </template>
          <template v-else>
            <el-button
              v-if="activeName != 3"
              type="primary"
              size="large"
              :loading="loading.saveBtn"
              class="btn_save"
              style="align-items: center"
              :disabled="isCaseDisabled.Done"
              @click="submitForm(isRowId, fileList)"
            >
              <span style="vertical-align: middle">儲存</span>
            </el-button>
            <el-button
            v-else
            type="primary"
            size="large"
            :loading="loading.saveBtn"
            class="btn_save"
            style="align-items: center"
            :disabled="isCaseDisabled.Done"
            @click="submitReplyForm(cardParamsList, ReplyFile)">
            <span style="vertical-align: middle">儲存</span>
          </el-button>
          </template>
        </div>
      </div>
      <!-- 個案狀態 0:未收案 1:收案中 2:結案 3:手動結案 4:手動收案 -->
      <el-radio-group
        v-model="isCaseStatus"
        class="btn_case"
        @click="onCase(isRowId, isCaseStatus)"
        size="large"
        :isLoading="loading.caseBtn"
        fill="#008CD6"
        text-color="#008CD6"
        name="CaseStatus">
        <el-radio v-if="showCaseStatus == 0" value="1" size="large" border style="width: 117px" color="#008cd6">收案</el-radio>
        <el-radio
          v-if="showCaseStatus == 1 || showCaseStatus == 4"
          value="3"
          size="large"
          class="btn_danger"
          border
          style="width: 117px">結案</el-radio>
        <el-radio v-if="showCaseStatus == 3 || showCaseStatus == 2" value="4" size="large" border style="width: 117px"  color="#008cd6">轉收案</el-radio
        ><!-- 結案轉收案 -->
      </el-radio-group>
    </div>

    <el-scrollbar v-if="activeName == 1">
      <el-form :model="formline" :inline="true" class="form-formline" style="width: fit-content">
        <el-form-item label="收案日期" class="formline-date mr-md-2 mr-0">
          <el-date-picker
            v-model="formline.date"
            type="date"
            placeholder="收案日期"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            @keydown.enter.prevent
            :disabled="isDisabled"
          />
        </el-form-item>
        <el-form-item label="身高">
          <el-input
            v-model="formline.height"
            style="width: 65px"
            :disabled="LinePushList[2].done == 2 ? true : isDisabled"
            @input="calculateBMI"
          />
        </el-form-item>
        <el-form-item label="體重">
          <el-input
            v-model="formline.weight"
            style="width: 65px"
            :disabled="LinePushList[2].done == 2 ? true : isDisabled"
            @input="calculateBMI"
          />
        </el-form-item>
        <el-form-item label="BMI:">
          <span :style="{ color: !isRed ? '#333333' : '#EB4D3D' }">
            <!-- {{ bmiData ? bmiData : bmi }} -->
            {{ bmi }}
          </span>
        </el-form-item>
        <el-form-item>

          <el-checkbox
            v-model="formline.failure"
            label="未達營養諮詢轉介標準"
            @change="failureChange"
            :disabled="formlineFailure"
          />
      
          <el-checkbox
            v-model="formline.check"
            label="拒檢營養諮詢"
            @change="failureChange"
            :disabled="formlineCheck"
          />
        </el-form-item>
      </el-form>

      <!-- line推播 -->
      <el-card class="card_formpush bg-yellow" shadow="never">
        <template #header>
          <el-form :model="formpush" :inline="true" style="width: fit-content">
            <!-- <el-form-item>
            <div class="style_lineApp">
                <img src="@/assets/imgs/line_app.svg" alt="LINE推播">
                LINE推播
            </div>
        </el-form-item> -->

            <!-- <el-form-item label="時間">
            <el-time-select
                v-model="formpush.time"
                style="width: 150px"
                start="00:00"
                step="00:30"
                end="23:59"
                placeholder=""
                 :disabled="isDisabled"/>
        </el-form-item> -->
            <div class="formpush-date">
              <el-form-item label="預約諮詢" class="mr-md-2 mr-0">
                <el-date-picker
                  v-model="formpush.date"
                  type="datetime"
                  placeholder="諮詢日期"
                  format="YYYY/MM/DD HH:mm"
                  date-format="YYYY/MM/DD"
                  time-format="HH:mm"
                  @keydown.enter.prevent
                  :disabled="isDisabled"
                />
              </el-form-item>
              <el-form-item class="d-md-inline-flex d-md-none">
                <!-- 手機按鈕 -->
                <el-button
                  color="#8FC31F"
                  class="btn_addPuch"
                  @keydown.enter.prevent
                  @click="onPuchSubmit(formpush)"
                  :icon="Plus"
                  :loading="loading.addPuchBtn"
                  :disabled="onPuchSubmitisDisabled"
                  >新增</el-button
                >
              </el-form-item>
            </div>

            <el-form-item label="諮詢項目" style="margin-bottom: 0">
              <el-checkbox-group v-model="formpush.type" :disabled="isDisabled">
              
                <el-checkbox v-for="item in options" :value="item.value" name="type" :disabled="item.isDisabled">
                  {{ item.label }}  
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item class="d-none d-md-inline-flex">
              <!-- 電腦按鈕 -->
              <el-button
                color="#8FC31F"
                class="btn_addPuch"
                @keydown.enter.prevent
                @click="onPuchSubmit(formpush)"
                :icon="Plus"
                :loading="loading.addPuchBtn"
                :disabled="onPuchSubmitisDisabled"
                >新增</el-button
              >
            </el-form-item>
          </el-form>
        </template>

        <div class="container-descriptions grid">
          <div class="g-col-12 g-col-md-6">
            <el-descriptions title="術前諮詢" :column="2">
              <template v-for="item in LinePushList" :key="item.date">
                <el-descriptions-item :label="item.title">
                  <div class="descriptions_text" v-if="item.done !== 0">
                    <el-icon><Calendar :color="item.done == 1 ? '#A8ABB2' : '#008CD6'" /></el-icon>
                    <span :class="item.done == 2 ? 'text-primary' : ''"
                      >{{ item.date ? GetDateYYYYMMDD(item.date) : '' }} {{ item.date ? GetHHmm(item.date) : '' }}</span
                    >
                    <template v-if="item.done == 1">
                      <el-button
                        class="btn_done"
                        v-if="item.Type == 3 && (formline.check || formline.failure)"
                        :disabled="true"
                        @click="onPuchSubmitDone(item)"
                        >已完成</el-button
                      >
                      <el-button class="btn_done" v-else :disabled="isDisabled" @click="onPuchSubmitDone(item)"
                        >已完成</el-button>
                    </template>
                  </div>
                </el-descriptions-item>


              </template>
            </el-descriptions>
          </div>

          <div class="g-col-12 g-col-md-6">
            <el-descriptions title="術前檢查" :column="2">
              <template v-for="(item, index) in LinePushChecking" :key="item.date">
                <el-descriptions-item v-if="item.Type == 1" :label="item.title">
                  <div class="descriptions_text" v-if="item.done !== 0">
                    <el-icon><Calendar :color="item.done == 1 ? '#A8ABB2' : '#008CD6'" /></el-icon>
                    <span :class="item.done == 1 ? '#333333' : 'text-primary'">{{
                      item.date ? GetDateYYYYMMDD(item.date) : ''
                    }}</span>
                  </div>
                </el-descriptions-item>
                <el-descriptions-item v-else :label="item.title">
                  <div class="descriptions_text" v-if="item.done !== 0">
                    <el-icon><Calendar :color="item.done == 1 ? '#A8ABB2' : '#008CD6'" /></el-icon>
                    <span :class="item.done == 2 ? 'text-primary' : '#333333'">{{
                      item.date ? GetDateYYYYMMDD(item.date) : ''
                    }}</span>
                  </div>
                </el-descriptions-item>
              </template>
            </el-descriptions>
          </div>
        </div>
      </el-card>

      <el-card class="card_formMedication" shadow="never">
        <el-form :inline="true" :model="formMedication"  class="grid container-formMedication">
          <div class="g-col-12 g-col-md-8 container-formMedication-txt">
            <div class="container-descriptions-title">用藥諮詢</div>
            <div class="row grid">
              <el-form-item label="抗凝血藥物：" class="g-col-12 g-col-md-4">
                <el-input
                  style="width: 100%"
                  v-model="formMedication.Anticoagulant"
                  placeholder=""
                  @input="onformMedication"
                  clearable
                  :disabled="isDisabled"
                />
              </el-form-item>
              <el-form-item label="糖尿病藥物：" class="g-col-12 g-col-md-4">
                <el-input
                  style="width: 100%"
                  v-model="formMedication.Diabetes"
                  placeholder=""
                  @input="onformMedication"
                  clearable
                  :disabled="isDisabled"
                />
              </el-form-item>
              <el-form-item label="其他：" class="g-col-12 g-col-md-4">
                <el-input
                  style="width: 100%;"
                  v-model="formMedication.other"
                  placeholder=""
                  @input="onformMedication"
                  clearable
                  :disabled="isDisabled"
                />
              </el-form-item>
            </div>
          </div>

          <div class="g-col-12 g-col-md-4">
            <div class="container-descriptions-title" style="padding-top: 4px; padding-bottom: 4px">
              Womac術前分數
              <div class="container-upload">
                <!-- :show-file-list="showFileList"   -->
                <el-upload
                  ref="uploadRef"
                  action=""
                  :limit="1"
                  accept=".pdf" 
                  :on-change="handlechange"              
                  :on-exceed="handleEnglishExceed"
                  :on-remove="handleEnglisRemove"
                  v-model:file-list="fileList"
                  class="container-upload-file d-none d-md-flex"
                  :show-file-list="!isDisabled"
                  :auto-upload="false">
                  <template #trigger>
                    <el-button type="primary" plain style="align-items: center" :disabled="isDisabled">
                      <el-icon size="24"><img class="upload-btn-icon" alt="" /></el-icon>上傳
                    </el-button>
                  </template>
                </el-upload>
                <div v-show="!isDisabled && !fileList[0]?.name"  class="container-upload-text"> {{ fileListName }}</div>
                 
                <el-button  type="primary" v-if="fileListId && isDisabled" link @click="btnCheck(fileListId)">
                  查看
                  </el-button>
              </div>
            </div>
            <el-form-item>
  <el-input
    style="width: 80px; margin-right: 10px"
    v-model="formMedication.Womac"
    placeholder=""
    :class="{'error-class': hasError}" 
    @input="handleInput"
    clearable
    :disabled="isDisabled"
  />
  分
</el-form-item>
          </div>

          <div class="g-col-12">
            <div class="container-descriptions-title">治療經過</div>
            <el-form-item style="width: 100%">
              <el-input v-model="formMedication.textarea" type="textarea" placeholder="" :disabled="isDisabled" />
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </el-scrollbar>
    <el-scrollbar class="container-OperationView" v-else-if="activeName == 2">
      <Operation :Data="OperationData" />
    </el-scrollbar>

    <el-scrollbar v-if="activeName == 3" v-loading="Statsloading">
      <el-scrollbar>
        <div class="container-ObservationValue">
          <el-segmented v-model="ObservationValue" :options="ObservationDate" @change="onChangeObservation">
            <template #default="{ item }">
              <div>{{ item.label }}</div>
            </template>
          </el-segmented>
        </div>
      </el-scrollbar>
 
      <card
        :Data="form_day"
        ref="uploadComponentRef"
        :LineData="formpush_day"
        :Page="ObservationValue"
        :files="ObservationFile"
        :isDisabled="isDisabled"
        :CaseRowId="isRowId.CaseRowId"
        @SendFilesChange="ReplySendFiles"
        @uploadRemove="onReplyhandleUploadremove"
        @SendReplyDate="onReplyDate"
        @SendCareType="onReplyCareType"
    
        @Send="ReplyForm"
      />
    </el-scrollbar>
  </template>

  <el-dialog v-model="centerDialogVisible" title="確定離開嗎？"  align-center>
    <span>離開前請確認所有資料已經儲存</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="LeaveCancel">取消</el-button>
        <el-button type="primary" @click="LeaveOK($event)"> 確定 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="DoneVisible" title="確認完成諮詢嗎？"  align-center>
                   <template #footer>
                      <div class="dialog-footer">
                        <el-button @click="DoneVisible = false">取消</el-button>
                        <el-button type="primary" @click="DoneVisibleOK(showDoneList)"> 確定 </el-button>
                      </div>
                  </template>
  </el-dialog>
  <el-dialog v-model="CaseVisible" :title="'是否要'+ caseName() +'？'"  align-center>
                   <template #footer>
                      <div class="dialog-footer">
                        <el-button @click="CaseVisible = false">取消</el-button>
                        <el-button type="primary" @click="onCaseChange(isCaseStatus)"> 確定 </el-button>
                
                      </div>
                  </template>
  </el-dialog>

</template>
<script setup>
import { ref, reactive, watch, computed, nextTick, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ElLoading } from 'element-plus';
import Operation from '@/views/caseTracking/content/Operation.vue';
import BtnLoading from '@/components/loading/btnLoading.vue';
import iconSvg from '@/components/loading/iconSvg.vue';
import Check from '@/components/Check.vue';
import svgLoading from '@/composable/svgLoading.js';
import { Plus, Calendar } from '@element-plus/icons-vue';
import card from '@/views/caseTracking/content/card/TrackCard.vue';
import { ElMessageBox } from 'element-plus'
import Information from '@/views/caseTracking/content/card/Information.vue';
import {
  CaseBasicData,
  CaseBasicOpr,
  PreConsultant,
  SetCaseStatus,
  SaveConsultant,
  SaveCase,
  GetPostOperativeTrackRecord,
  SavePostOperativeTrackRecord,
} from '@/api/account';
import { Upload } from '@/api/common.js'; // 引入你的 Upload 函數
import UploadFunction from '@/utils/URL.js';
import useDate from '@/utils/date';

const { GetDateYYYYMMDD, GetHHmm, GetNowDateYYYYMMDD, GetDateTimeYYYYMMDDHHmmApi } = useDate();
import listData from '@/composable/list.js';
import { fa } from 'element-plus/es/locale/index.mjs';
const { options, ResetOptions } = listData();
const { UploadView } = UploadFunction();
const LeaveOKCode = ref(null);
const isRowId = reactive({});
const isDisabled = ref(true);
let Statsloading = ref(false);
const uploadComponentRef = ref(null);
const isCaseDisabled = ref({
  Edit: false,
  Done: true,
});
const CaseVisible = ref(false);
const emptyView = ref(false);
const pendingTabName = ref(null); // 暫存將切換到的標籤
const previousElement = ref(null);
const centerDialogVisible = ref(false);
const onPuchSubmitisDisabled = ref(true);
const OperationData = ref([]);
const showListConsultant = ref([]);
const router = useRouter();
const isCaseStatus = ref(null);
const showCaseStatus = ref(null);
const MedicationListShow = ref([]);
const fileListName = ref(""); 
const ReplyFile = ref(null);
const showFileList = ref(true); // 動態控制是否顯示內建檔案名稱
const activeName = ref('1'); // 1 = 術前諮詢, 2=手術, 3= 術後追蹤
const handleUploadSuccess = () => {
  // 上傳成功後隱藏內建檔案名稱
  showFileList.value = false;
};
const loading = reactive({
  caselist: false, // 清單loading
  EditBtn: false, // 編輯loading
  saveBtn: false, //儲存loading
  caseBtn: false, // 收案loading
  addPuchBtn: false,
});
const formline = reactive({
  date: null, // 收案日期
  height: null, //身高
  weight: null, //體重
  BMI: null, //BMI:
  check: null, //拒檢營養諮詢 --- //營養諮詢狀態 1:同意檢查 2:拒絕檢查
  failure: null, //未達營養諮詢轉介標準"
});

const formMedication = reactive({
  Anticoagulant: null, //抗凝血藥物
  Diabetes: null, //糖尿病藥物
  other: null,
  Womac: null,
  textarea: '',
});
const bmiData = ref(null);
const bmi = ref(null);
const isRed = computed(() => {
  if (bmi.value === null) return false;
  return bmi.value < 18.5 || bmi.value >= 27;
});

// if(formline.failure == null){
//     if(bmi.value < 18.5 || bmi.value > 27){
//         formline.failure = false;//達轉介標準，文字呈現紅色
//     }else{
//         formline.failure = true; //未達轉介標準
//     }
// }

const isDisabledTab = computed(() => {
  return caselist_value.value.type;
});

function calculateBMI() {
  bmi.value = null;
  if (formline.height || formline.weight) {
    const heightInMeters = formline.height / 100; // 身高轉換為公尺

    if (heightInMeters > 0 && formline.weight > 0) {
      bmi.value = (formline.weight / heightInMeters ** 2).toFixed(1);
      if (bmi.value < 18.5 || bmi.value >= 27) {
        formline.failure = false; //達轉介標準，文字呈現紅色
      } else {
        formline.failure = true; //未達轉介標準
      }
    } else {
      bmi.value = null;
    }
  }
}

function caseName(){
      if(isCaseStatus.value == 1){
        return "收案"

      }else if(isCaseStatus.value == 3){
        return "結案"
      }else if(isCaseStatus.value == 4){
        return "轉收案"
      }
}

const uploadRef = ref();
const fileList = ref([]);
const fileListId = ref('');

const handlechange = (files)=>{
  const maxSize = 3 * 1024 * 1024; // 3MB
  if (files.raw.size > maxSize) {
 
    ElMessageBox.alert(`檔案大小不能超過 3MB！`,  {       
         confirmButtonText: '確定',
         showClose: false,
         center: true            
       })
    if(uploadRef.value){
          uploadRef.value.clearFiles();
    }

} 

}


const handleEnglishExceed = (files, fileList) => {


  showFileList.value = false;
  uploadRef.value.clearFiles();
  nextTick(() => {
    fileList[0].name = files[0].name;
    fileList[0].raw = files[0];
    uploadRef.value.handleStart(files[0]);
  });
  // form.value.englishFile[0].raw = files[0];
};


const handleEnglisRemove = (files)=>{
  fileList.value = []


}

// const BasicinformationData = reactive({
//     Name:"葉大雄",
//     IdNo:"H123456789",
//     BirthDate:"1945-04-08T00:00:00",
//     Age:"79歲8個月",
//     Phone:"0912345678",
//     History:"CKD、糖尿病、高血壓、Left SFV distal DVT under Xarelto"
// });

const ObservationFile = ref([]);
const ObservationDate = ref([
  {
    label: '術後一天',
    value: {
      id: '1',
      Code: LeaveOKCode.value,
    },
  },
  {
    label: '出院後五天',
    value: {
      id: '2',
      Code: LeaveOKCode.value,
    },
  },
  {
    label: '出院後兩周',
    value: {
      id: '3',
      Code: LeaveOKCode.value,
    },
  },
  {
    label: '術後一個月',
    value: {
      id: '4',
      Code: LeaveOKCode.value,
    },
  },
]);

const LinePushChecking = ref([
  {
    title: '心臟超音波：',
    date: null,
    done: null,
    Type: null,
  },
  {
    title: '心電圖：',
    date: null,
    done: null,
    Type: null,
  },
  {
    title: '抽血檢驗：',
    date: null,
    done: null,
    Type: null,
  },
  {
    title: '胸部X光：',
    date: null,
    done: null,
    Type: null,
  },
]);

const LinePushList = ref([
  {
    title: '麻醉諮詢：',
    date: null,
    done: null,
    Type: null,
  },
  {
    title: '復健諮詢：',
    date: '',
    done: null,
    Type: null,
  },
  {
    title: '營養諮詢：',
    date: '',
    done: null,
    Type: null,
  },
  {
    title: '個管師諮詢：',
    date: '',
    done: null,
    Type: null,
  },
]);

const onPuchSubmit = (val) => {
  // showListConsultant.value = [];

  val.type.forEach((item) => {
    const Types = item.toString();

    // 每次迴圈都創建新的 list 物件
    const list = {
      title: '',
      date: val.date,
      done: 1, //狀態 1:已預約 2:已完成
      Type: null,
    };
    //打包傳後端
    const show = {
      Type: null, //諮詢類型 1:麻醉諮詢 2:復健諮詢 3:營養諮詢 4:個管師諮詢
      DateTime: null, //諮詢日期時間
      Status: null, //狀態 1:已預約 2:已完成
    };

    switch (Types) {
      case '1':
        list.title = '麻醉諮詢 : ';
        list.Type = 1;
        LinePushList.value[0] = list; // 更新索引 0
        show.Type = 1;
        show.DateTime = list.date;
        show.Status = list.done;
        break;
      case '2':
        list.title = '復健諮詢 : ';
        list.Type = 2;
        LinePushList.value[1] = list; // 更新索引 1
        show.Type = 2;
        show.DateTime = list.date;
        show.Status = list.done;
        break;
      case '3':
        list.title = '營養諮詢 : ';
        list.Type = 3;
        LinePushList.value[2] = list; // 更新索引 2
        show.Type = 3;
        show.DateTime = list.date;
        show.Status = list.done;
        break;
      case '4':
        list.title = '個管師諮詢 ： ';
        list.Type = 4;
        LinePushList.value[3] = list; // 更新索引 3
        show.Type = 4;
        show.DateTime = list.date;
        show.Status = list.done;
        break;
      default:
        console.log(`未知選項: ${items}`);
        return;
    }
    val.date = ""
    let data = showListConsultant.value.findIndex((x) => x.Type == Types);
    if (data != -1) {
      showListConsultant.value.splice(data, 1);
    }
    showListConsultant.value.push(show);
  });
};

const DoneVisible = ref(false);

const showDoneList =  ref(null);
const onPuchSubmitDone = (val) => {
console.log(val);
  if(val.date !== null){
    DoneVisible.value  = true;
    showDoneList.value = val;

  }

};

if(showDoneList.value?.done == '2' && showDoneList.value?.Type == '3'){

}

const DoneVisibleOK = (val)=>{

  const show = {
    Type: val.Type, //諮詢類型 1:麻醉諮詢 2:復健諮詢 3:營養諮詢 4:個管師諮詢
    DateTime: val.date, //諮詢日期時間
    Status: (val.done = 2), //狀態 1:已預約 2:已完成
  }
  let data = showListConsultant.value.find((x) => x.Type == val.Type);
  if (data) {
    data.DateTime = val.date;
    data.Status = val.done = 2;
  } else {
    showListConsultant.value.push(show);
  }
  DoneVisible.value = false;
}



const goBack = (Code) => {
  LeaveOKCode.value = null;
  previousElement.value = 'goBack';

  // addEventListener('click', (e) => {
  //   previousElement.value = e.target;
  // });

  if (Code == 0 || isDisabled.value) {
    // router.push({ name: 'CaseTracking'})
    router.go(-1);
  } else {
    centerDialogVisible.value = true;

    return;
  }
};

// addEventListener('click', (e)=>{
//     previousElement.value = e.target;
//  console.log(e.target, "e.target");

// });

const LeaveCancel = () => {
  if (previousElement.value == 'ObservationDate') {
    ObservationValue.value = prevObservationValue.value;
  } else if (previousElement.value == 'Operation') {
    caselist_value.value = prevcaselist_value.value;
  }

  ObservationFile.value = [];
  // LeaveOKCode.value = 0;
  // if(previousElement== 'ObservationDate'){
  //   ObservationValue.value = prevObservationValue.value;
  // }else{
  centerDialogVisible.value = false;
  // }
};

const LeaveOK = (event) => {
  LeaveOKCode.value = 0;
  centerDialogVisible.value = false;

  // const type = previousElement.value.getAttribute('name');
  console.log(previousElement.value, 'LeaveOK');

  if (previousElement.value == 'editBtn') {
    console.log('LeaveOK', 'editBtn');
    isCaseDisabled.value.Done = true;
    onEditChange();
  } else if (previousElement.value == 'goBack') {
    goBack(LeaveOKCode.value);
  } else if (previousElement.value == 'tab') {
    handleClick(caselist_value.value);
    if (pendingTabName.value) {
      activeName.value = pendingTabName.value; // 切換到暫存的標籤
      pendingTabName.value = null; // 清空暫存
    }
  } else if (previousElement.value == 'ObservationDate') {
    console.log(nextObservationValue.value, 'LeaveOK');
    // ObservationValue.value = nextObservationValue.value;
    // prevObservationValue.value =  nextObservationValue.value;
    ObservationChange(ObservationValue.value);
    ObservationFile.value = [];
  } else if (previousElement.value == 'CaseStatus') {
    console.log('LeaveOK', 'CaseStatus');
    if (pendingCaseStatus.value) {
      onCaseChange(pendingCaseStatus.value);
    }
    // onChangeObservation(ObservationValue.value);
  } else if (previousElement.value == 'Operation') {
    // console.log(nextObservationValue.value, 'LeaveOK');
    // ObservationValue.value = nextObservationValue.value;
    // prevObservationValue.value =  nextObservationValue.value;
    
    formpush.date = '';
    onChangeCaselist(caselist_value.value);
  } else {
    console.log('LeaveOK', 'else');
    console.log('LeaveOK', LeaveOKCode.value);
  }

  // previousElement.value = null;
};

const handleClick = (val) => {
  LeaveOKCode.value = null;

  caselist_value.value = val;
  formpush.type = [];
  showListConsultant.value = [];

  ObservationValue.value = ObservationDate.value[0].value;
  prevObservationValue.value = Object.assign(ObservationDate.value[0].value);
  api_CaseBasicData(val.OprRowId, JSON.parse(history.state.plan).PatientRowId, 3);




  previousElement.value = null;
};

const beforeLeave = (newTabName, oldTabName) => {
  console.log(LeaveOKCode.value, 'beforeLeave');
  console.log(isDisabled.value, 'beforeLeave');

  pendingTabName.value = newTabName; // 暫存目標標籤
  if (isDisabled.value) {
    LeaveOKCode.value = null;
    console.log('允許切換');
    formpush.date = '';
    handleClick(caselist_value.value);
    return true; // 允許切換
  } else {
    LeaveOKCode.value = null;
    previousElement.value = 'tab';
    // addEventListener('click', (e) => {
    //   previousElement.value = e.target;

    // });
    centerDialogVisible.value = true; // 彈出提示框
    return false; // 阻止切換
  }
};

const btnCheck = (id) => {
  Upload(id) // 使用檔案名稱作為參數調用 API
    .then((res) => {
      const { Code } = res;
      UploadView(res);
    });
};

const ObservationValue = ref();
const caselist_value = ref();
const prevcaselist_value = ref();
const BasicinformationData = ref({});
const caselist_card = ref([]);

const onformMedication = () => {
  MedicationListShow.value = []; // 清空列表

  if (formMedication.Anticoagulant) {
    MedicationListShow.value.push({
      Type: 1,
      Content: formMedication.Anticoagulant,
    });
  }
  if (formMedication.Diabetes) {
    MedicationListShow.value.push({
      Type: 2,
      Content: formMedication.Diabetes,
    });
  }
  if (formMedication.other) {
    MedicationListShow.value.push({
      Type: 99,
      Content: formMedication.other,
    });
  }
};

const pendingCaseStatus = ref(null);

const onCase = (isRowId, Status) => {
  LeaveOKCode.value = null;
  previousElement.value = 'CaseStatus';
 
  // addEventListener('change', (e) => {
  //   previousElement.value = e.target;
  // });

  if (!isDisabled.value) {
    pendingCaseStatus.value = Status;
    // isCaseStatus.value = showCaseStatus.value;
    // centerDialogVisible.value = true;
    ElMessageBox.alert(`請先儲存資料或取消編輯`,  {       
              confirmButtonText: '確定',
              showClose: false,
              center: true            
            })
    return;
  }else{
    CaseVisible.value = true;
    console.log("收案");
  }

  // onCaseChange(Status);
};

const onCaseChange = (item) => {

  // isCaseStatus.value = item;
  showCaseStatus.value = item;
 
  if (item == 3 || item == 0) {
    isDisabled.value = true;
    isCaseDisabled.value.Edit = true;
    isCaseDisabled.value.Done = true;
  } else {
    isCaseDisabled.value.Edit = false;
  }
  CaseVisible.value = false;
  let paramsList = {
    OprRowId: isRowId.OprRowId, //手術識別碼
    CaseRowId: isRowId.CaseRowId, //個案識別碼
    CaseStatus: isCaseStatus.value, //收案狀態 1:收案 3:手動結案 4:結案後再收案
  };
  Statsloading.value = ElLoading.service({
    lock: false,
    text: 'loading',
    svg:svgLoading,
    background: 'transparent',
  });
  SetCaseStatus(paramsList).then((res) => {
    const { Code, Data } = res;
    // console.log(res, '3.3 個案詳情-設定收案狀態');
    if (Code == 0) {

      CaseVisible.value = false;
      api_CaseBasicData(isRowId.OprRowId, JSON.parse(history.state.plan).PatientRowId, 3); //3.1 個案詳情-基本資料
      if(showCaseStatus.value == 1){
        activeName.value = "1";
      }

    }
  }).finally(() => {
    Statsloading.value.close();
  });



  pendingCaseStatus.value = null;
  showListConsultant.value = [];
};



const codeStateId = ref(null);


if(history.state.plan !== undefined){


const stateId = ref(JSON.parse(history.state.plan));

if (stateId.value['OprRowId'] === undefined) {
  codeStateId.value = 0;

    api_CaseBasicData('', JSON.parse(history.state.plan).PatientRowId, 0);


} else {
  codeStateId.value = 2;
  isRowId.OprRowId = stateId.value['OprRowId'];
  api_CaseBasicData(isRowId.OprRowId, JSON.parse(history.state.plan).PatientRowId, 1);
}
}else{
  router.push({ path: '/case-tracking' });
      
}

const ChangeCaselist = (val) => {
  LeaveOKCode.value = null;

  if (!isDisabled.value) {
    previousElement.value = 'Operation';

    //  ObservationValue.value =  prevObservationValue.value
    nextObservationValue.value = val;
    centerDialogVisible.value = true;
    return;
  }

  onChangeCaselist(val);
};

const onChangeCaselist = (val) => {
  fileList.value = [];
  formpush.type = [];

  showListConsultant.value = [];
  isRowId.OprRowId = val.OprRowId;
  ResetOptions();
  activeName.value = '1';
  ObservationValue.value = ObservationDate.value[0].value;
  api_CaseBasicData(val.OprRowId, JSON.parse(history.state.plan).PatientRowId, 2); //3.1 個案詳情-基本資料
};

const formpush = reactive({
  date: null, //諮詢時間
  method: 'LINE@', //關懷方式
  type: [], //推播對象
  done: true,
  woundState: [],
  textarea:
    '',
});

//line 推播若沒有選擇諮詢項目按鈕不顯示
watch(formpush, (val) => {
  if (val.type.length > 0 && val.date !== "" && val.date !== null) {
    onPuchSubmitisDisabled.value = false;
  } else {
    onPuchSubmitisDisabled.value = true;
  }
});





//點選「拒檢營養諮詢 或 未達轉介標準 」的話，鎖住營養推播欄位，不可新增
watch(
  [formline, showDoneList],
  ([val, show]) => {


 
    if (val.check || val.failure || val.height == null || val.weight == null || (show?.done == '2' && show?.Type == '3')) {
      // 不可新增營養推播
      options.value.forEach((item) => {
        if (item['value'] == 3) {
          item.isDisabled = true;
        }
      });
    } else {
      // 可新增營養推播
      options.value.forEach((item) => {
        if (item['value'] == 3 && item['done'] !== 2) {
          item.isDisabled = false;
        }
      });
    }
    if (showCaseStatus.value !== 3) {
      isCaseDisabled.value.Edit = false;
      isCaseDisabled.value.Done = true;
      if (val.weight != null && val.height !== null && val.date !== null && isDisabled.value !== true) {
        isCaseDisabled.value.Done = false;
      } else {
        isCaseDisabled.value.Done = true;
      }
    } else {
      isCaseDisabled.value.Edit = true;
      isCaseDisabled.value.Done = true;
    }
  },
  { immediate: true, deep:true }
);

// watch(
//   isCaseStatus,
//   (item) => {
//     showCaseStatus.value = item;
//     if (item == 3 || item == 0) {
//       isDisabled.value = true;
//       isCaseDisabled.value.Edit = true;
//       isCaseDisabled.value.Done = true;
//     } else {
//       isCaseDisabled.value.Edit = false;
//       // isCaseDisabled.value.Done = true;
//     }
//   },
//   { immediate: true }
// );

//追蹤回覆
const formpush_day = reactive({
  ReplyDate: '', //諮詢時間
  CareType: 'LINE@', //關懷方式
  type: [],
  Answer: '',
  woundState: [],
  textarea: [],
  img: [],
});

//個管師紀錄
const form_day = reactive({
  TrackDate: '', //術後追蹤日
  ReplyDate: '', //回覆日期
  CareType: null, //關懷方式
  type: [], //類型1:單選2:複選
  Answer: '', //使用者回覆資料
  sutures: null,
  woundState: [], //3:輸入框4
  textarea: [],
  SituationType: 0, //術後追蹤情境，1: 術後一天2: 出院後五天3: 出院後兩周4: 術後一個月
});

import { TOKEN } from '@/config/constant';
import cookies from '@/utils/cookies';
import { v4 as uuidv4 } from 'uuid';
import { encryptStorage } from '@/utils/EncryptStorage';
import useCryptoJs from '@/composable/aesUtils.js';
import moment from 'moment';
const { EncryptInit, DecryptInit } = useCryptoJs(); //加密

const token = encryptStorage.getItem('Token');
const formlineLinePushList_new = ref(null);
const formlineLinePushList_old = ref(null);
watch(
  () => LinePushList.value[2], // 監聽 LinePushList.value[2]
  (newValue, oldValue) => {
    formlineLinePushList_new.value = GetDateTimeYYYYMMDDHHmmApi(newValue.date);
    formlineLinePushList_old.value = GetDateTimeYYYYMMDDHHmmApi(oldValue.date);

  }
);
const submitForm = (isRowId, row) => {
  uploadRef.value.clearFiles();
  Statsloading.value = ElLoading.service({
    lock: false,
    svg:svgLoading,
    text: 'loading',
    background: 'transparent',
  });


  const filteredData = showListConsultant.value.reduce((acc, item) => {
    const key = `${item.Type}-${item.DateTime}`; // 使用 Type 和 DateTime 組合成唯一鍵

    // 覆蓋相同鍵的資料，保留最後出現的
    acc[key] = {
      Type: item.Type,
      DateTime: item.DateTime == null?  "" : GetDateTimeYYYYMMDDHHmmApi(item.DateTime),
      Status: item.Status,
    };

    return acc;
  }, {});

  if (activeName.value == 1) {
    let params = {
      OprRowId: isRowId.OprRowId, //手術識別碼
      CaseRowId: isRowId.CaseRowId, //個案識別碼
      CaseDate: formline.date, //收案日期
      Weight: formline.weight, //體重
      Height: formline.height, //身高
      // BMI:bmiData.value ? bmiData.value : parseInt(bmi.value), //BMI
      BMI: bmi.value, //BMI
      NeedNutritionalConsultation: !formline.failure, //是否達營養諮詢 true是達 false是未達
      NutritionalConsultationStatus: formline.check ? 2 : 1, //營養諮詢狀態 1:同意檢查 2拒絕檢查
      WomacScore: parseInt(formMedication.Womac), //術前Womac分數
      TreatmentProcess: formMedication.textarea ? formMedication.textarea : '', //治療過程
      MedicationList: MedicationListShow.value, //用藥諮詢清單
    };

    const files = row[0] ? row[0].raw : null;
    let formData = new FormData();

    if(formline.failure || formline.check){
          if(formlineLinePushList_new.value !== formlineLinePushList_old.value){
            ElMessageBox.alert(`您已勾選未達營養諮詢轉介標準或拒檢營養諮詢，將不會儲存營養諮詢資料。`,  {       
              confirmButtonText: '確定',
              center: true,
              showClose: false,
              customClass:'ElMessageBoxCenter'
              
            })       
          }
    }
     
    let list = {
      Token: token,
      DeviceId: encryptStorage.getItem('DeviceId'),
      Version: import.meta.env.VITE_Version,
      ActionId: uuidv4(),
      Data: params, //加密
    };
    // console.log(list, '3.7 個案詳情-個案存檔');
    formData.append('Data', EncryptInit(list)); // 將加密的資料加入
    formData.append('FileName', files); // 添加檔案名稱

    SaveCase(formData)
      .then((res) => {
        const { Code } = res;
        // console.log(res, "3.7 個案詳情-個案存檔");
        if (Code == 0) {
          loading.saveBtn = true;
          isDisabled.value = true;
          isCaseDisabled.value.Edit = false;
          isCaseDisabled.value.Done = true;

          let paramsList = {
            OprRowId: isRowId.OprRowId, //手術識別碼
            CaseRowId: isRowId.CaseRowId, //個案識別碼
            List: Object.values(filteredData),
          };
        

          formpush.date = '';
          formpush.type = [];
          if (paramsList.List.length !== 0) {
            SaveConsultant(paramsList)
              .then((res) => {
                const { Code, Data } = res;
                //  console.log(res, "3.5 個案詳情-諮詢時間存檔");
                if (Code == 0) {
                  showListConsultant.value = [];
                  api_PreConsultant(isRowId.OprRowId); // 3.4 個案詳情-術前諮詢詳情
                } else {
                  isCaseDisabled.value.Done = false;
                  isDisabled.value = false;
                }
              })
              .finally(() => {
                loading.saveBtn = false;
                Statsloading.value.close();
              });
          }
          api_PreConsultant(isRowId.OprRowId); // 3.4 個案詳情-術前諮詢詳情

          ElMessage({
            message: '儲存成功',
            type: 'success',
            duration: 3 * 1000,
          });
        } else {
          isCaseDisabled.value.Done = false;
          isDisabled.value = false;
        }
      })
      .finally(() => {
        loading.saveBtn = false;
        Statsloading.value.close();
      });
  }
};
const cardParamsList = ref([]);
const ReplyForm = (val) => {
  cardParamsList.value = [];
  const List = val.reduce((acc, item) => {
    const key = `${item.QuestionCode}`; // 使用 Type 和 DateTime 組合成唯一鍵

    // 覆蓋相同鍵的資料，保留最後出現的
    acc[key] = {
      QuestionCode: item.QuestionCode,
      Answer: item.Answer,
      InputContent: item.InputContent,
    };

    return acc;
  }, {});
  cardParamsList.value.List = List;
  cardParamsList.value = val;
};

const onReplyDate = (val) => {
  form_day.ReplyDate = val; //回覆日期
};

const onReplyCareType = (val) => {
  form_day.CareType = val; //關懷方式
};

const ReplySendFiles = (val) => {

  ReplyFile.value = val;
};

watch(
  [form_day, isDisabled], // 同時監聽 form_day 和 isDisabled
  ([formDayValue, isDisabledValue]) => {
    if (activeName.value == 3) {
      if (isDisabledValue || !formDayValue.ReplyDate || formDayValue.CareType == 0) {
        isCaseDisabled.value.Done = true;
      } else {
        isCaseDisabled.value.Done = false;
      }
    }
  }
);

const prevObservationValue = ref(null); // **記錄前一次的值**
const nextObservationValue = ref(null); // **記錄前一次的值**

// watch(ObservationValue, (newVal, oldVal) => {
//   console.log(oldVal ,'ObservationValue watch')
//   console.log(newVal)

// //   prevObservationValue.value = oldVal; // **當 ObservationValue 變更時記錄**
// //   nextObservationValue.value = newVal; // **當 ObservationValue 變更時記錄**
// } );

const onChangeObservation = (Situation) => {
  LeaveOKCode.value = null;
  // console.log(Situation, 'onChangeObservation')
  // console.log(ObservationValue.value)
  // console.log(prevObservationValue.value)
  // console.log(nextObservationValue.value)

  if (!isDisabled.value) {
    previousElement.value = 'ObservationDate';

    //  ObservationValue.value =  prevObservationValue.value
    nextObservationValue.value = Situation;
    centerDialogVisible.value = true;
    return;
  }

  ObservationChange(Situation);
  //  isDisabled.value = true;
  // isCaseDisabled.Done = true;
  // prevObservationValue.value = Situation;
  // api_GetPostOperativeTrackRecord(isRowId.CaseRowId, Situation.id);

  // if (Situation.Code == 0 || isDisabled.value) {
  // isDisabled.value = true;
  // isCaseDisabled.Done = true;
  // prevObservationValue.value = Situation;
  // api_GetPostOperativeTrackRecord(isRowId.CaseRowId, Situation.id);
  // } else {

  //    // **儲存當前選擇的值**

  //    ObservationValue.value =  prevObservationValue.value
  //  nextObservationValue.value = Situation;

  // console.log(ObservationValue.value, 'ObservationDate')
  // console.log(prevObservationValue.value)
  // console.log(nextObservationValue.value)

  // // prevObservationValue.value = Situation.id;
  //    return false; // 阻止切換
  //   // nextTick(() => {
  //   //   if(prevObservationValue.value.id){
  //   //     ObservationValue.value = prevObservationValue.value;
  //   //   }else{
  //   //     ObservationValue.value = ObservationDate.value[0].value;
  //   //   }
  //   // });

  // }
};

const ObservationChange = (Situation) => {
  isDisabled.value = true;
  isCaseDisabled.Done = true;
  prevObservationValue.value = Situation;
  api_GetPostOperativeTrackRecord(isRowId.CaseRowId, Situation.id);
};

const submitReplyForm = (val, row) => {

  let paramsList = {
    CaseRowId: isRowId.CaseRowId,
    TrackDate: form_day.TrackDate, //術後追蹤日
    ReplyDateTime: form_day.ReplyDate, //回覆日期
    CareType: form_day.CareType, //關懷方式1:Line@ 2:電訪 3:病房 4:門診
    SituationType: ObservationValue.value.id, //術後追蹤情境，1: 術後一天2: 出院後五天3: 出院後兩周4: 術後一個月
    List: val,
  };

  let formData = new FormData();
  const files = row ? row.raw : null;
  let list = {
    Token: token,
    DeviceId: encryptStorage.getItem('DeviceId'),
    Version: import.meta.env.VITE_Version,
    ActionId: uuidv4(),
    Data: paramsList, //加密
  };

  formData.append('Data', EncryptInit(list)); // 將加密的資料加入
  formData.append('FileName', files); // 添加檔案名稱
  SavePostOperativeTrackRecord(formData).then((res) => {
    const { Code, Data } = res;
    console.log(res, '3.8 個案詳情-術後追蹤儲存');
    if (Code == 0) {
      isDisabled.value = true;
      api_GetPostOperativeTrackRecord(isRowId.CaseRowId, ObservationValue.value.id);
    } else {
      isDisabled.value = false;
    }
  });
};

const editFrom = () => {
  LeaveOKCode.value = null;

  if (!isDisabled.value) {
    previousElement.value = 'editBtn';
    centerDialogVisible.value = true;
    return;
  }

  onEditChange();
};
const clearChildFiles = () => {
  if (uploadComponentRef.value) {
    uploadComponentRef.value.clearUploadFiles();
  }
};
const failureChange = ()=>{
  if(formline.failure || formline.check){
    // LinePushList.value[2].date =null;
    // LinePushList.value[2].done = 0;
    for (let i = formpush.type.length - 1; i >= 0; i--) {
      if (formpush.type[i] == "3" || showListConsultant.value[i].Type == "3") {
        formpush.type.splice(i, 1);
        showListConsultant.value.splice(i, 1);
      
      }
      
    }
  }
}


const onEditChange = () => {
  
  isDisabled.value = !isDisabled.value;
 
  if (formline.date == null) {
    formline.date = GetNowDateYYYYMMDD();
  }
  if (isDisabled.value) {

    if (activeName.value == 1) {
      formpush.type = [];
      formpush.date = '';

      if (!formline.weight || !formline.height) {
        isCaseDisabled.value.Done = true;
      } else {
        isCaseDisabled.value.Done = false;
      }
      api_PreConsultant(isRowId.OprRowId);

    } else if (activeName.value == 3) {

      if (uploadComponentRef.value) {
          //子層事件
          console.log("子 層 取消");
          ReplyFile.value = ""
          form_day.ReplyDate="";
          form_day.CareType = "";
          form_day.Answer = "";
          form_day.woundState = [];
          form_day.textarea = [];
      
          uploadComponentRef.value.handleEnglishExceed();
        }
      onReplyhandleUploadremove();
    
      api_GetPostOperativeTrackRecord(isRowId.CaseRowId, ObservationValue.value.id);
    }
  } else {



    if (!formline.date) {
      formline.date = moment();
      api_GetPostOperativeTrackRecord(isRowId.CaseRowId, ObservationValue.value.id);
    }

    if (!formline.weight || !formline.height) {
      isCaseDisabled.value.Done = true;
    } else {
      isCaseDisabled.value.Done = false;
    }

    if (activeName.value == 3) {
      console.log(form_day, 'form_day');
      if (form_day.ReplyDate == null) {
        console.log(form_day.ReplyDate, 'form_day ReplyDate null');
        console.log(ObservationValue.value, "ObservationValue");
        if(ObservationValue.value.id == "1"){
          form_day.CareType = 3;
        }
        
      }
      console.log(formpush_day, 'formpush_day');
    }
  }

  showListConsultant.value = [];
  // uploadRef.value.clearFiles();
};

const onReplyhandleUploadremove = () => {

  api_GetPostOperativeTrackRecord(isRowId.CaseRowId, ObservationValue.value.id);
};

const handleUploadremove = () => {
  api_PreConsultant(isRowId.OprRowId);
};
const hasError = ref(false);

const handleInput = (value) => {
  // 移除所有非數字字符
  let newValue = value.replace(/[^0-9]/g, '');
  if (newValue.length > 1) {
    newValue = newValue.replace(/^0+/, '');
  }
  // 限制最大值為 100
  if (parseInt(newValue) > 100) {
    newValue = "100";
    hasError.value = true; // 設定錯誤狀態
  } else {
    hasError.value = false; // 清除錯誤狀態
  }

  // 更新 v-model 的值
  formMedication.Womac = newValue;
};




function activeNameFunction(OprRowId) {
  if (activeName.value == 1) {
    // 3.4 個案詳情-術前諮詢詳情

    api_PreConsultant(OprRowId);
  } else if (activeName.value == 2) {
    //"3.2 個案詳情-手術"

    api_CaseBasicOpr(OprRowId);
  } else if (activeName.value == 3) {
    api_GetPostOperativeTrackRecord(isRowId.CaseRowId, ObservationValue.value.id);
  }
}

function api_CaseBasicData(isOprRowId, isPatientRowId, codeStateId) {
  let paramsList = {
    OprRowId: isOprRowId, //手術識別碼
    PatientRowId: isPatientRowId, //識別碼
  };
  isDisabled.value = true;
  CaseBasicData(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      // console.log(res, '3.1 個案詳情-基本資料');
      if (Code == '0') {
        BasicinformationData.value = Data; //基本資料
        if(BasicinformationData.value){
          emptyView.value = false
        }else{
          emptyView.value = true
        }



        //-------手術按鈕---------------//
        let show = {
          label: null,
          value: null,
          type: true, //是否為Eras
          OprRowId: null,
        };

        caselist_card.value = [];

        caselist_card.value = Data.OprList.map((element) => ({
          label: element.OprDate,
          value: {
            DivisionName: element.DivisionName,
            DoctorName: element.DoctorName,
            OprRowId: element.OprRowId,
            Code: LeaveOKCode.value,
            isCaseRowId: isRowId.CaseRowId,
            type: element.IsCase,
          },
          type: element.IsCase,
          // type: false,
          OprRowId: element.OprRowId,
        }));

        //沒有手術識別碼-個案管理
        if (codeStateId == 0) {
          caselist_value.value = caselist_card.value[0].value;
          prevcaselist_value.value = Object.assign(caselist_card.value[0].value);

          activeNameFunction(caselist_card.value[0].value.OprRowId);
          //有手術識別碼-帳號管理
        } else if (codeStateId == 1) {
          const filteredList = caselist_card.value.filter((val) => {
            return val.OprRowId == isRowId.OprRowId;
          });
          caselist_value.value = filteredList[0].value;
          prevcaselist_value.value = Object.assign(filteredList[0].value);

          activeNameFunction(filteredList[0].value.OprRowId);
        } else {
          const filteredList = caselist_card.value.filter((val) => {
            return val.OprRowId == isOprRowId;
          });
          caselist_value.value = filteredList[0].value;
          prevcaselist_value.value = Object.assign(filteredList[0].value);

          activeNameFunction(caselist_value.value.OprRowId);
        }
      }
    })
    .finally(() => {});
}

function api_CaseBasicOpr(isOprRowId) {
  let paramsList = {
    OprRowId: isOprRowId, //手術識別碼
  };
  Statsloading.value = ElLoading.service({
    lock: false,
    text: 'loading',
    svg:svgLoading,
    background: 'transparent',
  });
  console.log(isOprRowId, '3.2 個案詳情-手術');
  CaseBasicOpr(paramsList).then((res) => {
    const { Code, Data } = res;
    if (Code == 0) {
      OperationData.value = Data;
      console.log(OperationData.value);
    }
    Statsloading.value.close();
    console.log(res, '3.2 個案詳情-手術');
  }).finally(() => {
     
    });;
}

function api_PreConsultant(isOprRowId) {
  let paramsList = {
    OprRowId: isOprRowId, //手術識別碼
  };
  Statsloading.value = ElLoading.service({
    lock: false,
    text: 'loading',
    svg:svgLoading,
    background: 'transparent',
  });

  PreConsultant(paramsList).then((res) => {
    const { Code, Data } = res;
    // console.log(res, '3.4 個案詳情-術前諮詢詳情');
    if (Code == 0) {

      uploadRef.value?.clearFiles();

      isRowId.OprRowId = isOprRowId; //手術識別碼
      isRowId.CaseRowId = Data.CaseRowId; //個案識別碼
      // if(Data.CaseDate){
      //     formline.date = Data.CaseDate; //收案日期
      // }else{
      //     formline.date = moment()
      // }

      formline.date = Data.CaseDate; //收案日期

      formline.height = Data.Height; //身高
      formline.weight = Data.Weight; //體重

      calculateBMI(); // BMI
      bmiData.value = Data.BMI;
      // if (Data.Height !== null && Data.Weight !== null) {
      //   formline.failure = formline.failure !== null ? !Data.NeedNutritionalConsultation : null; //是否未達營養諮詢
      // }
      formline.failure = Data.NeedNutritionalConsultation == null ? null : !Data.NeedNutritionalConsultation;

      //營養諮詢狀態 1:同意檢查 2:拒絕檢查
      if (Data.NutritionalConsultationStatus == 1) {
        formline.check = false;
      } else if (Data.NutritionalConsultationStatus == 2) {
        formline.check = true;
      } else {
        formline.check = null;
      }
      fileListName.value = Data.WomacFileName;
      fileList.value.name = Data.WomacFileName;
      fileListId.value = Data.WomacFileRowId;

      //術前諮詢清單
      //諮詢類型 1:麻醉諮詢 2:復健諮詢 3:營養諮詢 4:個管師諮詢
      if (Data.PreConsultantList) {
        Data.PreConsultantList.forEach((item) => {
          //Status //狀態 0:未預約 1:已預約 2:已完成
          if (item.Type == 1) {
            LinePushList.value[0].date = item.DateTime;
            LinePushList.value[0].done = item.Status;
            LinePushList.value[0].Type = item.Type;

            if (item.Status == 2) {
              options.value[0].isDisabled = true;
              options.value[0].done = item.Status;
            }
          } else if (item.Type == 2) {
            LinePushList.value[1].date = item.DateTime;
            LinePushList.value[1].done = item.Status;
            LinePushList.value[1].Type = item.Type;
            if (item.Status == 2) {
              options.value[1].isDisabled = true;
              options.value[1].done = item.Status;
            }
          } else if (item.Type == 3) {
            LinePushList.value[2].date = item.DateTime;
            LinePushList.value[2].done = item.Status;
            LinePushList.value[2].Type = item.Type;
            if (item.Status == 2) {
              options.value[2].isDisabled = true;
              options.value[2].done = item.Status;

            }

          } else if (item.Type == 4) {
            LinePushList.value[3].date = item.DateTime;
            LinePushList.value[3].done = item.Status;
            LinePushList.value[3].Type = item.Type;
            if (item.Status == 2) {
              options.value[3].isDisabled = true;
              options.value[3].done = item.Status;
            }
          }
        });
      }

      //用藥項目 1:抗凝血藥物 2:糖尿病藥物 99:其他
      if (Data.MedicationList) {
        MedicationListShow.value = [];
        Data.MedicationList.forEach((item) => {
          const show = {
            Type: item.Type,
            Content: item.Content,
          };
          if (item.Type == 1) {
            formMedication.Anticoagulant = item.Content;
            MedicationListShow.value.push(show);
          } else if (item.Type == 2) {
            formMedication.Diabetes = item.Content;
            MedicationListShow.value.push(show);
          } else if (item.Type == 99) {
            formMedication.other = item.Content;
            MedicationListShow.value.push(show);
          }
        });
      }

      formMedication.Womac = Data.WomacScore;
      formMedication.textarea = Data.TreatmentProcess;
      showCaseStatus.value = Data.CaseStatus; //個案狀態 0:未收案 1:收案中 2:結案 3:手動結案 4:手動收案

      if (showCaseStatus.value == 0) {
        isCaseDisabled.value.Edit = true;
        isCaseDisabled.value.Done = true;
      }

      if (Data.PreExamList) {
        Data.PreExamList.forEach((item) => {
          //檢查類型 1:心臟超音波 2: 抽血檢驗 3:心電圖 4:胸部X光
          if (item.Type == 1) {
            LinePushChecking.value[0].date = item.DateTime;
            LinePushChecking.value[0].done = item.Status;

            LinePushChecking.value[0].Type = item.Type;
          } else if (item.Type == 3) {
            LinePushChecking.value[1].date = item.DateTime;
            LinePushChecking.value[1].done = item.Status;
            LinePushChecking.value[1].Type = item.Type;
          } else if (item.Type == 2) {
            LinePushChecking.value[2].date = item.DateTime;
            LinePushChecking.value[2].done = item.Status;
            LinePushChecking.value[2].Type = item.Type;
          } else if (item.Type == 4) {
            LinePushChecking.value[3].date = item.DateTime;
            LinePushChecking.value[3].done = item.Status;
            LinePushChecking.value[3].Type = item.Type;
          }
        });
      }
    }
    Statsloading.value.close();
  }).finally(() => {
   
  });;
}

function api_GetPostOperativeTrackRecord(isCaseRowId, isSituation) {
  // ObservationValue.value = ObservationDate.value[0].value
  Statsloading.value = ElLoading.service({
    lock: false,
    text: 'loading',
    svg:svgLoading,
    background: 'transparent',
  });
  let paramsList = {
    CaseRowId: isCaseRowId, //個案識別碼
    Situation: isSituation,
  };
  GetPostOperativeTrackRecord(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      console.log(res, '3.6 個案詳情-術後追蹤查詢');
      if (Code == 0) {
        form_day.TrackDate = Data.TrackDate;
        const tableData = Data.List;

        tableData.forEach((item) => {
          //關懷方式CareType 1:Line@ 2:電訪 3:病房 4:門診
          if (item.CareType == 1) {
            formpush_day.ReplyDate = item.ReplyDate;
            formpush_day.CareType = item.CareType; //追蹤回覆

            formpush_day.type = [];
            formpush_day.textarea = [];
            formpush_day.Answer = '';
            formpush_day.woundState = [];
            item.Record.forEach((val) => {
              // 類型1:單選2:複選3:輸入框4:上傳檔案&輸入
              if (val.Type !== 3) {
                if (val.Type == 1) {
                  formpush_day.Answer = val.Answer.toString();
                } else if (val.Type == 2) {
                  formpush_day.woundState = val.Answer;
                }

                formpush_day.type.push(val);
              } else {
                formpush_day.textarea.push(val);
              }
            });
          } else {
            form_day.ReplyDate = item.ReplyDate;
            form_day.CareType = item.CareType; //個管師紀錄 //關懷方式
            form_day.type = [];
            form_day.textarea = [];
            form_day.Answer = '';
            form_day.woundState = [];
            form_day.FileNameList = [];
            item.Record.forEach((val) => {
              if (val.Type !== 3) {
                if (val.Type == 1) {
                  form_day.Answer = val.Answer.toString();
                } else if (val.Type == 2) {
                  form_day.woundState = val.Answer; //3:輸入框 4:上傳檔案&輸入
                }

                form_day.type.push(val);
              } else {
                form_day.textarea.push(val);
              }
            });
          }
        });
      }
    })
    .finally(() => {
      Statsloading.value.close();
    });
}


const formlineFailure = computed(()=>{

  if(formline.height !== null && formline.weight !== null){
    return LinePushList.value[2].done == 2 || (bmi.value < 18.5 || bmi.value >= 27)  ? true : isDisabled.value
  }else{
    return isDisabled.value
  }

});


const formlineCheck = computed(()=>{
  return LinePushList.value[2].done == 2 ? true : isDisabled.value
  });
</script>

<style lang="scss" scoped>
.error-class {

  // box-shadow: 0 0 0 1px var(--el-color-danger) inset;

}

h1.page_title {
  @media screen and (max-width: 767px) {
    position: absolute;
    top: 19px;
  }
}

.icon_ERAS {
  background: #eb823d;
  border-color: #eb823d;
  width: fit-content;
  border-radius: 100px;
  padding: 4px;
  color: #fff;
}

.caselist {
  display: flex;
  column-gap: 16px;
  border-radius: 3px;
  min-height: 60px;
  &_content {
    font-size: 15px;
    font-weight: 400;
  }
  &_name {
    display: flex;
    column-gap: 8px;
  }
  &_card {
    min-height: 58px;
    min-width: 118px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    column-gap: 10px;
    line-height: 1.4;
    text-align: left;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
  ::v-deep {
    .el-button > span {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      column-gap: 10px;
      line-height: 1.4;
      text-align: left;
    }

    .el-card__body {
      padding: var(--el-card-padding);
    }
  }
}
::v-deep {
  .el-date-editor {
    --el-date-editor-width: 100%;
  }
  .el-card {
    @media (max-width: 767px) {
      --el-card-padding: 10px 8px;
    }
  }
  .caselist {
    .el-segmented {
      --el-segmented-color: #333333;
      --el-segmented-bg-color: transparent;
      --el-segmented-padding: 0;
      --el-segmented-item-selected-color: #333333;
      --el-segmented-item-selected-bg-color: #e0f2fe;
      // --el-segmented-item-selected-disabled-bg-color: #E0F2FE;
      --el-segmented-item-hover-color: #333333;
      --el-segmented-item-hover-bg-color: #e0f2fe;
      --el-segmented-item-active-bg-color: #e0f2fe;

      // --el-segmented-item-disabled-color: var(--el-text-color-placeholder);
    }
    .el-segmented__item-selected,
    .el-segmented__item:not(.is-disabled):not(.is-selected):hover {
      box-shadow: 0 0 1px 1px #008cd6 inset;
      border-radius: 3px;
    }
    .el-segmented__item {
      border: solid #dcdfe6 thin;
      border-radius: 3px;
      width: 100%;
      padding: 0 10px;
    }
  }

  .el-segmented__group {
    column-gap: 16px;
  }

  .el-loading-spinner .el-loading-text {
    margin: 3px 0 0 3px;
  }

  .el-form--inline .el-form-item {
    margin-right: 20px;
    @media (max-width: 767px) {
      margin-right: 12px;
    }
  }
  // .el-form.form-formline{
  //     column-gap: 20px;
  //     display: flex;
  //     flex-wrap: wrap;
  //     @media (max-width: 767px) {
  //         column-gap: 12px;
  //     }
  // }
  .el-checkbox {
    margin-right: 24px;
    @media (max-width: 767px) {
      margin-right: 15px;
    }
    @media (max-width: 375px) {
      margin-right: 6px;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .el-descriptions__header {
    margin-bottom: 16px;
    border-bottom: solid #dcdfe6 thin;
    padding-bottom: 11px;
  }
  .el-card__header {
    padding: 10px 20px;
    @media (max-width: 767px) {
      padding: 10px 8px;
    }
    .el-form-item--default {
      margin-bottom: 0;
      @media (max-width: 767px) {
        margin-bottom: 15px;
      }
    }
  }
  .el-textarea__inner {
    padding: 21px 16px;
  }

  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: var(--el-checkbox-checked-bg-color);
    border-color: var(--el-checkbox-checked-input-border-color);
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner:after {
    border-color: #fff;
  }
  .el-checkbox__input.is-checked.is-disabled + .el-checkbox__label {
    color: var(--el-checkbox-checked-text-color);
  }
}
.container-tab {
  width: 100%;
  @media screen and (max-width: 767px) {
    width: calc(100% - 32px);
  }
}
.container_menu {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  column-gap: 20px;
  height: 40px;
  width: 100%;

  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    justify-content: space-between;
    column-gap: 10px;
  }
  ::v-deep {
    .el-tabs {
      --el-tabs-header-height: 40px;
    }
    .el-tabs__item {
      font-weight: 600;
      @media screen and (max-width: 767px) {
        padding: 0 10px;
      }
    }
  }
  .activeName-tabs {
    width: 100%;
    ::v-deep {
      .el-tabs__header {
        margin-bottom: 0;
      }
    }
  }
}
.container_btn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: auto;
  @media screen and (max-width: 767px) {
    margin-left: 0;
  }
  .el-button {
    width: 80px !important;
    @media screen and (max-width: 767px) {
      width: 60px !important;
      height: 32px !important;
    }
  }
}

.container_scrollbar {
  padding-top: 10px;

}

.card_formpush {
  margin-bottom: 10px;
  ::v-deep {
    .el-card__body {
      padding-bottom: 0;
    }
  }
}
.descriptions_text {
  display: inline-flex;
  align-items: center;
  column-gap: 8px;
}

.container-descriptions {
  // display: grid;
  // grid-template-columns: 1fr 1fr;
  overflow: hidden;
  column-gap: 60px;
  // @media screen and (max-width:767px){
  //     grid-template-columns: 1fr;
  // }
  ::v-deep {
    .el-descriptions__body .el-descriptions__table .el-descriptions__cell {
      width: 50%;
      @media screen and (max-width: 767px) {
        display: block;
        width: 100%;

        .el-button {
          padding: 6px 7px;
          margin-left: auto;
        }
      }
    }
  }
}
.container-descriptions-title {
  font-size: 15px;
  font-weight: 700;
  padding-top: 9px;
  padding-bottom: 9px;
  margin-bottom: 11px;
  border-bottom: solid #dcdfe6 thin;
  display: flex;
  align-items: center;
  column-gap: 8px;
  white-space: nowrap;
}

.container-formMedication {
  width: 100%;
  @media (max-width: 767px) {
    row-gap: 0;
  }
  &-txt {
    :deep(.el-input__inner){
      
    }
    ::v-deep {
      .el-form-item__label {
        font-weight: 600;
      }
      .el-form-item {
        @media (max-width: 767px) {
          display: flex;
        }
      }
    }
  }
}
.container-upload {
  .el-button {
    padding: 8px;
  }
  @media (max-width: 767px) {
    width: 100%;
  }
}
.card_formMedication {

  @media (min-width: 768px) {
    border: none;
    --el-card-padding: 0;
  }
}
.card_formpush form {
  display: flex;
  flex-wrap: wrap;
}
.formpush-date {
  display: flex;
  column-gap: 20px;
  @media (min-width: 768px) {
    column-gap: 12px;
  }
  ::v-deep {
    .el-form-item {
      margin-right: 0;
    }
  }
}
::v-deep {
  .el-select__wrapper.is-disabled .el-select__selected-item {
    color: #333;
  }
  .el-radio {
    margin-right: 20px;
    @media (max-width: 1200px) {
      margin-right: 10px;
    }
    @media (max-width: 767px) {
      margin-right: 0;
    }
  }
  .el-form-item--default {
    margin-bottom: 10px;
  }
  textarea.el-textarea__inner {
    padding: 9px 16px;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: var(--el-checkbox-checked-bg-color);
    border-color: var(--el-checkbox-checked-input-border-color);
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner:after {
    border-color: #fff;
  }
  .el-checkbox__input.is-checked.is-disabled + .el-checkbox__label {
    color: var(--el-checkbox-checked-text-color);
  }
  .el-radio-group {
    column-gap: 16px;
    row-gap: 0;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner:after {
    background-color: #ffffff;
  }
  .el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }
}
.container-ObservationValue {

  ::v-deep {
    .el-segmented {
      font-family: 'Roboto', 'Noto Sans TC', Arial, sans-serif;
      border-radius: 100px;
      --el-segmented-bg-color: transparent;
      --el-segmented-item-selected-color: var(--el-text-color-primary);
      --el-segmented-item-selected-bg-color: #008cd6;
      --el-border-radius-base: 14px;
      --el-segmented-color: #303133;
      --el-segmented-item-selected-disabled-bg-color: var(--el-color-primary-light-5);
      --el-segmented-item-hover-color: #fff;
      --el-segmented-item-hover-bg-color: var(--el-color-primary);
      --el-segmented-item-active-bg-color: var(--el-color-primary);
      --el-segmented-item-disabled-color: var(--el-text-color-placeholder);
    }
    .el-segmented__item {
      background: #ededed;
    }
    .el-segmented__item-label {
      font-weight: 500;
    }
    .el-segmented__item.is-selected,
    .el-segmented__item.is-selected.is-disabled {
      color: var(--el-segmented-item-hover-color);
    }
  }
}

.formline-date {
  @media (max-width: 767px) {
    width: 100%;
  }
}

.btn_case {
  margin-left: 32px;
  @media (max-width: 767px) {
    margin-left:0;
  }
  ::v-deep {

    .el-radio.is-bordered {
      text-align: center;
      border-color: #008cd6;
      color: #057aff;
      &:hover{
        color: #fff;
        background-color: #008CD6;
        .el-radio__label {
          color: #fff;
        }
      }
      &:active{
        color: #fff;
        background-color: #0186CD;
      }
      @media (max-width: 767px) {
        padding: 0;
        width: 60px !important;
        height: 32px;
      }
      &.btn_danger {
        border-color: #eb4d3d;
        color: #eb4d3d;
        background: #ffe5e5;
        &:hover {
          background: #FFDBDB;
        }
        &:active{
          background: #FFCCCC;
        }
        .el-radio__label {
          color: #eb4d3d;
        }
      }
      .el-radio__label {
        margin: 0 auto;
        font-size: var(--el-font-size-medium);
        font-weight: 500;
        line-height: 0;
        @media (max-width: 767px) {
          padding-left: 0;
        }
      }
      .el-radio__input {
        display: none;
      }
    }
  }
}

.container-upload {
  display: flex;
  align-items: center;
  column-gap: 10px;
  width: 100%;
  white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

  &-text{
  color: #9F9F9F;
    white-space: nowrap;
    font-weight: 400;
 }
  &-file {
    display: flex;
    &:has(ul.el-upload-list.el-upload-list--text li) {
      .el-upload__tip {
        display: none;
      }
    }
    ::v-deep {
 
      .el-upload-list__item-name {
        color: #9f9f9f;

        .el-icon {
          display: none;
        }
      }
      .el-upload-list__item-file-name {
        overflow: inherit;
        font-weight: 400;
      }
      .el-upload--text + .el-upload-list {
        // display: none;
      }
    }
  }
 

  .el-button--primary.is-plain.is-disabled,
  .el-button--primary.is-plain.is-disabled:hover {
    background-color: #eaeaea;
    border-color: #d5d5d5;
    color: #7c7c7c;
    ::v-deep {
      svg {
        path {
          stroke: #7c7c7c;
        }
      }
    }
  }
  ::v-deep {
    .el-upload__tip {
      color: #9f9f9f;
      font-size: 14px;
      margin-top: 0;
    }
    .el-upload {
      column-gap: 10px;
    }
    .el-upload:has(.el-button.is-disabled.is-plain) {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}
// .activeName-tabs {
//   ::v-deep {
//     #tab-2,
//     #tab-3 {
//       display: none;
//       @media (min-width: 768px) {
//         display: flex;
//       }
//     }
//   }
// }

.container-ObservationContent {
  ::v-deep {
    .container-card {
      display: flex;
      column-gap: 20px;
      row-gap: 20px;
      @media screen and (max-width:767px){
        flex-direction: column;
      }
      .el-card {
        width: calc(100% / 2);
        @media screen and (max-width:767px){
           width: 100%;
      }
      }
    }
  }
}

.container-OperationView {
  @media screen and (max-width:767px){
    border: solid #DCDFE6 thin;
    padding: 10px 16px;
  }
}
</style>

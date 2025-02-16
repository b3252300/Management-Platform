<template>
  <div class="container-ObservationContent">
    <div class="container-ObservationContent-title">術後追蹤日期 {{ GetDateYYYYMMDD(props.Data.TrackDate) }}</div>
    <div class="container-card">
    
      <el-card v-if="props.Page.id !== '1'" class="card_props.LineData bg-green" shadow="never">
        <template #header>
          <div class="style_lineApp">
            <img src="@/assets/imgs/chat-bubble-typing.svg" alt="追蹤回覆" />
            追蹤回覆
          </div>
        </template>

        <el-form :model="props.LineData" :inline="true">
          <el-form-item label="回覆日期">
            <el-date-picker v-model="props.LineData.ReplyDate" type="date"
              :placeholder="props.LineData.ReplyDate ? GetDateYYYYMMDD(props.LineData.ReplyDate) : ''"
              format="YYYY/MM/DD" value-format="YYYY-MM-DD" disabled />
          </el-form-item>

          <el-form-item label="關懷方式">
            <el-select v-model="props.LineData.CareType" class="form-CareType" :placeholder="props.LineData.CareType"
              disabled>
              <template #label="{ label, value }">
                <span>{{ props.LineData.ReplyDate ? 'Line@' : '' }}</span>
              </template>
            </el-select>
          </el-form-item>
          <template v-for="item in props.LineData.type">
            <el-form-item v-if="item.Type !== 3 && item.Type !== 4" :label="item.QuestionText + ' :'">
              <el-radio-group v-if="item.Type == 1" v-model="props.LineData.Answer" disabled>
                <el-radio v-for="item in item.OptionList" :value="item.OptionValue">{{ item.OptionText }}</el-radio>
              </el-radio-group>
              <el-checkbox-group v-if="item.Type == 2" v-model="props.LineData.woundState" disabled>
                <el-checkbox v-for="item in item.OptionList" :key="item.OptionValue" :value="item.OptionValue">
                  {{ item.OptionText }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="item.Type == 4" :label="item.QuestionText + ' :'">
              <el-input v-model="item.InputContent" style="width: 80px" clearable />
            </el-form-item>
          </template>

          <el-form-item style="width: 100%; margin-bottom: 0;" v-for="item in props.LineData.textarea && props.LineData.textarea.length > 0
            ? props.LineData.textarea
            : [{ InputContent: '' }]" :key="item.id || Math.random()">
            <el-input v-model="item.InputContent" type="textarea" placeholder="" disabled />
            <div class="container-imgs">
          
                <el-image v-for="(url, index) in imageUrls"  :src="url" :max-scale="7" :min-scale="0.2"
                  :preview-src-list="imageUrls" :initial-index="index" :teleported="true" fit="fit">
                  <template #error>
                    <div class="image-error">
                      <el-icon><icon-picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <!-- {{item.FileNameList[index]}} -->
           

              

              <!-- <a :href="url" v-for="url in imageUrls" target="_blank">
                <el-image style="width: 100px; height: 100px" :src="url" fit="fit">
                  <template #error>
                    <div class="image-error">
                      <el-icon><icon-picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </a> -->
            </div>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="card_props.LineData bg-blue" shadow="never" :style="props.Page.id !== '1' ? '' : 'width:100%'">
        <template #header>
          <div class="style_lineApp">
            <img src="@/assets/imgs/domestic_worker.svg" alt="個管師紀錄" />
            個管師紀錄
          </div>
        </template>

        <el-form :model="props.Data" :inline="true" :rules="rules" style="height: 100%">
          <el-form-item label="回覆日期">
            <el-date-picker v-model="props.Data.ReplyDate" type="date"
              :placeholder="props.Data.ReplyDate ? GetDateYYYYMMDD(props.Data.ReplyDate) : ''" format="YYYY/MM/DD"
              @change="onReplyDate" value-format="YYYY-MM-DD" :disabled="props.isDisabled" />
          </el-form-item>
          <el-form-item label="關懷方式">
           
            <el-select v-model="props.Data.CareType" @change="onReplyCareType" placeholder="" class="form-CareType"
              :disabled="props.isDisabled">
              <template #label="{ label, value }">
                
                <span>{{ selectedLabel(value) }}</span>
              </template>
              <el-option v-for="item in Interested" :key="item.value" :label="item.label" :value="item.value">
                <span :class="item.value == props.Data.CareType ? 'is-selected' : ''">
                  {{ item.label }}
                </span>
              
              </el-option>
            </el-select>
          </el-form-item>
          <div class="form-item-content-flex">
          <template v-for="item in props.Data.type">
            <el-form-item v-if="item.Type !== 3 && item.Type !== 4" :label="item.QuestionText + ' :'">
              <el-radio-group v-if="item.Type == 1" v-model="props.Data.Answer" :disabled="props.isDisabled"
                @change="onReply(item)">
                <el-radio v-for="item in item.OptionList" :value="item.OptionValue">{{ item.OptionText }}</el-radio>
              </el-radio-group>

              <el-checkbox-group v-if="item.Type == 2" v-model="props.Data.woundState" :disabled="props.isDisabled"
                @change="onReply(item)">
                <el-checkbox v-for="item in item.OptionList" :key="item.OptionValue" :value="item.OptionValue">
                  {{ item.OptionText }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

          <div class="container-rowUpload-flex">
            <el-form-item class="container-rowUpload" v-if="item.Type == 4"  :label="item.QuestionText" style="width: 200px;">
              <el-input v-model="item.InputContent"   @input="handleInput" class="form-InputContent" style="margin-right: 10px; width:73px;"  clearable @change="onReply(item)"
                :disabled="isDisabled"/> 分
            </el-form-item>
            <el-form-item class="container-upload  d-none d-md-flex mr-0" v-if="item.Type == 4">
      
                <el-upload ref="uploadRef" action="" :limit="1" accept=".pdf" :on-change="handleEnglishChange"
                  :on-exceed="handleEnglishExceed" :on-remove="handleEnglisRemove" v-model:file-list="fileList" :show-file-list="!props.isDisabled"             
                  class="container-upload-file"  :auto-upload="false">
                  <template #trigger>
                    <el-button type="primary" plain style="align-items: center; padding-left: 8px; padding-right: 8px;" :disabled="isDisabled">
                      <el-icon size="24"><img class="upload-btn-icon" alt="" /></el-icon>上傳
                    </el-button>
                  </template>
                </el-upload>
              

                <div v-if="!isDisabled && !fileList[0]?.name"  class="container-upload-text"> 
                  <span>{{ item.FileNameList?.toString() }}</span>
                  
                </div>

                <el-button type="primary" text v-if="item.FileRowIdList.length > 0 && isDisabled" link
                  @click="btnCheck(item.FileRowIdList)" class="FileView">
                  <!-- {{ item.FileNameList[0] }} -->
                  查看
                </el-button>
             
          
            </el-form-item>
          </div>
            
          </template>
        </div>

          
          <el-form-item style="width: 100%; margin-bottom: 0;" v-for="item in props.Data.textarea">
            <el-input v-model="item.InputContent" @change="onReply(item)" type="textarea" placeholder=""
              :disabled="isDisabled" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>

</template>
<script setup>
import { ref, nextTick, inject, watch, defineExpose } from 'vue';
import useDate from '@/utils/date';
import UpLoadBtn from '@/components/UpLoad.vue';
import UploadFunction from '@/utils/URL.js';
import { Upload } from '@/api/common.js'; // 引入你的 Upload 函數
import { getFileUrl } from '@/utils/explain';
import { ElMessageBox } from 'element-plus'
import { Picture as IconPicture } from '@element-plus/icons-vue';
const { GetDateYYYYMMDD } = useDate();
const { UploadView } = UploadFunction();
const uploadRef = ref(null);
const hasError = ref(false);
const fileListName = ref(true);
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: true,
  },
  CaseRowId: {
    type: String,
    default: '',
  },
  Data: {
    type: Object,
    default: {},
  },
  LineData: {
    type: Object,
    default: {},
  },
  Page: {
    type: Number,
    default: null,
  },
  files: {
    type: Array,
    default: [],
  }
});
const form_day = ref({
  CareTypeValue: null,
  Answer: [], // 使用者回覆資料，null 的話代表這一題還沒回答過
  woundState: null,
  InputContent: null, //民眾自行留言
});
const LineCareTypeValue = ref('');
form_day.value.Answer = props.Data.Answer;

props.Data.sutures = null;
// props.LineData.CareType = "LINE@"
form_day.value.CareTypeValue = props.Data.CareType;

props.Data.type.forEach((item) => {
  props.Data.textarea = item.InputContent;
  console.log(item, "item");

});



const ReplyList = ref([]);
let listView = {
  QuestionCode: '',
  Answer: [],
  InputContent: '',
};

const ReplyDateValue = ref('');
const TrackDateValue = ref('');

const fileList = ref([]);
const showFileList = ref(true); // 動態控制是否顯示內建檔案名稱
const fileListId = ref('');

const handleEnglishExceed = (files, fileListArray) => {
  
    if(uploadRef.value){
      uploadRef.value[0]?.clearFiles();
    }

  if(files){
    nextTick(() => {
        uploadRef.value[0]?.handleStart(files[0]);
     });
  }

  // emit('SendFiles', fileList);
};

const handleEnglisRemove = (files)=>{
  fileList.value = []
  emit('SendFilesChange', fileList.value);

}

defineExpose({ handleEnglishExceed });


const onReplyCareType = (val) => {
  emit('SendCareType', val);
};

const onReplyDate = (val) => {

  emit('SendReplyDate', val);
};
const handleEnglishChange = (files) => {
  // fileList[0].name = files[0].name;
  // fileList[0].raw = files[0];
  const maxSize = 3 * 1024 * 1024; // 3MB
  console.log(files.raw.size > maxSize, "fileList");
  if (files.raw.size > maxSize) {
 
      ElMessageBox.alert(`檔案大小不能超過 3MB！`,  {       
              confirmButtonText: '確定',
              showClose: false,
              center: true            
            })
      if(uploadRef.value){
      uploadRef.value[0]?.clearFiles();
    }

    } else {
      fileListName.value = false;
      console.log(files, "fileList");
      emit('SendFilesChange', files);
    }

};

const handleUploadSuccess = () => {
  // 上傳成功後隱藏內建檔案名稱
  showFileList.value = false;
};

const imgs = props.LineData.textarea[0]?.FileRowIdList;
const generateImageUrls = async (imgs) => {
  const imageUrls = [];

  for (const id of imgs) {
    imageUrls.push(getFileUrl() + '/' + id); // 將生成的 URL 推進陣列
    // try {
    //   const res = await Upload([id]); // 調用 API
    //   const blob = new Blob([res.data], { type: res.headers['content-type'] }); // 生成 Blob
    //   const imageUrl = URL.createObjectURL(blob); // 生成 Object URL
    //   imageUrls.push(imageUrl); // 將生成的 URL 推進陣列
    // } catch (error) {
    //   console.error(`圖片 ${id} 加載失敗:`, error);

    // }
  }

  return imageUrls;
};
// 監控 imgs 的變化，並更新顯示的圖片
watch(
  () => props.LineData.textarea[0]?.FileRowIdList,
  async (newImgs) => {
    if (newImgs && newImgs.length > 0) {
      const urls = await generateImageUrls(newImgs);
      imageUrls.value = urls; // 更新圖片 URL
    }
  },
  { immediate: true }
);

// 定義儲存圖片 URL 的變數
const imageUrls = ref([]);

watch(
  () => props.Page,
  (newValue, oldValue) => {
    imageUrls.value = []; // 清空 imageUrls
  }
);

const woundState = [...props.Data.woundState];

const onReply = (val) => {
  console.log(val, 'val');
  let newListView = {}; // 每次重新建立一個新物件

  if (val.Type == 1) {
    //1:單選
    newListView.QuestionCode = val.QuestionCode;
    newListView.Answer = [...props.Data.Answer]; // 複製陣列
    newListView.InputContent = null; // 預設為空字串
    ReplyList.value.push(newListView);
  } else if (val.Type == 2) {
    //2:複選
    newListView.QuestionCode = val.QuestionCode;
    newListView.Answer = [...props.Data.woundState]; // 複製陣列
    newListView.InputContent = null; // 預設為空字串
    ReplyList.value.push(newListView);
  } else if (val.Type == 3) {
    //3:輸入框
    newListView.QuestionCode = val.QuestionCode;

    newListView.Answer = []; // 類型 3 沒有 Answer
    newListView.InputContent = val.InputContent || ''; // 設定輸入內容
    ReplyList.value.push(newListView);
  } else if (val.Type == 4) {
    //4:上傳檔案&輸入
    newListView.QuestionCode = val.QuestionCode;
    newListView.Answer = []; // 類型 4 沒有 Answer
    newListView.InputContent = val.InputContent || ''; // 設定輸入內容
    ReplyList.value.push(newListView);
  }

  console.log(props.CaseRowId, 'CaseRowIdCaseRowIdCaseRowId');

  emit('Send', ReplyList.value);
};

const btnCheck = (id) => {
  const list = id[0];
  console.log(list, "list");
  Upload(list) // 使用檔案名稱作為參數調用 API
    .then((res) => {
      console.log(res, '取檔案');
      UploadView(res);
    });
};

const Interested = ref([
  { label: '電訪', value: '2' },
  { label: '病房', value: '3' },
  { label: '門診', value: '4' },
]);

const selectedLabel = (CareType) => {
  const selectedItem = Interested.value.find((item) => item.value == CareType);
  return selectedItem ? selectedItem.label : '';
};

const options = ref([]);
options.value.label = '';
options.value.value = '';

const emit = defineEmits(['Send']);

watch(
  () => props.isDisabled,
  (newValue, oldValue) => {
    showFileList.value = !props.isDisabled;

    // uploadRef.value[0].clearFiles();


  }
);
const handleInput = (value) => {
  console.log(value);
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
     
      props.Data.type.forEach((item)=>{
            if(item.Type == 4){
              item.InputContent = newValue
      
            }
      });
}
  
</script>

<style lang="scss" scoped>
.form-item-content-flex{
    display: inline-flex;
    flex-wrap: wrap;
    ::v-deep{
      .el-radio{
        margin-right: 0;
      }
    }
  
    .el-radio-group{
      flex-wrap: nowrap;
      @media (max-width:1800px) {
      flex-wrap: wrap;
      }
    }

}

.form-CareType{
  width: 157px;
  @media (max-width:767px){
      width: 100%;
  }
}
.el-form--inline .el-form-item {
  align-items: center;
  @media (max-width:767px){
      width: 100%;
  }
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(217, 217, 217, 0.32);

  ::v-deep {
    svg {
      path {
        fill: #9f9f9f;
      }
    }
  }
}

.container-rowUpload {

    overflow: hidden;

  // @media (max-width:1645px) {
  //   width: 100%;
  // }
  &-flex{
    display: flex;
    @media (max-width:1115px) {
      flex-wrap: wrap;
    }
  }

  ::v-deep {
    .el-form-item__content {
      flex-wrap: nowrap;
    }
  }
}

.container-ObservationContent {
  padding: 2px;

  &-title {
    font-size: 15px; 
    margin-top: 8px;
    margin-bottom: 8px;
  }
}

.container-imgs {
  gap: 16px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  @media (max-width:1024px) {
    gap: 10px;
  }
  ::v-deep{
    .el-image{
    width: 100px;
    height: 100px;
    @media (max-width:1024px) {
      width: 62px;
      height: 62px;
    }
  }
  }
}

.container-upload {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 10px;


  @media (max-width:1200px) {
    margin-left: 10px;
  }
  @media (max-width:1024px) {
    margin-left: 0;
  }
  ::v-deep{
    .el-form-item__content{
        flex-wrap: nowrap;
      }
  }
 &-text{
  color: #9F9F9F;

  white-space: nowrap;
  // text-overflow: ellipsis;
  overflow: hidden;
 }

  &-file {
    display: flex;
    align-items: center;
    margin-right: 8px;
    &:has(ul.el-upload-list.el-upload-list--text li) {
      .el-upload__tip {
        display: none;
      }
    }

    ::v-deep {
      .el-upload-list {
        margin-top: 0;
      }
   

      .el-upload-list__item {
        margin-bottom: 0;
    
      }


      .el-upload-list__item-name {
        color: #9f9f9f;
      
        .el-icon {
          display: none;
        }
      }

      .el-upload-list__item-file-name {
        overflow: hidden;
        text-overflow: inherit;
        white-space: nowrap;
        display: block;
     
      }

      .el-upload--text+.el-upload-list {
        // display: none;
      }
    }
  }

  button {
    justify-content: flex-start;
  }

  .FileView ::v-deep(span) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
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
::v-deep{
 .el-radio-group {
    column-gap:0;

  }
  .item-form-Womac {
    width: 177px;
}
}
.el-select-dropdown__item .is-selected{
  color: var(--el-color-primary);     font-weight: bold;
}
</style>

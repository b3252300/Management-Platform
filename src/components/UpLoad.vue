<template>
  <el-upload
    ref="uploadRef"
    :disabled="props.isDisabled"
    v-model:file-list="fileList"
    class="container-upload"
    multiple
    accept=".pdf"
    :on-preview="handlePreview"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :http-request="customUploadRequest">
    <template #trigger>
      <el-button type="primary" plain style="align-items: center;" :disabled="props.isDisabled">
        <el-icon style="vertical-align: middle">
          <UpLoad style="margin-right: 3px;" />
        </el-icon>
        <span style="vertical-align: middle">檔案上傳</span>
      </el-button>
    </template>
    <span class="text-info">{{ fileName }}</span>
    <el-button type="primary" link>查看</el-button>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue';
import UpLoad from "@/components/icon/UpLoad.vue";
import { Upload } from '@/api/common.js'; // 引入你的 Upload 函數
const urlaction = import.meta.env.VITE_API_ROOT
const props = defineProps({
  isDisabled: {
    type: Boolean,
    default: true,
  },
});

const uploadRef = ref();
const fileList = ref([]);
const fileName = ref("檔案名稱.pdf");

// 自定義上傳邏輯
const customUploadRequest = ({ file, onSuccess, onError }) => {
  fileName.value = file.name; // 取得上傳檔案的名稱
  console.log("檔案名稱:", fileName);
 let list = {}
  Upload(fileName.value) // 使用檔案名稱作為參數調用 API
    .then((res) => {
      const { Code, Data } = res;
      if (Code === 0) {
        console.log("成功取得資料:", Data);
        onSuccess(Data); // 通知上傳成功
      } else {
        console.error("API 錯誤，代碼:", Code);
        onError(new Error(`錯誤代碼: ${Code}`));
      }
    })
    .catch((err) => {
      console.error("請求錯誤:", err);
      onError(err);
    });
};

// 刪除
const handleRemove = (file, uploadFiles) => {
  console.log(file, uploadFiles, "handleRemove");
};

// 查看檔案
const handlePreview = (uploadFile) => {
  console.log(uploadFile, "handlePreview");
};

// 處理檔案超過限制
const handleExceed = (files, fileList) => {
  console.log(files, fileList, "fileList");
  uploadRef.value.clearFiles();
};
</script>

<style lang="scss" scoped>
::v-deep{
.el-upload-list__item-name{
  .el-icon--document{
    display: none;
  }
}

.el-button {
  svg{
    height: 13px;
    width: auto;
  }
  &:active{
    stroke:#008cd6;
  }
  &:hover, &:focus{
    path {
      stroke: #fff;
    }
  }

}

}


.container-upload {
    display: flex;
    align-items: center;
    column-gap: 10px;
}
.icon-text{
  &:hover, &:focus{
     text-decoration: underline;
    
  }
}

.el-button--primary.is-plain.is-disabled, .el-button--primary.is-plain.is-disabled:hover{
  background-color: #EAEAEA;
    border-color:#D5D5D5;
    color: #7C7C7C;
    ::v-deep{
      svg{
        path{
            stroke: #7C7C7C;
        }
      }
    }

}
</style>

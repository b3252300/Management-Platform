<template>
  <!-- <el-upload
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
  </el-upload> -->
<div class="container-upload">  
  <el-upload
     ref="uploadRef"     
     action=""
     :limit="1"
     accept=".pdf"
     class="container-upload"
     :on-exceed="handleEnglishExceed"
     v-model:file-list="fileList"
     :auto-upload="false">
                        <template #trigger>
                          <el-button type="primary" plain style="align-items: center;" :disabled="props.isDisabled">檔案上傳</el-button>
                          {{ fileList }}
                          <div class="el-upload__tip">{{ fileList.name }}</div>  
                        </template>
                      </el-upload>
                      <el-button type="primary" link>查看</el-button>
</div>
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



const emit = defineEmits(['Confirm']);

const uploadRef = ref();
const fileList = ref([]);
const handleEnglishExceed = (files, fileList) => {
  uploadRef.value.clearFiles();
  nextTick(() => {
    fileList[0].name = files[0].name;
    fileList[0].raw = files[0];
    uploadRef.value.handleStart(files[0]);
    emit('Confirm', files);
  });
  // form.value.englishFile[0].raw = files[0];
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

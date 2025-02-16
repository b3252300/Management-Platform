<template>
  <el-button type="primary" link @click="showPreview"><img :src="ViewImg" /></el-button>

  <el-dialog v-model="preview" style="width: 1083px; height: 763px" :title="FileName + ' Preview'">
    <div class="pdf-container">
      <!-- <PdfApp v-if="pdfUrl" style="height: 75vh" :pdf="pdfUrl"></PdfApp> -->
      <PdfApp
        v-if="FileType == 'pdf'"
        :pdf="fetchFileUrl(FileRowId)"
        @pages-rendered="pagesRendered"
        :config="config"
      ></PdfApp>
      <img v-if="FileType != 'pdf'" style="object-fit: contain" :src="fetchFileUrl(FileRowId)" />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import PdfApp from 'vue3-pdf-app';
import 'vue3-pdf-app/dist/icons/main.css';
import { getFileUrl } from '@/utils/explain';
import { useUserStore } from '@/store';
const userStore = useUserStore();

import ViewImg from '@/assets/imgs/viewFile.svg';

const props = defineProps({
  FileType: {
    type: String,
    default: '',
  },
  FileRowId: {
    type: String,
    default: '',
  },
  FileName: {
    type: String,
    default: '',
  },
});

const preview = ref(false);
const showPreview = () => {
  preview.value = true;
};

const pagesRendered = (pdfApp) => {
  setTimeout(() => (pdfApp.pdfViewer.currentScaleValue = 'page-width'));
};

const config = ref({
  sidebar: false,
  secondaryToolbar: false,
  toolbar: {
    toolbarViewerLeft: {
      findbar: true,
      previous: false,
      next: false,
      pageNumber: false,
    },
    toolbarViewerRight: false,
    toolbarViewerMiddle: {
      zoomOut: true,
      zoomIn: true,
      scaleSelectContainer: true,
    },
  },
  errorWrapper: false,
});

const fetchFileUrl = (rowId) => {
  //   console.log(getFileUrl() + '/' + userStore.fileToken + '/' + rowId, 'getFileUrl');
  return getFileUrl() + '/' + userStore.fileToken + '/' + rowId;
};
</script>

<style lang="scss" scoped>
.pdf-container {
  margin-top: 10px;
  flex: 1;
  height: calc(763px - var(--root-header-info-bar-height));
  // max-height: calc(100vh - 225px - var(--root-header-info-bar-height));
  background-color: #ccc;
  ::v-deep(.toolbar) {
    z-index: 0;
  }
}
</style>

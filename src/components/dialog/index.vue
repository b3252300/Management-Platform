<template>
  <el-dialog
    v-model="visible"
    :title="Title"
    width="560"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <template #header>
      <div style="height: 24px">{{ Title }}</div>
    </template>
    <div style="min-height: 66px">
      <span :style="Title != '' ? [{ fontSize: `16px` }] : []" style="white-space: pre-wrap" v-html="Message"></span>
    </div>

    <template #footer>
      <div class="dialog-footer" v-if="showOK">
        <el-button size="large" class="btn" type="primary" @click="handleOK">OK</el-button>
        <!-- <el-button type="primary" @click="sendRequest">Confirm</el-button> -->
      </div>
      <div class="dialog-footer" v-else>
        <el-button size="large" class="btn" @click="handleNo">{{ NoWord }}</el-button>
        <el-button size="large" class="btn" type="primary" @click="handleYes" :loading="loading">{{
          YesWord
        }}</el-button>
      </div>
    </template>
  </el-dialog>
 
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { usePatientStore } from '@/store';



const emit = defineEmits(['DialogConfirm', 'DialogCancel', 'OKDialog']);

let visible = ref(false);
let Title = ref('');
let Message = ref('');
let Code = ref('');
let loading = ref(false);

const props = defineProps({
  isOK: {
    type: Boolean,
    default: false,
  },
});

let showOK = ref(props.isOK);
let YesWord = ref('');
let NoWord = ref('');
let NoCallbackFunction = ref();

const show = (obj) => {
  console.log(obj);
  // const { code, title, message, isOK, Yes = 'Confirm', No = 'Cancel' } = obj;
  // // console.log(isOK);
  // Code.value = code;
  // // console.log(Code.value);
  // Title.value = title;
  // Message.value = message;
  // if (isOK != undefined) {
  //   showOK.value = isOK;
  // }

  // YesWord.value = Yes;
  // NoWord.value = No;
  // visible.value = true;
};

const handleYes = () => {
  visible.value = false;
  emit('DialogConfirm', Code.value);
};

const handleOK = () => {
  visible.value = false;
  emit('OKDialog', Code.value);
};

const handleNo = () => {
  visible.value = false;
  emit('DialogCancel');
};

defineExpose({ show });

let count = ref(0);
let timeout = ref(5 * 60); // 默认5分钟
let timer = ref(null);

const initTimer = () => {
  timer && clearInterval(timer);
  count.value = 0;
  timer = setInterval(() => {
    if (timeout.value - count.value == 0) {
      clearInterval(timer);
      visible.value = false;
    }

    if (count.value < timeout.value) {
      count.value++;
    } else {
      clearInterval(timer);
      visible.value = false;
    }
  }, 1000);
};

onMounted(() => {
  // 监听键盘事件
  window.addEventListener('keyup', function (event) {
    count.value = 0;
  });
  // 监听鼠标点击事件
  window.addEventListener('click', function (event) {
    count.value = 0;
  });

  initTimer();
});

onUnmounted(() => {
  timer && clearInterval(timer);
  window.removeEventListener('keyup', function (event) {});
  window.removeEventListener('click', function (event) {});
});
</script>

<style lang="scss" scoped>
.btn {
  min-width: 80px;
}
</style>

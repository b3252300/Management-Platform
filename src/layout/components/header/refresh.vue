<template>
  <div class="refresh">
    <el-button :icon="RefreshRight" circle @click="setRefresh"></el-button>
    <span class="txt" v-show="timeVisible">Update Time: {{ time }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RefreshRight } from '@element-plus/icons-vue';
import useDate from '@/utils/date.js';

const { GetNowDateTimeDDMMYYYYHHmm } = useDate();
const props = defineProps({
  timeVisible: {
    type: Boolean,
    default: true,
  },
});

const time = ref(GetNowDateTimeDDMMYYYYHHmm());
const emit = defineEmits(['Refresh']);

const setRefresh = () => {
  time.value = GetNowDateTimeDDMMYYYYHHmm();
  emit('Refresh');
};
</script>

<style lang="scss" scoped>
.refresh {
  display: flex;
  align-items: center;
  gap: 4px;

  .txt {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #606266;
  }
}
</style>

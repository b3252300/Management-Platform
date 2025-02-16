<template>
  <div class="toast-main" v-if="visible" @click="onClose()">
    <div class="toast-content" :style="{ background: backgroundStyle, color: textColor }">
      {{ toastContent }}
    </div>
  </div>
</template>
<script setup>

/**
 * eg: 使用示例
 * <toast ref="toastRef" :opacity="0.5" textColor="#000" />
 * 
 * import { ref } from 'vue'
 * import { Toast } from '@/components/toast'
 * const toastRef = ref(null)
 * toastRef.value.show({ text: '提示内容', duration: 3000 })
 */

import { ref, computed } from 'vue'
let visible = ref(false)
let toastContent = ref('')

const props = defineProps({
  // 提示区域透明度 默认0.8
  opacity: {
    type: Number,
    default: 0.8,
  },
  // 文字颜色 默认白色
  textColor: {
    type: String,
    default: '#fff',
  },
})

let backgroundStyle = computed(() => {
  return `rgba(0, 0, 0, ${props.opacity})`
})
let onClose = () => {
  toastContent.value = ''
  visible.value = false
}

let show = (obj) => {
  const { text, duration = 3000, closeCallback } = obj
  // duration 自动关闭时间 单位：毫秒，默认3秒，传0则不会自动关闭
  toastContent.value = text
  visible.value = true
  if (duration > 0) {
    setTimeout(() => {
      onClose()
      if (closeCallback != null) {
        closeCallback();
      }
    }, duration)
  }
}

defineExpose({ show })
</script>
<style lang="scss" scoped>
.toast-main {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: 999999998;
  justify-content: center;
  align-items: center;

  .toast-content {
    max-width: 500px;
    max-height: 300px;
    position: fixed;
    z-index: 999999999;
    border-radius: 8px;
    padding: 30px 50px;
    color: #fff;
  }
}
</style>
<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="t('system.countdown.title')"
      width="450"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div style="text-align: center">
        <p>
          <span class="time">{{ termTime }}</span>
          sec
        </p>
        <p style="margin-top: 10px">{{ t('system.countdown.tips') }}</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onContinue"> {{ $t('system.countdown.continue') }} </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
const router = useRouter()

let count = ref(0)
let timeout = ref(5 * 60) // 默认5分钟
let term = ref(30) // 弹窗最后出现时间
let termTime = ref(30)
let timer = ref(null)
let termTimer = ref(null)
let dialogVisible = ref(false)

onMounted(() => {
  // 监听键盘事件
  window.addEventListener('keyup', function (event) {
    count.value = 0
  })
  // 监听鼠标点击事件
  window.addEventListener('click', function (event) {
    count.value = 0
  })

  initTimer()
})

onUnmounted(() => {
  timer && clearInterval(timer)
  termTimer && clearInterval(termTimer)
  window.removeEventListener('keyup', function (event) {})
  window.removeEventListener('click', function (event) {})
})

const initTimer = () => {
  timer && clearInterval(timer);
  termTimer && clearInterval(termTimer);
  count.value = 0;
  termTime.value = 30;
  timer = setInterval(() => {
    // console.log(count.value)
    if (timeout.value - count.value == term.value) {
      dialogVisible.value = true
      termTimeChange()
    }
    if (count.value < timeout.value) {
      count.value++
    } else {
      clearInterval(timer)
      dialogVisible.value = false
      // 跳转首页
      router.push('/')
    }
  }, 1000)
}

const termTimeChange = () => {
  termTimer = setInterval(() => {
    if (termTime.value > 0) {
      termTime.value--
    } else {
      clearInterval(termTimer)
    }
  }, 1000)
}

const onContinue = () => {
  dialogVisible.value = false
  initTimer()
}
</script>

<style lang="scss" scoped>
.time {
  font-size: 30px;
  color: green;
  margin-right: 5px;
}
</style>

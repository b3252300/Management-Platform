
  <script setup>
  import { ref} from 'vue'
  
  let count = ref(0)
  let timeout = ref(5 * 60) // 默认5分钟
  let timer = ref(null)
  const emit = defineEmits(['closeDialog']);
  
  const onOpen = () => {
    // 监听键盘事件
    window.addEventListener('keyup', function (event) {
      count.value = 0
    })
    // 监听鼠标点击事件
    window.addEventListener('click', function (event) {
      count.value = 0
    })
  
    initTimer()
  }
  
  const onClose = () => {
    timer && clearInterval(timer)
    window.removeEventListener('keyup', function (event) {})
    window.removeEventListener('click', function (event) {})
  }
  
  const initTimer = () => {
    timer && clearInterval(timer);
    count.value = 0;
    timer = setInterval(() => {
      // console.log(count.value)
      
      if (count.value < timeout.value) {
        count.value++
      } else {
        clearInterval(timer)
        emit('closeDialog');
        
      }
    }, 1000)
  }


  defineExpose({ onOpen, onClose });
  </script>
  
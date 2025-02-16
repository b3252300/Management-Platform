<template>
 <teleport to='body'>
    <el-dialog v-model="visible" :title="Title" width="500" :show-close="false" :close-on-click-modal="false"  :close-on-press-escape="false" center>
      <div class="text-center dialog-container" >
        {{ Message }} {{ codeShow() }}
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleNo" v-if="Title !== 'Error'" size="large">Cancel</el-button>
          <el-button type="primary" @click="handleOK" size="large">
            確認
          </el-button>
        </div>
      </template>
    </el-dialog>
 </teleport>   
  </template>
  <script setup>
  import { ref } from 'vue'
  
  let visible = ref(true);
  let Code = ref('');
  let Title = ref('');
  let Message = ref('');
  const show = (obj) => {
  console.log(obj, "show");
  const { code, title, message, isOK, Yes = 'Confirm', No = 'Cancel' } = obj;
 
  Code.value = code;
  Title.value = title;
  Message.value = message;
  visible.value = true;
};

const codeShow = ()=>{
    if(Code.value !== ""){
        return `( code : ${Code.value} )`
    }
   
}

const emit = defineEmits([ 'DialogCancel', 'OKDialog']);
const handleOK = () => {
  visible.value = false;
  emit('OKDialog', Code.value);
};
const handleNo = () => {
  visible.value = false;
  emit('DialogCancel');
};


defineExpose({ show });


defineOptions({
  name: 'dialogIndex',
});
</script>



<style lang="scss" scoped>
.dialog-container{
    font-size: 15px;
    min-height: 57px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

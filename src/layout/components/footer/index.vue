<template>

  <div class="footer"  v-if="$route.name !== 'Login'">
    <div class="footer-title">© 聯新國際醫院-ERAS個案管理平台 2024</div>

    <span>{{ versionData }}</span>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore } from '@/store';
const appStore = useAppStore();
const versionData = ref(null);
versionData.value = import.meta.env.VITE_Version;



</script>

<style lang="scss" scoped>
.footer {
  padding-left: 20px;
  padding-right: 20px;
  @media screen and (max-width:575px){
    padding-top: 10px;
    padding-bottom: 10px;
  }
  &-title{
    font-size: 12px;
    @media screen and (max-width:575px){
      font-size: 11px;
      
    }
  }
  border-top: solid #DCDFE6 thin;
  height: 50px;
  display: flex;
  flex-wrap:wrap-reverse;
  justify-content: space-between;
  align-items: center;
  color: #9F9F9F;
  font-size: 12px;
  font-weight: 500;
  @media  (min-width:768px){
    justify-content: space-between;
  }
  @media  (max-width:575px){
    height: auto;
  }
}
</style>

<template>
  <el-container class="mobile-layout-container" style="height: 100vh">

    <el-container>
 
      <el-header>

        <MobileHeader></MobileHeader>
        
      </el-header>
     
    
      <el-main>
       
        <el-scrollbar>
          <AppMain :needTagsView="false" />
          <div class="mobile-footer">
              {{ version }}
               <div class="footer-title">© 聯新國際醫療集團-聯新關骨樂活吧 2024</div>           
          </div>
        </el-scrollbar>
      </el-main>

        
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '@/store';
import { MobileHeader, AppMain, Footer, Sidebar } from './components';

const version = import.meta.env.VITE_Version;
const appStore = useAppStore();
const isCollapse = ref(false);
isCollapse.value = appStore.sidebar.opened;


</script>

<style lang="scss" scoped>

.mobile-footer {
  padding: 8px 10px;
  font-size: 12px;
  text-align: center;
  color: #9F9F9F;
  letter-spacing: 2px;
  z-index: 1;
    position: relative;
}
</style>

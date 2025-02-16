<template>
  <el-container class="layout-container-demo">
   
    <el-container>     
      <el-header>
        <Header></Header>
        <!-- <menuDrawer></menuDrawer>   
        <MobileHeader></MobileHeader>  -->
      </el-header>  
      <el-container> 
      <Sidebar></Sidebar>
          <el-container class="main-container">     
            <el-main>        
               <el-scrollbar>      
                    <AppMain :needTagsView="false" />
                </el-scrollbar>
            
            </el-main>
            <el-footer  class="d-md-none">
                 <Footer></Footer>
            </el-footer>
          </el-container>
       </el-container>
      
    </el-container>
  </el-container>

</template>

<script lang="ts" setup>
import { Header, AppMain, Footer, Sidebar, menuDrawer, MobileHeader } from './components';
import { ref, reactive, computed  } from 'vue';
import { useAppStore, useSettingsStore } from '@/store';

const appStore = useAppStore();
const settingsStore = useSettingsStore();
const set = reactive({
  device: computed(() => {
    return appStore.device;
  }),
  fixedHeader: computed(() => {
    return settingsStore.fixedHeader;
  }),
  fixedFooter: computed(() => {
    return settingsStore.fixedFooter;
  }),
  classObject: computed(() => {
    const obj = {
      mobile: set.device === 'line',
    };
    return obj;
  }),
  layoutMod: computed(() => {
    return settingsStore.layoutMod;
  }),
});

const handleClickOutside = (params) => {
  appStore.CLOSE_SIDEBAR({ withoutAnimation: params });
};





</script>

<style lang="scss" scoped>
.layout-container-demo .el-header {
  position: relative;
  z-index: 1;
  box-shadow: 0px 0px 6px 0px #0000001f;
}
.layout-container-demo .el-aside {
  border-right: 1px solid #dcdfe6;
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
  @media screen and (max-width:575px){
       overflow: initial;
  }
}
</style>

<template>

<el-aside   class="sidebar-container" :class="{ 'sidebar-layout': !isCollapse() }">
    <!-- <Logo :collapse="appStore.sidebar.opened"></Logo> -->
    <el-scrollbar style="height: calc(100vh - 60px)">
     
      <el-menu :default-active="currentPath" :collapse="isCollapse()" router>
        <template v-for="(item, index) in MenuData" :key="item.path">
          <!--   沒有子路由 -->
          <template v-if="!item.children || item.children.length == 0">
            <el-menu-item :index="item.path" v-if="!item.hidden" @click="goPage">
              <el-icon><img :class="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </el-menu-item>
            
          </template>
          <!--  有一個以上子路由-->
          <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 0 && !item.hidden">
            <template #title>
              <el-icon><img :class="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="(subItem, subIndex) in item.children" :key="subItem.path">
              <el-menu-item :index="subItem.path" v-if="!subItem.hidden" @click="goPage">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
          

        </template>
        <el-menu-item class="btn_login d-md-none" @click="handleLogout">          
              <img class="user-btn-icon" src="@/assets/imgs/log-out-04.svg" alt="登出">
              <span style="font-size: 15px;">登出</span>    
            </el-menu-item>
      </el-menu>
      <Footer></Footer>
    </el-scrollbar>

  </el-aside>


</template>

<script setup>
import { ref, computed } from 'vue';
import  Footer  from '@/layout/components/footer/index.vue';
import Logo from './Logo';
import { useAppStore, useUserStore } from '@/store';
import HomeImg from '@/assets/imgs/icon.svg';
import { useRouter } from 'vue-router';
import { Logout } from '@/api/common';
const router = useRouter();
// 当前路由的path
const currentPath = router.currentRoute.value.path;
const userStore = useUserStore();
const appStore = useAppStore();



import mobilefunction from '@/utils/mobile.js';
const {  isMobileDevice } = mobilefunction();
if(isMobileDevice()){
  appStore.sidebar.opened = true
}

const isCollapse = ()=>{ 
      return appStore.sidebar.opened 
};

const goPage =()=>{
  if (window.innerWidth <= 767) {
  appStore.sidebar.opened = true;
  }
}


const FunctionData = ref({
  ManagementSystem: null,
  MobileWeb: null,
});

const MenuData = [
  {
    path: '/case-tracking',
    hidden: false,
    icon: 'icon-antenna',
    title: '個案管理',
    isVisible: false,
    children: [
      { path: '/case-tracking', hidden: false, title: '個案管理', isVisible: false }
    ],
  },
  {
    path: '/case-account',
    hidden: false,
    icon: 'icon-user',
    title: '帳號管理',
    isVisible: false,
    children: [
      { path: '/case-account', hidden: false, title: '個案帳號', isVisible: false },      
      { path: '/employee-account', hidden: false, title: '員工帳號', isVisible: false }
    ],
  },

];


const handleLogout = () => {

let paramsList = {};

Logout(paramsList).then((res)=>{
      console.log(res, "1.7 登出"); 
      const { Code, Data } = res; 
      if(Code == 0){
        router.push({ path: '/login' });
      }


     }); 
};
</script>

<style lang="scss" scoped>

.sidebar-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .footer{
    position: absolute;
    bottom: 20px;
    left: 0;
    border-top: none;
  }

}

.el-sub-menu.is-active:not(.is-opened) .icon,
.el-menu-item.is-active .icon {
  content: url('@/assets/imgs/icon_active.svg');
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.icon-antenna {
  content: url('@/assets/imgs/antenna.svg');
}
.icon-user {
  content: url('@/assets/imgs/user-circle.svg');
}

@media (max-width:767px){
  .el-aside{
    transition:none;
    &.sidebar-container.sidebar-layout {
    width: 100%;
    position: fixed;
    background:rgba(0, 0, 0, 0.5);
    z-index: 999;
    ::v-deep{
      .el-scrollbar__view{
        
      
          > .el-menu {
             margin-top: 0;
             border-radius: 0 0 10px 10px;
             padding-top:10px;
             overflow-y: auto;
             
          }
       }
    }

    }
 }
}

</style>

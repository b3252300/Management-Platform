<template>
  <div  class="header-layout">
    <div class="container-left">
      <el-button  v-if="$route.name !== 'Login'"
        :class="[isCollapse ? 'menu-open-btn' : 'menu-close-btn']"
        text
        @click="setCollapse"></el-button>
      <Logo></Logo>
      <el-drawer
        v-model="menuCollapse"
        title="I am the title"
        direction="ltr"
        :show-close="false"
        size="66%"
        :before-close="setCollapse">
        <template #header>
          
          <Logo></Logo>
        </template>
        <template #default>
          <!-- <MenuDrawer /> -->
          
        </template>
      </el-drawer>
      <!--  -->
      <!-- <Breadcrumb /> -->
    </div>

    <div v-if="$route.name !== 'Login'" class="container-right">
   
      <el-dropdown class="btn_login" trigger="click" style="border-radius:10px;">
        <el-button round text class="user-btn">
          <template #default>
            <img class="user-btn-icon" src="@/assets/imgs/menberimg.png" alt="" >
            {{ userName }}
            <!-- <span style="padding-left: 4px">  {{ idToken.name }}</span> -->

          </template>
          </el-button>
        <template #dropdown>
       

            <el-dropdown-item @click="handleLogout" class="btn_login">
              <img  src="@/assets/imgs/log-out-04.svg" alt="登出" >
              <span style="font-size: 15px;">登出</span>
              
            </el-dropdown-item>
         
        </template>
      </el-dropdown>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import { useAppStore, useUserStore } from '@/store';
import Breadcrumb from './breadcrumb.vue';
import Notification from './notification.vue';
import MenuDrawer from './menuDrawer.vue';
import Logo from '@/layout/components/sidebar/Logo';
import { useRouter, useRoute } from 'vue-router';
import { encryptStorage } from "@/utils/EncryptStorage";
import { Logout } from '@/api/common';
import { ElMessage } from 'element-plus'


const router = useRouter();
const route = useRoute();

const appStore = useAppStore();
const userStore = useUserStore();

const menuCollapse = ref(true);
const isCollapse = ref(false);
const isDrawerShow = ref(false);

isCollapse.value = true;

isCollapse.value = route.fullPath.toLowerCase().includes('line') ? true : appStore.sidebar.opened; //O
isDrawerShow.value = route.fullPath.toLowerCase().includes('line'); //O

menuCollapse.value = !isCollapse.value && isDrawerShow.value;

const setCollapse = () => {
  isCollapse.value = !isCollapse.value;
  appStore.TOGGLE_SIDEBAR();
  menuCollapse.value = !isCollapse.value && isDrawerShow.value;

};



const userName = ref('');
userName.value = encryptStorage.getItem("DisplayName");



// //liff 設定
// import  lifffunction from '@/composable/liffLogin.js'
// const {  idToken, logout,  LiffisLoggedIn, listDeveloper } = lifffunction();
// const handleLogout = () => {
//       logout(); // 呼叫外部登出方法
//     };
const handleLogout = () => {

  let paramsList = {};

  Logout(paramsList).then((res)=>{
        console.log(res, "1.7 登出"); 
        const { Code, Data } = res; 
        if(Code == 0){
          userStore.RESET_INFO();
          router.push({ path: '/login' });
        }


       }); 
};

</script>

<style lang="scss" scoped>

.header-layout {
  display: flex;
    padding: 0 16px;
    height: 60px;
    

  .container-left {
    flex: 3;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    @media screen and (max-width:575px){
      gap: 8px;
    }
  }
  .container-right {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    @media screen and (max-width:767px){
         display: none;
    }
  }
}

.menu-open-btn {
  background-image: url('@/assets/imgs/header/menu.svg');
  background-repeat: no-repeat;
  background-position: center;
}
.menu-open-btn:hover {
  background-image: url('@/assets/imgs/header/menu.svg');
}
.menu-open-btn:active {
  background-image: url('@/assets/imgs/header/menu.svg');
}
.menu-close-btn {
  background-image: url('@/assets/imgs/header/menu.svg');
  background-repeat: no-repeat;
  background-position: center;
}
.menu-close-btn:hover {
  background-image: url('@/assets/imgs/header/menu.svg');
}
.menu-close-btn:active {
  background-image: url('@/assets/imgs/header/menu.svg');
}

.notification-btn {
  background-image: url('@/assets/imgs/header/notifcation_default.svg');
  background-position: center;
  object-fit: contain;
}
.notification-btn:hover {
  background-image: url('@/assets/imgs/header/notifcation_hover.svg');
}
.notification-btn:active {
  background-image: url('@/assets/imgs/header/notifcation_active.svg');
}
::v-deep(.el-button.user-btn){
  @media screen and (max-width:575px){
    padding-left: 0;
    padding-right: 0;
  }

}
.user-btn {
   font-size: 15px;

  &-icon{
      width: 30px;
      height:30px;
      // background: #DCDFE6;
      // border: solid #FAFAFA thin;
      object-fit: contain;
      border-radius: 100%;
      margin-right: 10px;
      padding: 4px;
      @media screen and (max-width:575px){
        width: 24px;
        height:24px;
        margin-right: 8px;
      }
  }

}


.el-button.is-text:not(.is-disabled):hover{
  background-color: transparent;
}

::-v-deep{
  .el-dropdown__popper .el-dropdown__list {
    padding: 10px;
  }

}
</style>

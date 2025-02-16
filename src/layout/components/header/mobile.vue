<template>
  <div class="header-layout">

<img src="@/assets/imgs/lineLogo.svg" alt="聯新關骨樂活吧">
    <div class="ml-auto">
      <el-button      
        :class="[isCollapse ? 'menu-open-btn' : 'menu-close-btn', 'btn_menu']"
        plain
        @click="menuCollapse = true"></el-button>

      <el-drawer
        style="min-height:100px;"
        size="180"
        v-model="menuCollapse"
        modal-class="menu_Show"    
        direction="ttb"                
        :before-close="setCollapse">        
        <template #default>
        
            <router-link v-for="button in buttons" class="btn btn-text" @click="menuCollapse = false" :key="button.text" :to="{ name: button.name }">{{ button.text }}</router-link>
            
          <!-- <el-button
            class="btn_menu_text"          
            :key="button.text"           
            type="plain"
            tag="a"
            link>
              {{ button.text }}
          </el-button> -->
     
        </template>
      </el-drawer>     
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

const appStore = useAppStore();
const userStore = useUserStore();

const menuCollapse = ref(true);
const isCollapse = ref(true);
const isDrawerShow = ref(false);

isCollapse.value = appStore.device == 'line' ? true : appStore.sidebar.opened; //O
isDrawerShow.value = appStore.device == 'line'; //O
menuCollapse.value = !isCollapse.value && isDrawerShow.value;

const setCollapse = () => {

  isCollapse.value = !isCollapse.value;
  appStore.TOGGLE_SIDEBAR();
  menuCollapse.value = !isCollapse.value && isDrawerShow.value;

};

const userName = ref('');
userName.value = userStore.userName;


const buttons = [
    {  text: '我要掛號',  name:'Outpatient' },
    {  text: '查詢取消',  name:'QueryCancellation' },
]
</script>

<style lang="scss" scoped>
.btn_menu_text{
  font-size: 16px;
}
::v-deep{ 
  .el-header{
    --el-header-height: 56px;
  }
  .el-drawer__header{
    padding: 16px;
  }
  .menu_Show{
  .el-drawer__body {
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    > a{
      display: flex;
      width: 100%;
      min-height: 40px;
      font-size: 15px;
      border-radius: 0;
      align-items: center;
      justify-content: flex-start;
      &:hover, &:focus, &:active{
        color: #008CD6;
        background-color: transparent;
    }

    }
  }
  .el-drawer__close-btn{
    width: 32px;
    height: 32px;
    align-items: center;
    border: solid transparent thin;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
        border-radius: 0;
    &:hover, &:focus, &:active{
      border-color: #008CD6;
      background: #B4E0F7
    }
  }
  .el-drawer{
    border-radius: 0 0 10px 10px;
  }
  .el-button{
    &:hover, &:focus{
      color: #008CD6
    }
  }

}
}

.header-layout {
  display: flex;
    justify-content: space-between;
    padding: 0 16px;
    height: 59px;
    align-items: center;
}

::v-deep(.el-button.is-circle){
  width: 24px;
  height: 24px;
}

.menu-open-btn {
  background-image: url('@/assets/imgs/header/menu.svg');
  background-repeat: no-repeat;
  background-position: center;
  // background-color: #B4E0F7;
  //   border: solid #008CD6 thin;
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

.user-btn {
  content: url('@/assets/imgs/header/user.svg');
  // background-image: url('@/assets/imgs/header/user.svg');
  // background-repeat: no-repeat;
  // background-position: center;
}

.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #ffffff;
}
</style>

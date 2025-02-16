<template>
  <el-scrollbar style="height: calc(100vh - 76px)">
    <el-menu :default-active="currentPath" router>
      <template v-for="(item, index) in MenuData" :key="item.path">
        <!--   沒有子路由 -->
        <template v-if="!item.children || item.children.length == 0">
          <el-menu-item :index="item.path" v-if="!item.hidden" @click="goPage">
            <el-icon><img class="icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
        <!--  有一個以上子路由-->
        <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 0">
          <template #title>
            <el-icon><img class="icon" /></el-icon>
            <span>{{ item.title }}</span>
          </template>
          <template v-for="(subItem, subIndex) in item.children" :key="subItem.path">
            <el-menu-item :index="subItem.path" v-if="!subItem.hidden" @click="goPage">
              {{ subItem.title }}
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '@/store';
import { useRouter } from 'vue-router';
const router = useRouter();
// 当前路由的path
const currentPath = router.currentRoute.value.path;
const appStore = useAppStore();

const MenuData = [
  {
    path: '/mobile/homePage',
    hidden: false,
    // icon: HomeImg,
    title: 'Home',
  },
  {
    path: '/mobile/patient',
    hidden: false,
    // icon: HomeImg,
    title: 'Healthcare',
    children: [
      { path: '/mobile/patient', hidden: false, title: 'Patient List' },
      { path: '/mobile/intakeoutput', hidden: false, title: 'Intake & Output Recording' },
      { path: '/mobile/location', hidden: false, title: "Patient's Location" },
      { path: '/mobile/critical', hidden: false, title: 'Critical Lab Report' },
      { path: '/mobile/bullentin', hidden: false, title: 'Bulletin Board' },
    ],
  },
  {
    path: '/mobile/housekeeping',
    hidden: false,
    // icon: HomeImg,
    title: 'Housekeeping',
    children: [
      { path: '/mobile/housekeeping', hidden: false, title: 'Request Task' },
      { path: '/mobile/cleaning', hidden: false, title: 'Cleaning Location' },
    ],
  },
  {
    path: '/mobile/service',
    hidden: false,
    // icon: HomeImg,
    title: 'Customer Service',
    children: [{ path: '/mobile/service', hidden: false, title: 'Service Task' }],
  },
];
</script>

<style lang="scss" scoped>
.icon {
  content: url('@/assets/imgs/icon.svg');
}
.el-sub-menu.is-active:not(.is-opened) .icon,
.el-menu-item.is-active .icon {
  content: url('@/assets/imgs/icon_active.svg');
}
</style>

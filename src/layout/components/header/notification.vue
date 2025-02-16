<template>
  <el-dropdown trigger="click">
    <el-badge :is-dot="false" :offset="[-3, 5]">
      <el-button circle class="notification-btn" text @click=""></el-button>
    </el-badge>

    <template #dropdown>
      <el-dropdown-menu class="notification">
        <el-dropdown-item>
          <div class="notification-card">
            <img :src="BedMakingImg" class="img" />
            <div class="card-body">
              <div class="title">
                <div>701A</div>
                <div style="color: #909399">23/05 18:09</div>
              </div>
              <div class="txt">has request of Clear Rubbishhas</div>
            </div>
          </div>
        </el-dropdown-item>
        <el-dropdown-item>
          <div class="notification-card">
            <img :src="BedMakingImg" class="img" />
            <div class="card-body">
              <div class="title">
                <div>701A</div>
                <div style="color: #909399">23/05 18:09</div>
              </div>
              <div class="txt">has request of Clear Rubbishhas request of Clear Rubbish</div>
            </div>
          </div>
        </el-dropdown-item>
        <el-dropdown-item divided @click="toBulletin" style="display: flex; justify-content: center">
          <span class="more">More days</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

import BedMakingImg from '@/assets/imgs/BedMaking.svg';

const toBulletin = () => {
  router.push({ path: '/bullentin' });
};
</script>

<style lang="scss" scoped>
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

.notification-card {
  width: 374px;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #303133;
  font-size: 14px;
  font-weight: 400;
  line-height: 19.6px;

  .img {
    width: 40px;
    height: 40px;
  }
  .card-body {
    display: flex;
    flex-direction: column;
    width: 290px;

    .title {
      display: flex;
      justify-content: space-between;
      line-height: 22px;
    }

    .txt {
      width: 290px;
      word-wrap: break-word;
      white-space: normal;
      overflow: hidden;
    }
  }
}

.more {
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  color: #008CD6;
}

.notification ::v-deep(.el-dropdown-menu) {
  width: 406px;
}
</style>

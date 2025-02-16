<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <transition name="sidebarLogoFade">
      <div v-if="props.collapse" key="collapse" :title="title" class="sidebar-logo-link" @click="ClickFuns">
        <img v-if="logo" :src="logoCollapse" class="sidebar-logo" style="object-fit: contain" />
      </div>

      <div v-else key="expand" :title="title" class="sidebar-logo-link" @click="ClickFuns">
        <img v-if="logo" :src="logo" class="sidebar-logo" /> 
        <div class="sidebar-title">{{VITE_TITLT}}</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import logo from '@/assets/imgs/logo-collapse.svg';
import logoCollapse from '@/assets/imgs/logo-collapse.svg';
const VITE_TITLT = import.meta.env.VITE_TITLT
const props = defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;

  margin-left: 10px;
  text-align: center;
  overflow: hidden;

  .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    .sidebar-logo {
      width: auto;
      height: 23px;
      vertical-align: middle;
      margin-right: 12px;
      display: inline-block;
      @media screen and (max-width:575px){
        height: 17px;
      }
    }


    .sidebar-title {
      color: #333;
      font-weight: 400;   
      font-size: 13px;

    }
  }

  &.collapse {
    width: 60px;
    height: 60px;
    margin-left: 0px;
    transition: all 0.3s ;
    .sidebar-logo {
      width: 56px;
      height: 56px;
      margin-right: 0px;
    }
  }
}
</style>

<template>
  <div class="app-main">
    <!-- 
      :key="$route.fullPath" :解决切换路由，页面不刷新，
      请注意：如果有使用keep-alive页面缓存，使用此方法会导致缓存失效
    -->
    <router-view :key="$route.fullPath">
      <template #default="{ Component }">
        <transition appear name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="key" />
          </keep-alive>
        </transition>
      </template>
    </router-view>
    
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTagsViewStore } from '@/store';

const route = useRoute();
const router = useRouter();
const tagsViewStore = useTagsViewStore();

const key = computed(() => route.path);
const cachedViews = computed(() => tagsViewStore.cachedViews);


defineOptions({
  name: 'AppMain',
});
</script>

<style lang="scss" scoped>
.app-main {
  padding:10px 20px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  @media screen and (max-width:767px){
    padding:10px 16px 20px;
    overflow: inherit;
  }
  }

</style>
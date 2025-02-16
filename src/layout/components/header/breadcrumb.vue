<template>
   <el-breadcrumb class="bread">
    <el-breadcrumb-item v-for="item in routers" :key="item.path" > <!-- :to="{ path: item?.path }" -->
            {{item?.meta?.title}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()
// 当前路由的匹配记录
// console.log(router.currentRoute.value.matched)
const routers = computed(()=>{
    return router.currentRoute.value.matched.filter(item=>item.meta.title);
})
</script>

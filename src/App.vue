<template>
  <!-- <el-config-provider :locale="locale" :size="size"> -->
  <el-config-provider :size="size">
    <router-view/>

  
  
  </el-config-provider>

    <!-- <Loading/> -->


</template>



<script>
import { defineComponent, computed, onMounted, onUnmounted } from 'vue';
import { ElConfigProvider } from 'element-plus';
// import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import en from 'element-plus/es/locale/lang/en';
import { useAppStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';
// import { useI18n } from 'vue-i18n'
import useWebView from '@/utils/webView.js';
//確認是否版本更新
import { useVersion } from '@/composable/version.js';



export default defineComponent({
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
 
  },
  setup() {
    // const { t } = useI18n()
    const appStore = useAppStore();
    // const locale = computed(() => {
    //   appStore.SET_LANG(appStore.lang);

    //   appStore.lang === 'zh-CN' ? zhCn : en;
    // });
    const size = computed(() => appStore.size);
    // const {EnabledEmbeddedWebViewFrameMode} = useWebView();
    //  console.log(import.meta.env.VITE_Version);
    const route = useRoute();
 
    useVersion();//確認是否版本更新

    // const handleScroll = () => {
    //   if (window.scrollY > 0) {
    //     document.body.classList.add("scrolled");
    //   } else {
    //     document.body.classList.remove("scrolled");
    //   }
    // };

    // onMounted(() => {
    //   window.addEventListener("scroll", handleScroll);
    // });

    // onUnmounted(() => {
    //   window.removeEventListener("scroll", handleScroll);
    // });



    return {
      // locale,
      size,
      // EnabledEmbeddedWebViewFrameMode
    };
  },
  methods: {
    setWebView() {
      useWebView().EnabledEmbeddedWebViewFrameMode();
    },
  },
});
</script>

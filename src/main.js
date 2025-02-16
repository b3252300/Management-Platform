import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerStore } from '@/store'
// import { useSvgIcon } from './icons'

import ElementPlus from 'element-plus'
import zhTw from 'element-plus/es/locale/lang/zh-tw'


import { useAppStore } from '@/store'; 


// tailwindcss 按需引入
// import 'tailwindcss/tailwind.css'
import 'element-plus/dist/index.css'
import './permission'
import 'animate.css'
// 导入公共样式
import './styles/index.scss'





// 导入字体图标
import './assets/iconfont/iconfont.css'
// 全局事件总成
import globalEmitter from '@/utils/mitt'
// 自定义指令
import registerDirective from '@/directive'
// 国际化
// import { setupI18n } from '@/locale'

// 注册所有element icons
import { setupElementIcons } from '@/plugins/elementIcons'
import { useTable } from '@/plugins/vxeTable'
import 'element-plus/dist/index.css'

// import { Vue3SeamlessScroll } from 'vue3-seamless-scroll'

// https://lottiefiles.com/web-player?lottie_url=https%3A%2F%2Fassets6.lottiefiles.com%2Fpackages%2Flf20_Kr2vAt3caT.json
import Vue3Lottie from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

//RSA
import UUID from "vue3-uuid";

//行動裝置檢查工具
import VConsole from 'vconsole';
if(process.env.NODE_ENV === "development"){
  const vConsole = new VConsole();
  console.log(process.env.NODE_ENV, "process");
}




//正式環境清除console.log
if(process.env.NODE_ENV !== "development"){
   if(window){
    window.console.log = function(){}
   }
}

if(process.env.NODE_ENV !== "devsite"){
  if(window){
   window.console.log = function(){}
  }
}


//import './mock'


//全域自訂樣式
import './styles/custom/style.scss'

import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App)

//全域沒有資料的圖片
app.config.globalProperties.$imgNotFound = new URL('@/assets/imgs/icon_NotFound.svg', import.meta.url).href;



const initApp = async () => {
  app.use(Vue3Lottie)
  app.use(router)
  // app.use(Vue3SeamlessScroll)
  // useSvgIcon(app)
  registerStore(app)
  registerDirective(app)
  await router.isReady()

  // setupI18n(app)
  setupElementIcons(app)

  app.use(globalEmitter)
  // app.use(ElementPlus)
  app.use(ElementPlus, {
    locale: zhTw,
  })
  app.use(UUID)
  app.use(useTable)
  app.use(pinia)


  if (import.meta.env.VITE_READ_LOCAL_CONFIG == "true") {
    var configPath = import.meta.env.VITE_PUBLIC_PATH + "appsettings.json";
    if (process.env.NODE_ENV == "development") {
      configPath = import.meta.env.VITE_PUBLIC_PATH + "appsettings.json";
    }

    const response = await fetch(configPath);
    const config = await response.json();

    const appStore = useAppStore()
    appStore.SET_ApiRootUrl(config.apiUrl);

  } else {
    //apiRootUrl = import.meta.env.VITE_APP_API;
  }


  app.mount('#app')
  window.app = app;
  // register global utility filters
}
initApp()

import { defineStore } from 'pinia'
import cookies from '@/utils/cookies'

const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      sidebar: {
        opened: cookies.get('sidebarStatus') ? !!+cookies.get('sidebarStatus') : true,
        withoutAnimation: false
      },
    
      size: cookies.get('size') || 'default',
      lang: cookies.get('lang') || 'zh-CN',
      Role: cookies.get('Role') || '0',

      ApiRootUrl: cookies.get("apiRootUrl") || '',
 
      embeddedWebViewFrameMode: cookies.get("FrameMode") || 'false',
    }
  },
  actions: {
    TOGGLE_SIDEBAR() {
      this.sidebar.opened = !this.sidebar.opened
      this.sidebar.withoutAnimation = false
      if (this.sidebar.opened) {
        cookies.set('sidebarStatus', 1)
      } else {
        cookies.set('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR(withoutAnimation) {
      cookies.set('sidebarStatus', 0)
      this.sidebar.opened = false
      this.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE(device) {
      this.device = device
    },
    SET_SIZE(size) {
      this.size = size
      cookies.set('size', size)
    },
    SET_LANG(lang) {
      this.lang = lang
      cookies.set('lang', lang)
    },
    SET_ROLE(role) {
      this.Role = role
      cookies.set('Role', role)
    },
    SET_BodeCode(bedCode) {
      this.BedCode = bedCode
      cookies.set('BedCode', bedCode)
    },
    SET_ApiRootUrl(apiRootUrl) {
      this.ApiRootUrl = apiRootUrl;
      cookies.set("apiRootUrl", apiRootUrl);
    },
    SET_SignalrUrl(signalrUrl) {
      this.SignalrUrl = signalrUrl;
      cookies.set("signalrUrl", signalrUrl);
    },
    SET_FrameMode(embeddedWebViewFrameMode) {
      this.embeddedWebViewFrameMode = embeddedWebViewFrameMode;
      cookies.set("FrameMode", embeddedWebViewFrameMode);
    },
    SET_DEVICE(val) {
      this.device = val;
      cookies.set("Device", val);
    }
  }
})

export default useAppStore

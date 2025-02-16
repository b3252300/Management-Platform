import { defineStore } from 'pinia'
import variables from '@/styles/element-variables.scss?inline'
import { localStorageHandle } from '@/utils/storage'
import defaultSettings from '@/settings'

const { tagsView, fixedHeader, sidebarLogo, fixedFooter } = defaultSettings

const useSettingsStore = defineStore({
  id: 'settings',
  state: () => {
    const localTagsView = localStorageHandle.getItem('tagsView')
    const localFixedHeader = localStorageHandle.getItem('fixedHeader')
    const localSidebarLogo = localStorageHandle.getItem('sidebarLogo')
    const localfixedFooter = localStorageHandle.getItem('fixedFooter')
    const localCollaspe = localStorageHandle.getItem('Collaspe')
    return {
      theme: variables.theme,
      tagsView: localTagsView ? !!+localTagsView : tagsView,
      fixedHeader: localFixedHeader ? !!+localFixedHeader : fixedHeader,
      fixedFooter: localfixedFooter ? !!+localfixedFooter : fixedFooter,
      sidebarLogo: localSidebarLogo ? !!+localSidebarLogo : sidebarLogo,
      layoutMod: localStorageHandle.getItem('layoutMod') == 'horizontal' ? 'horizontal' : 'vertical'
    }
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        this[key] = value
        localStorageHandle.setItem(key, +value)
      }
    },
    CHANGE_LAYOUT_MOD(val = 'vertical') {
      const mod = val == 'vertical' ? 'vertical' : 'horizontal'
      localStorageHandle.setItem('layoutMod', mod)
      this.layoutMod = mod
    },
    CHANGE_COLLASPE(val = true) {
      const mod = val == true ? true : false;
      localStorageHandle.setItem('sidebarLogo', mod)
      this.sidebarLogo = mod
    }
  }
})
export default useSettingsStore

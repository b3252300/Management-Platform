import { defineStore } from 'pinia'
import cookies from '@/utils/cookies'
import { TOKEN, AVATAR } from '@/config/constant'
import { logout } from '@/api/user'
import { resetRouter } from '@/router'
import useTagsViewStore from './tagsView'
import { encryptStorage } from "@/utils/EncryptStorage";
const useUserStore = defineStore({
  id: 'users',
  state: () => {
    return {
      token: cookies.get(TOKEN),
      fileToken: cookies.get("FileToken"),
      uid: '9527',
      avatar: '',
      userName: cookies.get("UserName"),
      phone: '',
      email: '',
      identity: '',
      Role: '',
      BedCode: '',
      AccountRowId: cookies.get("AccountRowId"),
      roles: []
    }
  },
  actions: {
    SET_TOKEN(token = '') {
      token ? cookies.set(TOKEN, token) : cookies.remove(TOKEN)
      this.token = token
    },
    SET_FILE_TOKEN(token = '') {
      token ? cookies.set("FileToken", token) : cookies.remove("FileToken")
      this.fileToken = token
    },
    SET_ACCOUNT_ROWID(rowId = '') {
      rowId ? cookies.set("AccountRowId", rowId) : cookies.remove("AccountRowId")
      this.AccountRowId = rowId
    },
    SET_USER_NAME(val = '') {
      val ? cookies.set("UserName", val) : cookies.remove("UserName")
      this.userName = val
    },
    async LOGIN_OUT() {
      try {
        const { code } = await logout()
        if (code == 0) {
          this.token = '';
          this.UserName = '';
          this.avatar = '';
          this.phone = '';
          this.email = '';
          this.identity = '';
          this.roles = [];
          this.Role = '';
          this.BedCode = '';
          this.AccountRowId = '';
          this.RESET_INFO();
        }
      } catch (error) {
        return error
      }
    },
    // 清空所有登录信息
    RESET_INFO() {
      return new Promise(resolve => {
        const tagsViewStore = useTagsViewStore()
        cookies.clearAll()
        // resetRouter()
        encryptStorage.removeItem("Token");
        encryptStorage.removeItem("DisplayName")
        encryptStorage.removeItem("searchList")
        // encryptStorage.removeItem("AES_KEY")
        tagsViewStore.DEL_ALL_VIEWS(null)
        resolve()
      })
    }
  }
})
export default useUserStore

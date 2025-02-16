
import router from './router'
import cookies from '@/utils/cookies'
import { TOKEN } from '@/config/constant'
import getPageTitle from '@/utils/getPageTitle'
import { useUserStore, usePermissionStore } from '@/store'
import { encryptStorage } from "@/utils/EncryptStorage";
import NProgress from '@/utils/progress'


//排除不用驗證的頁面
const whiteList = ['/login', '/line/login', '/line', '/test']



router.beforeEach(async (to, from, next) => {

  console.log(to , "tototototo");
  NProgress.start()
  document.title = getPageTitle(to.meta?.title)
const hasToken = encryptStorage.getItem("Token");

 // 判斷是否為 /line 開頭的路徑
 const currentMobile = to.meta.device == "line";
 console.log(currentMobile, "currentMobile");

 if (currentMobile) {

    // 如果不存在 ID Token，導向 /line
    next();
    NProgress.done();

} else {
  // 如果不是 /line 開頭的路徑，進行正常的 token 驗證邏輯
  if (hasToken && hasToken !== 'undefined') {
    next();
  } else {
    // 檢查是否在白名單內
    if (whiteList.indexOf(to.path) !== -1 || whiteList.includes(to.name)) {
      next();
    } else {
      next('/login');
      NProgress.done();
    }
  }
}
});

router.afterEach(() => {
  NProgress.done()
})


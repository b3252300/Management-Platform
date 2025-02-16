<template>
<el-container>   
      <Header></Header>
  <div class="section-container login-container un-select">
    <div class="box-card">
      <div class="box-card-width">
        <!-- <div class="logo"><img src="/src/assets/imgs/logo_top.png" /></div> -->

        <div class="main">
          <div class="title">ERAS個案管理平台</div>
          <div class="subtitle">帳號登入</div>
          <login-pwd />
          <div class="content"><el-button   link class="btn_Privacy"  @click="openDialog">使用條款&ensp;  |  &ensp;隱私權保護政策</el-button></div>
        </div>
   
      </div>
    </div>
  </div>
  <el-footer>
    <Footer></Footer>
  </el-footer>
</el-container>  
<el-dialog v-model="dialogTableVisible" class="container-dialog"  title="隱私權保護政策"  style="max-width: 768px; width: 90%;" @close="resetScrollTop">
  <el-scrollbar  ref="scrollbarRef" style="height:75vh">
    親愛的會員，您好：
    感謝您使用「專家視訊諮詢」服務，以下為專家視訊諮詢會員使用規範，使用服務前請務必閱讀。
<ol>
  <li>預約<br>為維護諮詢服務品質，專家視訊諮詢一次僅服務一人。視訊諮詢時間開始前4小時，無法進行預約。
預約提醒</li>
</ol>
<ol>
  <li>預約提醒<br>預約專家視訊諮詢成功後，可至「預約紀錄」查看您的預約，本APP會在視訊諮詢時間前24小時、前1小時、前10分鐘與前1分鐘推播通知提醒您，請您務必記得您預約的時間。
</li>
</ol>
<ol>
  <li>開始諮詢<br>預約專家視訊諮詢時間開始前1分鐘，即可進入專家視訊諮詢服務，當專家與會員雙方均進入視訊時，系統會開始計時，請準時進入視訊服務以享有完整諮詢時間。
</li>
</ol>
<ol>
  <li>視訊諮詢結束<br>會員於開始視訊後，過程中若中途離線，包含但不限於：點選結束視訊按鈕、關閉APP或網路斷線等，皆視為該次視訊結束，請務必在專家視訊諮詢前確認您的網路連線裝置(智慧型手機、平板或電腦等)及網路環境等軟硬體是否穩定且流暢。
</li>
</ol>

<ol>
  <li>改期與取消<br>於預約時段內因會員個人因素遲到或不到，視為取消該次諮詢服務，且將無法退款。</li>
</ol>
<ol>
  <li>視訊諮詢工具<br>在開始視訊諮詢前，請先確認您的視訊鏡頭、麥克風、耳機及喇叭功能是否正常，且所在環境網路穩定、流暢，以確保視訊通訊品質。</li>
</ol>

<ol>
  <li>改期、取消與退款</li>
  <li>改期、取消與退款您知悉並同意專家視訊諮詢服務經預約後，距諮詢時間開始前24小時內即不可取消退費，您有責任於預約本服務前，事先評估並確認具有使用本服務之需求。</li>
  <li>因會員個人因素需要更改諮詢日期或諮詢時間時，請於諮詢時間前自行取消諮詢並重新預約。如於預約諮詢時間開始前4小時內需更改時，請您聯繫客服人員處理。服務電話：(03)-493-6872。</li>
  <li>如因您的個人事由，無法如期使用並需取消已預約之專家視訊諮詢服務時，請於您該次諮詢時間24小時前完成取消預約程序，系統將全額退款給您；若未在24小時前取消者，將不予退款。完成取消預約程序後，系統將於3至5個工作天內將款項退回至您所使用的信用卡帳戶中，惟其實際退款處理天數，仍依各銀行作業時間為準。</li>
  <li>如因非可歸責於使用者之原因，使當次專家視訊諮詢服務無法執行或中斷時，本APP將與您聯繫另行預約諮詢時間，或視  情形退還全部或部分之諮詢服務費用。</li>
  <li>錄音錄影<br>為確保專家視訊諮詢服務之品質，視訊過程將全程錄影及錄音。當您使用視訊專家諮詢服務時，即視為您同意過程將全程錄影及錄音。如您欲自行將專家視訊諮詢過程予以錄音或錄影時，請事先取得專家之同意，以免觸法。</li>
</ol>


<el-button type="primary" size="large" style="width: 100%; margin-top: 24px;" @click="resetScrollTop">確定</el-button>
</el-scrollbar>
  </el-dialog>
 
</template>

<script setup>
import { ref  } from 'vue'
import LoginPwd from './loginPwd.vue';
import { Header, Footer } from '@/layout/components';
import { useAppStore } from '@/store';
import  "@/composable/RsaJsencrypt.js";
const dialogTableVisible = ref(false);
const scrollbarRef = ref(null);
const dialogTableUserVisible = ref(false);
defineOptions({
  name: 'Login',
});

const resetScrollTop = () => {
  dialogTableVisible.value = false;
  if (scrollbarRef.value?.wrapRef) {
    scrollbarRef.value.wrapRef.scrollTop = 0;
  }
};
const openDialog = () => {
  dialogTableVisible.value = true;
  nextTick(() => {
    resetScrollTop();
  });
};
</script>

<style lang="scss" scoped>
.btn_Privacy.el-button {
  color:#9F9F9F ;
    --el-button-hover-text-color: #008CD6;
    --el-button-hover-bg-color: transparent;
    --el-button-hover-border-color: #E0F2FE;
    --el-button-active-text-color: #333333;
    --el-button-active-border-color: transparent;
    --el-button-active-bg-color:transparent ;
    --el-button-active-color: #9F9F9F;
    &:hover{
      color: #008CD6;
    }

}
.login-container {
  width: 100%;
  min-height: calc(100vh - 50px);
  background: url(@/assets/imgs/bg_login.svg) no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  + .el-footer{
    display: none;
  }

}

.box-card {
    max-width: 558px;
    // max-height: 573px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    box-shadow: 0 0 5px 0 rgba(37, 37, 37, 0.2);
    background: #fff;
    width:100%;
    height: clamp(484px, 31vw, 573px);
    padding: 16px;
    box-sizing: border-box;
    @media screen and (max-width: 767px) {
      width:82%;
    }
     &-width {
      max-width: 358px;
      width: 100%;
      text-align: center;

    }

}


.logo {
  display: flex;
  justify-content: center;
  padding: 0px 24px;
  gap: 8px;
}

.title {
  font-size: 32px;
  color: #333;
  letter-spacing: 0.1vw;
  font-weight: 500;
  line-height:1;
  margin-bottom: 24px;
  text-align: center;
  @media screen and (max-width: 767px) {
    font-size: 23px;
    }
}
.subtitle{
  font-size: 24px;
  color: #333;
  margin-bottom: 32px;
  font-weight: 500;
  @media screen and (max-width: 767px) {
    font-size: 20px;
    }
}
.content{
  color: #9F9F9F;
  font-size: 13px;
  margin-top: 40px;
  @media screen and (max-width: 767px) {
    font-size: 12px;
  }
  a{
    color: #9F9F9F;
    &:hover, &:focus{
      color: #008CD6;
    }
  }
}

::v-deep{
  .el-checkbox__label{
    color:#606266 ;
  }
}


</style>

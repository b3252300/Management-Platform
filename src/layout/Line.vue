<template>


    <div class="login-container">
  
  <div class="logo"><img src="@/assets/imgs/logo.svg" /></div>
  
  <div class="box-card">

    <AppMain :needTagsView="false" />
  </div>
     
    </div>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  
  </template>

  <script setup>
 import { AppMain} from './components';

  </script>
  <style lang="scss" scoped>
  
  .el-form-item{
    width: 100%;
  }
  .el-date-editor {
      --el-date-editor-width:100%;
  }
  
  ::v-deep(.el-date-editor.el-input){
      width: 100%;
  }
  
  .logo{
    text-align: center;
    margin-bottom: 1vw;
  
  }
  .title {
      font-size: 20px;
      line-height: 1.4;
      letter-spacing: 2px;
      margin-bottom: 8px;
      text-align: center;
      font-weight: 500;
  
  }
  .login-container {
    background: url(/src/assets/imgs/bg_login.svg) no-repeat center;
    background-position: 47% 60%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 16px;
      position: relative;
      height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  }
  .box-card {
    margin: 0 auto;
    padding: 30px 20px;
    max-width: 575px;
    width: 100%;
    border-radius: 30px;
    box-shadow: 0 0 5px 0 rgba(37, 37, 37, 0.2);
    background: #fff;
    box-sizing: border-box;
    min-height: 200px;
    ::v-deep(.app-main){
      padding: 0;
    }
      .el-tabs{
        width: 100%;
        margin-top: 32px;
      }
      .description {
      color: #9F9F9F;
      font-size: 15px;
      line-height: 1.3;
      margin-bottom: 20px;
      width: 100%;
      letter-spacing: 2px;
      min-height: 39px;
  
    }
    .mobile-form-inline{
      .el-form-item{
        margin-bottom: 20px;
      }
    }
  
  
  }

  </style>
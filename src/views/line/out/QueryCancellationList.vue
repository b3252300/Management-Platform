<template>
<h1 class="page_titl_line" >   
   <el-button class="btn_goback" text  circle @click="goBack" />
   <span>{{ $route.meta.title }}</span>
</h1>


<div class="container-Checklist">
  <el-descriptions title="葉大雄" :column="1">
    <el-descriptions-item label="時間">2024/11/07(五) 晚診</el-descriptions-item>
    <el-descriptions-item label="地點">門診大樓/2樓 308診</el-descriptions-item>
    <el-descriptions-item label="科別">骨科</el-descriptions-item>
    <el-descriptions-item label="醫師">侯咸仰</el-descriptions-item>
    <el-descriptions-item label="建議看診時間">20:10</el-descriptions-item>
  </el-descriptions>
  <div class="container-number">
    <div class="content_num style_border_green">
        <div class="num">59</div>
        <div  class="txt">你的診號</div>
    </div>
  <div class="content_num style_border_blue">
        <div class="num">35</div>
        <div class="txt">即時診號</div>
  </div>
 
</div>
<div class="UpdateTime">更新時間 2024/11/07 18:20  <el-button :icon="Refresh"  circle text size="large"  /></div> 
  <p class="DescriptionText">請於報到時間21:00結束前向診間進行報到<br>
若要取消預約，請於看診前一天取消</p>
</div>
<div class="d-flex">
  <el-button type="danger" plain @click="" size="large"  class="w-100 btn_danger">取消預約</el-button>   
<el-button type="primary" @click="" size="large"  class="w-100 btn_primary">確定</el-button>   
</div>


</template>
<script  setup>
import { useRouter } from 'vue-router'
import { Refresh } from '@element-plus/icons-vue'
const router = useRouter()
const goBack = () => {
  router.push({ name: 'QueryCancellationEnter'})
  console.log('go back')
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-descriptions__title{
          font-weight: 400;
          &::before{
            content: "";
            border-left: solid #008CD6 2px;
            padding-left: 10px;
          }

  }
  .el-descriptions__body .el-descriptions__table .el-descriptions__cell{
    font-size: 15px;
    padding-bottom: 0;
  }
}
.container{
  &-Checklist{
    border: solid #DCDFE6 thin;
    padding: 10px 16px;
    margin-bottom: 24px;

    .DescriptionText{
      margin-top: 16px;
    }
  }
  &-number{
    margin-top: 16px;
    display: flex;
    column-gap: 16px;
    margin-bottom: 8px;
    .content_num {
         max-width: 176px;
         height: 116px;
         width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          background: #FAFAFA;
          border-radius: 10px;         
          .num{
            font-size: 40px;
            font-weight: 500;
            letter-spacing: 2px;
          }
          .txt{
            font-size: 15px;
            font-weight: 400;
            color: #333;
          }
        }
  }

}
.style_border_blue{
border: solid #8FC31F thin;
.num{
  color: #8FC31F;
}

}
.style_border_green{
  border: solid #008CD6 thin;
  .num{
    color: #008CD6;
  }

}
.UpdateTime {
 
    color: #9F9F9F;
    @media screen and (max-width:575px){
      text-align: center;
    }
}
</style>
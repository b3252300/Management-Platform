<template>
  <h1 class="page_titl_line" >
   
    <el-button class="btn_goback" text  circle @click="goBack" />
    <span>{{ $route.meta.title }}</span>
    </h1>
   
  <div class="container-list">
            <div class="Scheduling-text"> 
              <router-link  :to="{ name:'QueryCancellationList', query:{ ExamCode:123 } }">
              <el-button tag="div" tabindex="0" role="button"  class="text-BasicInformation" v-loading="loading">  
                            <div class="text-primary doctorName"><img src="@/assets/imgs/icon_bone.svg" alt="施秉鋈">骨科<span>施秉鋈</span></div>
                            <div class="doctorTime">2024/10/10(五) 晚診</div>
                            <div>308診 59號(建議於20:10分前報到)</div> 
                </el-button>
              </router-link>
              <router-link  :to="{ name:'QueryCancellationList', query:{ ExamCode:123 } }">
              <el-button tag="div" tabindex="0" role="button"  class="text-BasicInformation">  
                            <div class="text-primary doctorName"><img src="@/assets/imgs/icon_bone.svg" alt="施秉鋈">骨科<span>施秉鋈</span></div>
                            <div class="doctorTime">2024/10/10(五) 晚診</div>
                            <div>308診 59號(建議於20:10分前報到)</div> 
                </el-button>
              </router-link>
                  
            </div>
        
        </div>

</template>
<script  setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter();
const loading = ref(false)

const goBack = () => {
  loading.value = true;
  router.push({ name: 'QueryCancellation'})
  console.log('go back')
}



</script>
<style lang="scss" scoped>
.doctorName{
  margin-bottom: 6px;
  font-size:16px;
}

::v-deep{
  .text-BasicInformation{
    font-size: 15px;
    line-height: 1.5;
    letter-spacing: 2px;
    font-weight: 400;
    color: #333;
    display: block;
    height: auto;
    text-align: left;
    margin-bottom: 16px;
    &:last-child {
        margin-bottom: 0;
    }
    >span {
      display: block;
      }
    + .text-BasicInformation{
      margin-left: 0;
    }  
}
}

ul.Scheduling-text-ul {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: solid #DCDFE6 thin;
        padding:10px 16px;
        .el-button{
            padding: 8px 21px;
        }

    }
}

.Scheduling-text{
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    .title {
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        line-height: 1.8;
    }
}
</style>
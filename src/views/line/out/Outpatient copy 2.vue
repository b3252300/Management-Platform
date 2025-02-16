<template>

        <h1 class="page_titl_line">{{ $route.meta.title }}</h1>
        <div class="container-date">
            <div class="container-date-select">
                <el-button :icon="ArrowLeftBold" link />
                    <div class="dataTime">{{ GetDateYYYYMMDD(ListWeekDates[0]) }} ~ {{ GetDateYYYYMMDD(ListWeekDates[5]) }}</div>
                <el-button :icon="ArrowRightBold" link /> 
             </div>
        <div class="container-date-btn"> 
            <template v-for="date in nextWeekDates" :key="date.dateType">
   
                <el-button type="primary" @click="column(date.dateTop, date.dataToday)" plain v-if="date.weekType !== '日'" :class="[{'style_active' : styleColor}, 'text-black']">
        
                 {{ date.dateType }}<br>
                 {{ date.weekType }}
            </el-button>
            </template>

        </div>

        </div>
        <div class="container-list">
            <div class="Scheduling-text">
                <div class="title">早診<span>09:00~12:30</span></div>
                <ul class="Scheduling-text-ul">
                    <li>
                        <div class="text-BasicInformation">
                            <div class="text-primary">307診</div>
                            <div class="name">孫瑞昇</div>
                            <div class="text-info">20人已預約</div>
                        </div>
                        <el-button type="primary" class="float-right text-primary"  @click="goOutpatientVerify"   plain>掛號</el-button> 
                    </li>
                    <li>
                        <div class="text-BasicInformation">
                            <div class="text-primary">307診</div>
                            <div class="name">孫瑞昇</div>
                            <div class="text-info">20人已預約</div>
                        </div>
                        <el-button type="primary" class="float-right text-primary"  @click="goOutpatientVerify"    plain>掛號</el-button> 
                    </li>
                </ul>
                  
            </div>
            <div class="Scheduling-text">
                <div class="title">早診<span>09:00~12:30</span></div>
                <ul class="Scheduling-text-ul">
                    <li>
                        <div class="text-BasicInformation">
                            <div class="text-primary">307診</div>
                            <div class="name">孫瑞昇</div>
                            <div class="text-info">20人已預約</div>
                        </div>
                        <el-button type="info" class="float-right"   plain disabled>截止</el-button> 
                       
                    </li>
                    <li>
                        <div class="text-BasicInformation">
                            <div class="text-primary">307診</div>
                            <div class="name">孫瑞昇</div>
                            <div class="text-info">20人已預約</div>
                        </div>                     
                        <el-button type="danger" class="float-right"  plain>額滿</el-button> 
                    </li>
                </ul>
                  
            </div>
        </div>

    

 

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { parseTime } from '@/utils/index.js'
import useDate from '@/utils/date.js'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'



const router = useRouter()
const { GetDateWeek, GetDateYYYYMMDD } = useDate();

// const timeWithWeekday = parseTime(new Date(), '{y}年{m}月{d}日 星期{a}')
const timeWithWeekday = parseTime(new Date(), '{d}') //取得今天日期
const nextWeekDates = ref([]) // 儲存未來一週的日期
const ListWeekDates = ref([]);
// // 計算未來一週的日期
// const getNextWeekDates = (currentDate = new Date()) => {
//   const list = [] // 儲存日期與星期的陣列
//   for (let i = 0; i < 7; i++) {
//     const date = new Date(currentDate) // 複製當前日期物件
//     date.setDate(currentDate.getDate() + i) // 從今天開始，依序加上天數
//     // 組合成所需格式的物件
//     list.push({
//       dateType: parseTime(date, '{d}'), // 格式化為日期
//       weekType: parseTime(date, '{a}') // 格式化為星期
//     })
//   }
//   return list
// }


const getNextWeekDates = (currentDate = new Date()) => {
  const list = [] // 儲存日期與星期的陣列
  const dayOfWeek = currentDate.getDay() || 7 // 取得今天是星期幾（星期日視為 7）
  const startOfWeek = new Date(currentDate) // 複製當前日期物件
  startOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1)) // 設定為本周的週一

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek) // 複製週一日期物件
    date.setDate(startOfWeek.getDate() + i) // 從週一開始依序加上天數
    // 組合成所需格式的物件
    list.push({
      dataToday:dayOfWeek,
      dateTop:date,//標準格式
      dateType: parseTime(date, '{d}'), // 格式化為日期
      weekType: parseTime(date, '{a}') // 格式化為星期
    })
  }
  return list
}

const getNextWeekList = (currentDate = new Date()) => {
  const list = [] // 儲存日期與星期的陣列
  const dayOfWeek = currentDate.getDay() || 7 // 取得今天是星期幾（星期日視為 7）
  const startOfWeek = new Date(currentDate) // 複製當前日期物件
  startOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1)) // 設定為本周的週一

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek) // 複製週一日期物件
    date.setDate(startOfWeek.getDate() + i) // 從週一開始依序加上天數
    // 組合成所需格式的物件
    list.push(date)
  }
  console.log(list, "date");
  return list
}

// 初始化，取得未來一週的日期
onMounted(() => {
  nextWeekDates.value = getNextWeekDates();
  ListWeekDates.value = getNextWeekList();
})


const goOutpatientVerify = ()=>{
    router.push({ name: 'OutpatientVerify'})
}


const dates = ref([
    {date:"04", week:"二"},
    {date:"04", week:"二"},
    {date:"04", week:"二"},
    {date:"04", week:"二"},
    {date:"04", week:"二"},
    {date:"04", week:"二"},
]);

const list = ref([
    {dateType:"04", weekType:"二"},
]);

const styleColor = ref();
const column = (val, today)=>{
    console.log(val.getDay(), "val");
    console.log(today, "today");
    styleColor.value = false;
    if(today){

    }
}

</script>
<style lang="scss" scoped>

.container-date {
    margin-bottom: 24px;
    &-select{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #008CD6;
        font-size: 16px;
        margin-bottom: 10px;
    }
    &-btn{
    display: grid;
    grid-template-columns: repeat(6, 1fr); /* 分成 6 欄，每欄寬度相等 */
    grid-gap: 5px; /* 格子間距 10px */
    // .el-button{
    //     background-color: transparent;
    //     &:focus, &:active{
    //         background: #008CD6 !important;
    //     }
    // }
    .el-button {
        min-height: 54px;
        font-size: 16px;
        line-height: 1.2;
      
        margin-left: 0;
        border-color: transparent;
        


        &:focus-visible,  &:focus,  &:active {    
            outline: none;
            background: #008CD6;
            color: #fff;
        }
       &.style_active {
    background: #008CD6;
    color: #fff;
}
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
        padding: 8px 16px;
        .el-button{
            padding: 8px 21px;
        }
    }
}

.text-BasicInformation{
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 2px;
    font-size: 16px;

}
.Scheduling-text{
    margin-bottom: 16px;
    &:last-child {
        margin-bottom: 0;
    }
    .title {
        font-size: 16px;
        display: flex;
        justify-content: space-between;
        line-height: 1.8;
    }
}
.style-color-today{
background: #008CD6;
}


</style>
<template>
<h1 class="page_titl_line">骨科/{{ $route.meta.title }}</h1>
<div class="container-date">
    <div class="container-date-select">

     <el-button :icon="ArrowLeftBold" link class="btn-arrow btn-pre" @click="showPreviousWeek" :disabled="!canShowPreviousWeek"/>
     <div class="dataTime">{{ GetDateYYYYMMDD(ListWeekDates[0]) }} ~ {{ GetDateYYYYMMDD(ListWeekDates[5]) }}</div>
     <el-button :icon="ArrowRightBold" link class="btn-arrow btn-next"  @click="showNextWeek" :disabled="!canShowNextWeek"/>

    </div>
  
<div>
    <el-segmented v-model="valueDate" :options="nextWeekDates" @change="confirm"  block>
      <template #default="{ item }">  
            <div class="btn">              
                {{ parseTime(item.label, '{d}') }}<br>
                {{ parseTime(item.label, '{a}') }}             
            </div>
      </template>
    </el-segmented>
  </div>


        </div>
        <div v-if="tabledata.length > 0" class="container-list">

            <div class="Scheduling-text">
                <div class="title">早診<span>09:00~12:30</span></div>
                <div class="Scheduling-text-ul">                
                    <el-card  style="width: 100%" shadow="never" v-if="tabledata.filter((item) => item.Apn == 1).length > 0"   v-for="val in tabledata.filter((item) => item.Apn == 1)" :key="val.DoctorName">
                     
                            <div class="text-BasicInformation">
                                    <div class="text-primary">{{ val.ClinicName }} 診</div>
                                    <div class="name">{{ val.DoctorName }}</div>
                            </div>
                       
                                <el-button  :type="Status(val.Status).type"  class="float-right text-primary"  @click="goOutpatientVerify(val)"   plain  :disabled="Status(val.Status).disabled">
                                        {{ Status(val.Status).text }}
                               </el-button>

                    </el-card>                    
                

                  <el-card style="width: 100%" shadow="never"  v-else>
                            <div class="name" style="color: #9F9F9F;">此時段沒有醫師看診</div>
                    </el-card>
                </div>
                  
            </div>
            <div class="Scheduling-text">
                <div class="title">午診<span>13:30~17:00</span></div>
                <div class="Scheduling-text-ul">
                    <el-card style="width: 100%" shadow="never"    v-if="tabledata.filter((item) => item.Apn == 2).length > 0"  v-for="val in tabledata.filter((item) => item.Apn == 2)" :key="val.DoctorName">
                            <div class="text-BasicInformation">
                              
                                    <div class="text-primary">{{ val.ClinicName }} 診 </div>
                                    <div class="name">{{ val.DoctorName }}</div>
                            </div>
                            <el-button  :type="Status(val.Status).type"  class="float-right text-primary"  @click="goOutpatientVerify(val)"   plain  :disabled="Status(val.Status).disabled">{{ Status(val.Status).text }}</el-button> 
                          
                         
                    </el-card>
                    <el-card style="width: 100%" shadow="never"   v-else>
                      <div class="name" style="color: #9F9F9F;">此時段沒有醫師看診</div>
                    </el-card>                  
                </div>
                  
            </div>
            <div class="Scheduling-text">
                <div class="title">晚診<span>18:00~21:30</span></div>
                <div class="Scheduling-text-ul">
                    <el-card style="width: 100%" shadow="never"  v-if="tabledata.filter((item) => item.Apn == 3).length > 0"  v-for="val in tabledata.filter((item) => item.Apn == 3)" :key="val.DoctorName">
                            <div class="text-BasicInformation">
                                    <div class="text-primary">{{ val.ClinicName }} 診</div>
                                    <div class="name">{{ val.DoctorName }}</div>
                            </div>
                            <el-button  :type="Status(val.Status).type"  class="float-right text-primary"  @click="goOutpatientVerify(val)"   plain  :disabled="Status(val.Status).disabled">{{ Status(val.Status).text }}</el-button> 
                          
                         
                    </el-card>
                    <el-card style="width: 100%" shadow="never"  v-else>
                      <div class="name" style="color: #9F9F9F;">此時段沒有醫師看診</div>
                    </el-card>
                  
                </div>
                  
            </div>
            
     
            
        </div>
      
    
        <el-empty class="emptyView-date" v-if="emptyView" description="本日沒有醫師看診"   :image="$imgNotFound"/>

</template>
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { parseTime } from '@/utils/index.js';
import useDate from '@/utils/date.js';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';
import { GetClinicList } from '@/api/lineUser';
import { useRouter } from 'vue-router';
import svgLoading from '@/composable/svgLoading.js';
import { ElLoading } from 'element-plus'
const router = useRouter();

const { GetDateWeek, GetDateYYYYMMDD } = useDate();
const emptyView = ref(false);
const nextWeekDates = ref([]); // 儲存未來一週的日期
const ListWeekDates = ref([]);
const valueDate = ref(''); // 綁定 el-segmented 的 v-model
let Statsloading = ref(false);
const tabledata = ref([]);
const today = ref(GetDateYYYYMMDD(new Date()));


const getNextWeekDates = (currentDate = new Date()) => {
  const list = []; // 儲存日期與星期的陣列
  const dayOfWeek = currentDate.getDay() || 7; // 取得今天是星期幾（星期日視為 7）
  const startOfWeek = new Date(currentDate); // 複製當前日期物件
  startOfWeek.setDate(currentDate.getDate() - (dayOfWeek - 1)); // 設定為本周的週一

  for (let i = 0; i < 6; i++) {
    const date = new Date(startOfWeek); // 複製週一日期物件
    date.setDate(startOfWeek.getDate() + i); // 從週一開始依序加上天數

    // 組合成所需格式的物件
    list.push({
      label: date, // 日期
      value: date,
      disabled: Date.parse(date) < Date.parse(GetDateYYYYMMDD(new Date())) && Date.parse(date) !== Date.parse(GetDateYYYYMMDD(new Date())) // 判斷是否為過去日期，但排除今天
    });
  }
  return list;
};






onMounted(() => {
  nextWeekDates.value = getNextWeekDates();
  ListWeekDates.value = nextWeekDates.value.map(item => item.label);


  // 預設 value 為今天的日期對應值
  const todayItem = nextWeekDates.value.find(item => GetDateYYYYMMDD(item.label) === today.value);
  valueDate.value = todayItem ? todayItem.label : ''; // 設定為今天的日期文字
});


const confirm = (date)=>{
    Statsloading.value = true;
api(GetDateYYYYMMDD(date));
}
const updateWeekDates = (startDate) => {
  const newDates = getNextWeekDates(startDate); // 使用已有的日期生成函數
  nextWeekDates.value = newDates;
  ListWeekDates.value = newDates.map(item => item.label);
};

const showNextWeekDisabled = ref(false);
const showPreviousWeekDisabled = ref(true);
// 點擊按鈕顯示下一週的日期
const showNextWeek = () => {
  const nextWeekStartDate = new Date(today.value);
  nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7); // 移動到下一週的開始日期

  // 限制未來日期最多只能到 1 個月後
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);



  if (nextWeekStartDate > maxDate) {
    return; // 超過範圍則不更新
  }

  today.value = GetDateYYYYMMDD(nextWeekStartDate); // 更新 `today`
  updateWeekDates(nextWeekStartDate); // 更新週日期列表

  // 確保選到最近的有效日期（包含今天）
  const validDate = ListWeekDates.value.find(date => Date.parse(date) >= Date.parse(GetDateYYYYMMDD(new Date())));
  valueDate.value = validDate || ListWeekDates.value[0]; // 如果沒有有效日期，預設為週一
  api(GetDateYYYYMMDD(valueDate.value));

};

const showPreviousWeek = () => {
  const previousWeekStartDate = new Date(today.value);
  previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7); // 移動到上一週的開始日期

  // 限制不能回到過去的時間，但不包括今天
  const currentDate = new Date(); // 當前日期
  const minDate = new Date(GetDateYYYYMMDD(currentDate)); // 設定為當天的起始日期
  minDate.setDate(minDate.getDate() - 1); // 將最小日期設置為昨天



  if (previousWeekStartDate < minDate) {
    return; // 如果上一週開始日期早於昨天，則不進行更新
  }

  today.value = GetDateYYYYMMDD(previousWeekStartDate); // 更新 `today`
  updateWeekDates(previousWeekStartDate); // 更新週日期列表

  // 確保選到最近的有效日期（忽略今天）
  const validDate = ListWeekDates.value.find(date => Date.parse(date) >= Date.parse(GetDateYYYYMMDD(new Date())));
  valueDate.value = validDate || ListWeekDates.value[0]; // 如果沒有有效日期，預設為週一

  api(GetDateYYYYMMDD(valueDate.value));


};

// 下一頁-超過範圍箭頭按鈕不顯示
const canShowNextWeek = computed(() => {
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);

  const nextWeekStartDate = new Date(today.value);
  nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);

  return nextWeekStartDate <= maxDate; // 當下一週日期不超過最大限制(一個月內)時返回 true
});

// 上一頁-超過範圍箭頭按鈕不顯示
const canShowPreviousWeek = computed(() => {
  const currentDate = new Date(); // 當前日期
  const minDate = new Date(GetDateYYYYMMDD(currentDate)); // 當天的起始日期
  minDate.setDate(minDate.getDate() - 1); // 最小日期設定為昨天

  const previousWeekStartDate = new Date(today.value);
  previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7); // 計算上一週的開始日期

  return previousWeekStartDate >= minDate; // 當上一週日期不早於最小限制時返回 true
});







const Status =(item)=>{
    let list = {
        text:null,
        type: "primary",
        disabled:null
    }
if(item == 1){
    list.text = "停掛"
    list.type= "info"
    list.disabled = true
  }else if(item == 2){
    list.text = "額滿"
    list.type= "danger"
    list.disabled = true

  }else if(item == 3){
    list.text = "逾時"
    list.type= "info"
    list.disabled = true

  }else if(item == 4){
    list.text = "停診"
    list.type= "danger"
    list.disabled = true
  }else{
    list.text = "掛號"
    list.type= "primary"
    list.disabled = false
  }
  return list

}

const goOutpatientVerify = (val) => {
    console.log(val);
  const show = {
    ClinicDate: val.ClinicDate,//看診日期
    Apn:val.Apn,
    DivisionName: val.DivisionName,//科別名稱
    DivisionCode:val.DivisionCode,
    Campus:"聯新國際醫院",
    ClinicName:val.ClinicName, //診間名稱
    ClinicCode:val.ClinicCode,
    DoctorName:val.DoctorName, //醫生名稱
    DoctorCode:val.DoctorCode
  } 


  router.push({
    path: '/line/Outpatient/verify',
    state: { plan: JSON.stringify(show) }, // 將物件轉成字串
  });

};

// const Loading = (text)=>{
//   const oldValue =  text;
//   let run = ref(false);

// watch(text, (newValue, oldValue)=>{
//   run.value = newValue !== oldValue
//   console.log(newValue, "oldValue");
//   console.log(oldValue, "oldValue");
//   console.log(run.value, "run");
//   });
// return run.value

// }

const api = (date) => {
  Statsloading.value = ElLoading.service({
    lock: false,
    svg:svgLoading,
    text: 'loading',
    background: 'transparent',
  })


  const paramsList = {
    Date: date,
  };

  GetClinicList(paramsList)
    .then((res) => {
      const { Code, Data } = res;
      // console.log(res, '2.1 門診-查診間清單');
  
    
      if (Code == '0') {
   
        tabledata.value = Data.List ? Data.List : [];

        if(tabledata.value.length > 0){
          emptyView.value = false
        }else{
          emptyView.value = true
        }
        
      }
    })
    .finally(() => {
      Statsloading.value.close()
    });
};

// 動態監控資料變化

api(GetDateYYYYMMDD(valueDate));


const LoadingList =ref([]);
watch(
  tabledata,
  (newValue, oldValue) => {
    // 清空 LoadingList，避免資料累積
    LoadingList.value = [];

    newValue.forEach((item, index) => {
      const oldItem = oldValue[index];

     
        // 比較 DoctorCode，決定是否設定 Loading 狀態

        let isLoading = {
          ...item
        }
        if(oldItem){
          isLoading.Loading = newValue[index] !== oldValue[index]
        }
        LoadingList.value.push(isLoading);

   
    
   
     
      
    });
  },
  { deep: true }
);






// tabledata.value = [
//       {
//         "DivisionCode": "3220",
//         "DivisionName": "骨科",
//         "ClinicDate": "2024-11-26T00:00:00",
//         "Apn": 1,
//         "ClinicCode": "000303",
//         "ClinicName": "303",
//         "DoctorCode": "015275",
//         "DoctorName": "鄭向恆 Mock",
//         "Status": 0
//       },
//       {
//         "DivisionCode": "3220",
//         "DivisionName": "骨科",
//         "ClinicDate": "2024-11-26T00:00:00",
//         "Apn": 1,
//         "ClinicCode": "000307",
//         "ClinicName": "307",
//         "DoctorCode": "000090",
//         "DoctorName": "施秉鋈",
//         "Status": 0
//       },
//       {
//         "DivisionCode": "3220",
//         "DivisionName": "骨科",
//         "ClinicDate": "2024-11-26T00:00:00",
//         "Apn": 3,
//         "ClinicCode": "000307",
//         "ClinicName": "307",
//         "DoctorCode": "013068",
//         "DoctorName": "陳哲裕",
//         "Status": 4
//       },
//       {
//         "DivisionCode": "3220",
//         "DivisionName": "骨科",
//         "ClinicDate": "2024-11-26T00:00:00",
//         "Apn": 2,
//         "ClinicCode": "000309",
//         "ClinicName": "309",
//         "DoctorCode": "000909",
//         "DoctorName": "何京澤",
//         "Status": 0
//       },
//       {
//         "DivisionCode": "3220",
//         "DivisionName": "骨科",
//         "ClinicDate": "2024-11-26T00:00:00",
//         "Apn": 3,
//         "ClinicCode": "000305",
//         "ClinicName": "305",
//         "DoctorCode": "015275",
//         "DoctorName": "鄭向恆",
//         "Status": 0
//       },
//       {
//         "DivisionCode": "3220",
//         "DivisionName": "骨科",
//         "ClinicDate": "2024-11-26T00:00:00",
//         "Apn": 2,
//         "ClinicCode": "000307",
//         "ClinicName": "307",
//         "DoctorCode": "000079",
//         "DoctorName": "黃紹亮",
//         "Status": 0
//       }
//     ]


</script>

<style lang="scss" scoped>
.btn-arrow{
  &.el-button.is-link {
    height: 44px;
    width: 44px;
    &.is-disabled{
      color: transparent;
      ::v-deep{
      &:hover, &:focus, &:active{
      .el-icon svg{
        path{
          fill:transparent;
        }
      }
    } 
    }
    }
    ::v-deep{
      &:hover, &:focus, &:active{
      .el-icon svg{
        path{
          fill:#008cd6;
        }
      }
    } 
    }
 
    .el-icon svg {
          width: 17px;
        }
  

}
}
.container-date {
    margin-bottom: 12px;
    &-select{
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #008CD6;
        font-size: 17px;
        font-weight: 700;
        margin-bottom: 10px;
        font-family: "Roboto", "Noto Sans TC", Arial,  sans-serif;      
        .el-icon{
          width: 17px;
          height: 17px;
          svg {
              height: 17px;
               width: 17px;
          }
        }
       
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
.Scheduling-text-ul {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    font-size: 16px;
    > li {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        font-family: "Roboto", "Noto Sans TC", Arial,  sans-serif;    
        line-height: 1.8;
        font-weight: 700;
        >span{
          font-weight: 400;
          font-size: 15px;
        }
    }
}
.style-color-today{
background: #008CD6;
}
.btn{
    min-height: 54px;
    font-size: 16px;
    line-height: 1.2;
    display: flex;
    align-items: center;
    justify-content: center;
}


.el-empty{
    height:67vh;
    background: #f5f5f5;
    margin-left: -16px;
    margin-right: -16px;
    position: relative;
  //   &:before {
  //         content: "";
  //         position: absolute;
  //         bottom: 0;
  //         left: 0;
  //         width: 100%;
  //         height: 100%;
  //         transform: translateY(100%);
  //         z-index: 0;
  //         background: #f5f5f5;
  //         pointer-events: none;
  //  }
    p {
    color: #9F9F9F;
    font-size: 16px;

   }
  }
::v-deep{

    .el-card__body{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        min-height: 50px;
        .el-button{
            padding: 8px 21px;
        }
    }
    .el-segmented{
        background: transparent;
        --el-segmented-color: var(--el-text-color-regular);
    --el-segmented-bg-color:  var(--el-color-primary);
    --el-segmented-item-selected-color: var(--el-color-white);
    --el-segmented-item-selected-bg-color: var(--el-color-primary);
    --el-segmented-item-selected-disabled-bg-color:#BCBCBC;
    --el-segmented-item-hover-color: var(--el-text-color-regular);
    --el-segmented-item-hover-bg-color: #CAEDFF;
    --el-segmented-item-active-bg-color: #CAEDFF;
    --el-segmented-item-disabled-color: #BCBCBC;
    }
    .el-segmented__item{
      background: #CAEDFF;
    }
    label.el-segmented__item.is-disabled {
        background-color: #BCBCBC;
        color: #fff;
    }
    .el-segmented__group {   
        width: 100%;
        column-gap: 5px;
    }


}



</style>
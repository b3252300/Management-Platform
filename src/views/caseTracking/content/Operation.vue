<template>
<div class="container-Operation-header">收案日期 {{ Data.CaseDate ? GetDateYYYYMMDD(Data.CaseDate) : "" }}</div>

<div class="container-Operation">
  <div class="grid" style="--bs-gap-column: 40px; --bs-gap-row:10px;">
    <div class="container-Operation-card g-col-12 g-col-md-3" v-for="item in showData(props.Data)" :key="item.Title">
      <div class="title">{{ item.Title }}</div>
      <div class="date">{{ item.Date }}</div>
    </div>
  </div>
</div>

</template>

<script setup>
import { reactive, onMounted } from 'vue';
import useDate from '@/utils/date';
// const { GetDateYYYYMMDD } = useDate();
import moment from "moment";
const GetDateYYYYMMDD = (date) => {
    if (!date) return ""; // 如果 date 無效，回傳空字串
    const DateText = moment(date).format("YYYY/MM/DD");
    return DateText;
};
const props = defineProps({
  Data: {
    type: Object,
    default: {},
  },
});

const tableData = reactive({
  AdmissionDate: "", // 入院日期
  DischargeDate: "", // 出院日期
  OprDate: "", // 手術日期
  StayLength: "", // 住院天數
  OprName: "", // 手術項目
  OprSite: "", // 手術部位
  BloodLoss: "", // 術中 blood loss
  BloodProduct: "", // 術後輸血
  RemoveFoleyDate: "", // 移除 Foley
  RemoveHvDate: "", // 移除 H/V
  RemoveHvFirstDay: "", // 術後 H/V 第一天
  RemoveHvTotal: "", // 術後 H/V 總量
  ConsultantWithRehabilitationDate: "", // 會診復健治療科
  ConsultantWithTraditionChineseDate: "", // 會診中醫科
});

const show = (isTitle, val) => {
  let list = {
    Title: isTitle,
    Date: val
  };

  return list;
};

const text = (isTitle, val) => {
 
  let list = {
    Title: isTitle,
    Date: val ? val : ""
  };
  return list;
};


const showData = (Data) => {
  const list = {
    AdmissionDate: show("入院日期", NDate(Data.AdmissionDate)),
    DischargeDate: show("出院日期", NDate(Data.DischargeDate)),
    OprDate: show("手術日期", NDate(Data.OprDate)),
    StayLength: text("住院天數", Nvalue(Data.StayLength)),
    OprName: text("手術項目", Nvalue(Data.OprName)),
    OprSite: text("手術部位", Nvalue(Data.OprSite)),
    BloodLoss: text("術中blood loss", Nvalue(Data.BloodLoss)),
    BloodProduct: text("術後輸血", Nvalue(Data.BloodProduct)),
    RemoveFoleyDate: show("移除Foley", Data.RemoveFoleyDate),
    RemoveHvDate: text("移除H/V", Nvalue(Data.RemoveHvDate)),
    RemoveHvFirstDay: text("術後H/V第一天", Nvalue(Data.RemoveHvFirstDay)),
    RemoveHvTotal: text("術後H/V總量", Nvalue(Data.RemoveHvTotal)),
    ConsultantWithRehabilitationDate: show("會診復健科日期", NDate(Data.ConsultantWithRehabilitationDate)),
    ConsultantWithTraditionChineseDate: show("會診中醫科日期", NDate(Data.ConsultantWithTraditionChineseDate)),
  };
  return list;
};

function Nvalue(item){
   return item !== "" ? item : "N"
}
function NDate(item){
   return item !== null ? GetDateYYYYMMDD(item) : "N"
}
</script>
<style lang="scss" scoped>
.container-Operation{
    width: fit-content;
    @media (max-width:767px) {
      width: 100%;
    }
  
    > .grid{
        margin-bottom:10px;
        @media (max-width:767px) {
          --bs-gap-column: 0 !important;
          margin-bottom: 0;
        }
    }
    &-header{
        font-size: 16px;
        padding-bottom: 10px;

        color: #EB4D3D;
        @media (max-width:767px) {
          padding-bottom: 0;
        }
    }
    &-card{
        min-width: 164px;
        min-height: 60px;
        @media (max-width:767px) {
          display: flex;
          min-height: auto;
          justify-content: space-between;
        }
  
        .title{
            color:#9F9F9F ;
            font-size: 15px;
            margin-bottom: 4px;
        }
        .date{
            color: #333;
            font-size: 16px;
            white-space: pre-wrap;
        }
    }
}


</style>
<template>

<div class="container-ObservationValue">
    <el-segmented v-model="ObservationValue" :options="ObservationDate">
        <template #default="{ item }">
            {{ item.label }}
        </template>
    </el-segmented>
  </div>



<card :Data="formIndividual" 
        :LineData="formpush" 
        :Page="ObservationValue" 
        :isDisabled="props.isDisabled"
        @Send="submitForm" />
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import card from  '@/views/caseTracking/content/card/TrackCard.vue'

const props = defineProps({
    isDisabled:{
    type: Boolean,
    default: true,
  },
});
const ObservationValue = ref([]);
const ObservationDate = [
{
    label:"術後1天",
    value:"1"
},
{
    label:"出院後5天",
    value:"2"
},
{
    label:"術後2周",
    value:"3"
},
{
    label:"術後1個月",
    value:"4"
}

]






const formpush = reactive({
    date: null,  //諮詢時間
    method:"LINE@", //關懷方式
    type: null, //推播對象
    woundState:[],
    textarea:"雙膝退化性關節，近2周疼痛難耐，故至本院門診求治，醫師住院手術治療文字超過兩行的話請參考這裡文字超過兩行的話請參考這裡文字超過兩行的話請參考這裡文字超過兩行的話請參考這裡"
});


const formIndividual = ref({
    date: null,  //諮詢時間
    method:"", //關懷方式
    type: null, //返家狀況
    sutures:null,
    woundState:[],
    textarea:null
});

const emit = defineEmits(['Send']);
const submitForm = (val)=>{
  
    emit('Send', val);
}



const form_1_day = ref({
    date: null,  //諮詢時間
    method:"", //關懷方式
    type: null, //返家狀況
    sutures:null,
    woundState:[],
    textarea:"出院後1天"
});

const form_5_day = ref({
    date: null,  //諮詢時間
    method:"", //關懷方式
    type: null, //返家狀況
    sutures:null,
    woundState:[],
    textarea:"出院後5天"
});

const form_Weeks = reactive({
    date: null,  //諮詢時間
    method:"", //關懷方式
    type: null, //返家狀況
    sutures:null,
    woundState:[],
    textarea:"出院2周"
});




</script>
<style lang="scss" scoped>
::v-deep{
.el-select__wrapper.is-disabled .el-select__selected-item {
    color: #333;
}
.el-radio{
        margin-right: 20px;
}
.el-form-item--default {
            margin-bottom: 10px;
}
textarea.el-textarea__inner {
            padding: 9px 16px;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: var(--el-checkbox-checked-bg-color);
    border-color: var(--el-checkbox-checked-input-border-color);
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner:after {
    border-color: #fff;
}
.el-checkbox__input.is-checked.is-disabled+.el-checkbox__label {
    color: var(--el-checkbox-checked-text-color);
}
.el-radio-group {
    gap: inherit;
}
.el-radio__input.is-disabled.is-checked .el-radio__inner:after {


    background-color: #ffffff;
}
.el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
   
}




}
.container-ObservationValue{ 
    margin-bottom: 22px;
    ::v-deep{
        .el-segmented  {    
            font-family: "Roboto", "Noto Sans TC", Arial,  sans-serif;      
            border-radius: 100px;
            --el-segmented-bg-color: transparent;
            --el-segmented-item-selected-color: var(--el-text-color-primary);
            --el-segmented-item-selected-bg-color: #008CD6;
            --el-border-radius-base: 14px;
            --el-segmented-color:#303133;
            --el-segmented-item-selected-disabled-bg-color: var(--el-color-primary-light-5);
            --el-segmented-item-hover-color: #fff;
            --el-segmented-item-hover-bg-color: var( --el-color-primary);
            --el-segmented-item-active-bg-color: var( --el-color-primary);
            --el-segmented-item-disabled-color: var(--el-text-color-placeholder);
            
        }  
        .el-segmented__item{
            background: #EDEDED;
        }
        .el-segmented__item-label{
            font-weight: 500;
        }
        .el-segmented__item.is-selected, .el-segmented__item.is-selected.is-disabled {
    color: var(--el-segmented-item-hover-color);
}
    }

}

</style>
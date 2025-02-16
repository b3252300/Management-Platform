<template>


<el-descriptions class="Basicinformation style_mobile_lg" :column="6">
    <el-descriptions-item>{{ Data.Name }}</el-descriptions-item>
    <el-descriptions-item>{{ Data.IdNo }}</el-descriptions-item>
    <el-descriptions-item class="d-none">{{ Data.BirthDate ? GetDateYYYYMMDD(Data.BirthDate) : "" }}</el-descriptions-item>
    <el-descriptions-item>{{ Data.Age }}</el-descriptions-item>
    <el-descriptions-item>
        <div  style="min-width: 106px;">{{  Data.Phone }}</div>
        
    </el-descriptions-item>    
    <el-descriptions-item label="病史 :">{{ Data.History }}</el-descriptions-item>     
</el-descriptions>  

    <el-collapse class="container-collapse style_mobile" v-model="activeNames" @change="handleChange">
      <el-collapse-item :title="Data.Name + ' ' + Data.IdNo" name="1" :icon="ArrowDownBold" >
        <el-descriptions class="Basicinformation" :column="4">
        <el-descriptions-item class="d-none">{{ GetDateYYYYMMDD(Data.BirthDate) }}</el-descriptions-item>
        <el-descriptions-item>{{ Data.Age }}</el-descriptions-item>
        <el-descriptions-item><div  style="min-width: 106px;">{{ Data.Phone == 0 ? "" : Data.Phone }}</div></el-descriptions-item>    
        <el-descriptions-item label="病史 :">{{ Data.History }}</el-descriptions-item>     
        </el-descriptions>  

      </el-collapse-item>
</el-collapse>      

</template>  


<script setup>

import { reactive, ref } from 'vue';
import { ArrowDownBold } from '@element-plus/icons-vue'
import useDate  from '@/utils/date';
const { GetDateYYYYMMDD } = useDate();

const props = defineProps({
    Data:{
        type: Object,
         default: {},
    },
});

const title = ref("");
title.value = props.Data.Name + " " + props.Data.IdNo;
</script>
<style lang="scss" scoped>
.el-collapse {

--el-collapse-border-color: transparent;
} 
::v-deep{
  
.el-collapse-item__wrap{

}
.el-collapse-item__header {
    font-size: 18px;
    line-height: 1.6;
    font-weight: 500;
    font-family: var(--el-font-family);
    padding-left: 44px;

    .el-collapse-item__arrow{
        margin-left: 8px;
    }
}  
.el-collapse-item__arrow.is-active {
    transform: none;
}  
.el-descriptions__body .el-descriptions__table .el-descriptions__cell {
    display: inline-flex;

}
.el-collapse-item__content{
    padding-bottom:0;
}
}



.Basicinformation{
    border: solid #DCDFE6 thin;
    display: flex;
    align-items: center;
    padding:6px 16px;
    width: 100%;
    @media screen and (max-width:767px){
        padding:8px 10px;
    }
::v-deep{
 
    .el-descriptions__cell{
        font-size: 18px;
        line-height: 1.6;
        @media screen and (max-width:767px){
        font-size: 15px;
         }
    }
    .el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell {
            padding-bottom: 0;
            line-height: 1.4;
        }
    .el-descriptions__label {
            white-space: nowrap;
    }
    table.el-descriptions__table td {
            padding-right: 20px;
            @media screen and (max-width:767px){
                padding-right: 12px;
         }
    }
}
}

</style>
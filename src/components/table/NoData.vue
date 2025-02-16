<template>
<div class="NoDataImg">
    <el-image class="NoDataImg_img"  :src="NoDataImg"></el-image>
              No Data           
 </div>


</template>
<script setup>
import NoDataImg from '@/assets/imgs/nodata.svg';

</script>
<style lang="scss" scoped>
.NoDataImg{
    display: flex;
    flex-direction: column; 
    align-items: center; 
    justify-content: center;
    padding: 1rem;
    &_img{
        width: 197px;
        height: 190px;

    }
}


</style>
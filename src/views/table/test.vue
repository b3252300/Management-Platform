<template>
    <div>

      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        :row-class-name="tableRowClassName"
        border
        style="width: 100%; margin-top: 20px">
        <el-table-column prop="StationCode" label="Ward" width="180" />
        <el-table-column prop="RequestDate" label="Request Date" />
        <el-table-column label="Pain Assist" align="center">
           <el-table-column prop="Count" label="Count" width="120" />
           <el-table-column prop="NotificationSent" label="Notification Sent" width="120" />
           <el-table-column prop="Action15mins" label="Action time > 15mins" width="120" />
           <el-table-column prop="Averagetime" label="Average time" width="120" />
        </el-table-column>
        <el-table-column label="Drip Issue" align="center">
           <el-table-column prop="Count" label="Count" width="120" />
           <el-table-column prop="NotificationSent" label="Notification Sent" width="120" />
           <el-table-column prop="Action15mins" label="Action time > 15mins" width="120" />
           <el-table-column prop="Averagetime" label="Average time" width="120" />
        </el-table-column>
      </el-table>
    </div>
    <div class="mb-4">
    <el-button>Default</el-button>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    <el-button type="info">Info</el-button>
    <el-button type="warning">Warning</el-button>
    <el-button type="danger">Danger</el-button>
  </div>
  </template>
  
<script  setup>
import { ref } from 'vue';
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2];
    } else if (columnIndex === 1) {
      return [0, 0];
    }
  }
};
const tableData = ref([]);
tableData.value = [
  {
    StationCode: 'W6A',
    RequestDate: '2024-06-20T16:19:38.403',
    Count: '324',
    NotificationSent: '1.9',
    Action15mins: 9,
    Averagetime:0,
    Total:100
  },
  {
    StationCode: 'W6A',
    RequestDate: '2024-06-20T16:19:38.403',
    Count: '324',
    NotificationSent: '1.9',
    Action15mins: 9,
    Averagetime:0,
    Total:100
  },
  {
    StationCode: 'W6A',
    RequestDate: '2024-06-20T16:19:38.403',
    Count: '324',
    NotificationSent: '1.9',
    Action15mins: 9,
    Averagetime:0,
    Total:100
  },
  {
    StationCode: 'W8A',
    RequestDate: '2024-06-20T16:19:38.403',
    Count: '324',
    NotificationSent: '1.9',
    Action15mins: 9,
    Averagetime:0,
    Total:100
  },
  {
    StationCode: 'W6A',
    RequestDate: '2024-06-20T16:19:38.403',
    Count: '324',
    NotificationSent: '1.9',
    Action15mins: 9,
    Averagetime:0,
    Total:100
  },
  {
    StationCode: 'W7A',
    RequestDate: '2024-06-20T16:19:38.403',
    Count: '324',
    NotificationSent: '1.9',
    Action15mins: 9,
    Averagetime:0,
    Total:100
  },
  {
    StationCode: 'W6A',
    RequestDate: '2024-06-20T16:19:38.403',
    Count: '324',
    NotificationSent: '1.9',
    Action15mins: 9,
    Averagetime:0,
    Total:100
  },
  
];

tableData.value.sort((a, b) => a.StationCode.localeCompare(b.StationCode));
// console.log(tableData.value);

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 檢查是否是第一列的 StationCode
  if (columnIndex === 0) {
    // 如果是第一行或者當前行的 StationCode 與上一行不相同
 
    if (rowIndex === 0 || row.StationCode !== tableData.value[rowIndex - 1].StationCode) {
      // 計算相同 StationCode 的數量
      let num = 1;
      for (let i = rowIndex + 1; i < tableData.value.length; i++) {
        if (tableData.value[i].StationCode === row.StationCode) {
            num++;
        } else {
          break; // 遇到不同的 StationCode 就停止
        }
      }
      return {
        rowspan: num, // 設定合併的行數
        colspan: 1, // 只合併一列
      };
    } else {
      // 當前儲存格不顯示
      return {
        rowspan: 0,
        colspan: 0,
      };
    }
  }
  // 對於其他列，默認不合併
  return {
    rowspan: 1,
    colspan: 1,
  };
};


const tableRowClassName = ({row, rowIndex} ) => {
//    const data = row.map((item)=>item);
const data = [];
// data = row;

data.push(row);

console.log(row[0]);

    // return Object.keys(row).includes("Total") ? 'cell_tota' : '';


    
  // if (rowIndex === 1) {
  //   return 'warning-row'
  // } else if (rowIndex === 3) {
  //   return 'success-row'
  // }
  // return ''
}


  </script>
<style lang="scss" scoped>


</style>
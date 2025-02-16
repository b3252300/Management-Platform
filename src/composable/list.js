import { ref, reactive,  watch } from 'vue';

export default function listData() {
    const options = ref([
        {
            label:"麻醉",
            value:"1",
            isDisabled:false
        },{
            label:"復健",
            value:"2",
            isDisabled:false
        },{
            label:"營養",
            value:"3",
            isDisabled:false
        },
        {
            label:"個管師",
            value:"4",
            isDisabled:false
        },
    
    ]);

    const ObservationDate = [
        {
            label:"術後一天",
            value:"1"
        },
        {
            label:"出院後五天",
            value:"2"
        },
        {
            label:"出院後兩周",
            value:"3"
        },
        {
            label:"術後一個月",
            value:"4"
        }
        
        ]

const ResetOptions =()=>{
    options.value = [
        {
            label:"麻醉",
            value:"1",
            isDisabled:false
        },{
            label:"復健",
            value:"2",
            isDisabled:false
        },{
            label:"營養",
            value:"3",
            isDisabled:false
        },
        {
            label:"個管師",
            value:"4",
            isDisabled:false
        },
    
    ]
}

    // const LinePushList = reactive(
    //     [{
    //         "title":"麻醉諮詢：",
    //         "date": "2024-04-26T00:00:00",
    //         "done":true
            
    //     },
    //     {
    //         "title":"營養諮詢：",
    //         "date": "2024-04-26T00:00:00",
    //         "done":false
            
    //     },
    //     { 
    //         "title":"復健諮詢：",
    //         "date": "2024-04-26T00:00:00",
    //         "done":true
            
    //     },
    //     { 
    //         "title":"個管師諮詢：",
    //         "date": "2024-04-26T00:00:00",
    //         "done":true
            
    //     }
    // ]
    // );
//     const LinePushChecking = reactive(
//     [{
//         "title":"心臟超音波：",
//         "date": "2024-04-26T00:00:00",
//         "done":1
        
//     },
//     {
//         "title":"心電圖：",
//         "date": "2024-04-26T00:00:00",
//         "done":1
        
//     },
//     { 
//         "title":"抽血檢驗：",
//         "date": "2024-04-26T00:00:00",
//         "done":1
        
//     }
// ]
// );
const caselist_card = [
    {
      label: 'yyyy/mm/dd',
      value: '骨科 侯咸仰',
      type:true
    },
    {
      label: 'yyyy/mm/dd',
      value: '骨科 侯咸仰2',
      type:false
    },
    {
      label: 'yyyy/mm/dd',
      value: '骨科 侯咸仰3',
      type:true
    },
    {
      label: 'yyyy/mm/dd',
      value: '骨科 侯咸仰4',
      type:true
    }
  
  ]
  
  


    return { 
        options,
        // LinePushList,
        // LinePushChecking,
        ObservationDate,
        ResetOptions
    };

}
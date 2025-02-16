import { Random } from "mockjs";//導出隨機函數
function GetClinicList(req) {
    //req是一個請求對象，包含: url, type和body屬性
    return {
        "Data": {
            "List": [
                {
                    "DivisionCode": "3220",
                    "DivisionName": "骨科",
                    "ClinicDate": "2024-11-26T00:00:00",
                    "Apn": 1,
                    "ClinicCode": "000303",
                    "ClinicName": "303",
                    "DoctorCode": "015275",
                    "DoctorName": "鄭向恆",
                    "Status": 0
                },
                {
                    "DivisionCode": "3220",
                    "DivisionName": "骨科",
                    "ClinicDate": "2024-11-26T00:00:00",
                    "Apn": 1,
                    "ClinicCode": "000307",
                    "ClinicName": "307",
                    "DoctorCode": "000090",
                    "DoctorName": "施秉鋈",
                    "Status": 0
                },
                {
                    "DivisionCode": "3220",
                    "DivisionName": "骨科",
                    "ClinicDate": "2024-11-26T00:00:00",
                    "Apn": 3,
                    "ClinicCode": "000307",
                    "ClinicName": "307",
                    "DoctorCode": "013068",
                    "DoctorName": "陳哲裕",
                    "Status": 4
                },
                {
                    "DivisionCode": "3220",
                    "DivisionName": "骨科",
                    "ClinicDate": "2024-11-26T00:00:00",
                    "Apn": 2,
                    "ClinicCode": "000309",
                    "ClinicName": "309",
                    "DoctorCode": "000909",
                    "DoctorName": "何京澤",
                    "Status": 0
                },
                {
                    "DivisionCode": "3220",
                    "DivisionName": "骨科",
                    "ClinicDate": "2024-11-26T00:00:00",
                    "Apn": 3,
                    "ClinicCode": "000305",
                    "ClinicName": "305",
                    "DoctorCode": "015275",
                    "DoctorName": "鄭向恆",
                    "Status": 0
                },
                {
                    "DivisionCode": "3220",
                    "DivisionName": "骨科",
                    "ClinicDate": "2024-11-26T00:00:00",
                    "Apn": 2,
                    "ClinicCode": "000307",
                    "ClinicName": "307",
                    "DoctorCode": "000079",
                    "DoctorName": "黃紹亮",
                    "Status": 0
                }
            ]
        },
        "Code": "0",
        "ElapsedSeconds": 0.0,
        "Message": "Mock"
    }
}

function QueryReservationList(req) {
    //req是一個請求對象，包含: url, type和body屬性
    return {
        "Data": {
            "List": [
                {
                    "DivisionCode": "3220",
                    "ClinicCode": "000303",
                    "DoctorCode": "015275",
                    "IdNo": "",
                    "PatientName": null,
                    "BirthDate": "",
                    "Location": "門診大樓/3樓",
                    "ViewNumber": 33,
                    "EstimatedTime": "2024-11-26T11:40:00",
                    "Remark": "此診報到時間12:15結束，最晚請於12:15之前向診間進行報到。逾報到截止時間，將無法提供看診服務。\n●預約掛號後未能來院看診時，請於一天前取消掛號。",
                    "DivisionName": "骨科",
                    "ClinicDate": "2024-11-26T00:00:00",
                    "Apn": 1,
                    "ClinicName": "303",
                    "DoctorName": "鄭向恆"
                }
            ]
        },
        "Code": "0",
        "ElapsedSeconds": 0,
        "Message": "",
        "Version": null,
        "ActionId": null
    }
}


export default {
    GetClinicList,
    QueryReservationList
}


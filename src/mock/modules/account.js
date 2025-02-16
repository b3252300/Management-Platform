import { Random } from "mockjs";//導出隨機函數
//get HomePage Data

function AccountPatient(req) {
    //req是一個請求對象，包含: url, type和body屬性
    return {
        "Data": {
            "List": [
                {
                    "RowId": "DNzN8gImQ1uZFf",
                    "Name": "葉大雄",
                    "IdNo": "A123456789",
                    "LineName": "Cheryl🎐",
                    "Phone": "0912345678",
                    "LinePictureUrl": "https://sprofile.line-scdn.net/0hSX5Ms1TvDHcYNCa8ZUxyCGhkDx07RVVlNVtFGH0zUEAgU0wgYVQRFH4xU0YhDEgpMlcTFng1WhMUJ3sRBmLwQx8EUUYkBEgoNlNLkg",
                    "DivisionName": "骨科",
                    "JoinDateTime": "2024-10-20T10:31:09.11",
                    "Status": 1
                }
            ]
        },
        "Code": "0",
        "ElapsedSeconds": 0.0,
        "Message": "Mock",
        "Version": null,
        "ActionId": null
    }
}

export default {
    AccountPatient,
}


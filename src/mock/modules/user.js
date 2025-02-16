import { Random } from "mockjs";//導出隨機函數
//登录
function login(req) {
    //req是一個請求對象，包含: url, type和body屬性
    return {

        Code: "0",
        Data: { 
            Token: 'V7DUCAPv70lV8Xr7Y0gLTODYvJgXLF', 
            FileToken: Random.guid(), 
            DisplayName: Random.cname(),    
         },
         ElapsedSeconds: 0.14,
         Message: "Mock"

    }
}

export default {
    login,
}


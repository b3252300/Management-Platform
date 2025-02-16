function CaseTracking(req) {
    //req是一個請求對象，包含: url, type和body屬性
    return {

        Code: "0",
        Data: [
            {
                date: '2016-05-03 10:30',
                department:"復健科",
                name: 'Tom',   
                ID: 'H123456789',
                address: 'H123456789',
                zip: 'CA 90036',
                state: "有效",
              },
        ],
        ElapsedSeconds: 0.14,
        Message: "Mock"

    }
}

export default {
    CaseTracking,
}

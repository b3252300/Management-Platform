import { Random } from "mockjs";//導出隨機函數
//get HomePage Data
function GetHomeData(req) {
    //req是一個請求對象，包含: url, type和body屬性
    return {

        Code: "0",
        Data: {
            WardItemList: [{ Code: 'W7A', Name: 'Ward 7A' }, { Code: 'W7B', Name: 'Ward 7B' }, { Code: 'W6A', Name: 'Ward 6A' }, { Code: 'W6B', Name: 'Ward 6B' }],
            NurseList: [{ Code: 'W7A', Name: 'Ward 7A' }, { Code: 'W7B', Name: 'Ward 7B' }, { Code: 'W6A', Name: 'Ward 6A' }, { Code: 'W6B', Name: 'Ward 6B' }],
            PatientList: [{ BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: 'Please verify patient leave ward', Important: true, OverTime: true, RequestStatus: 3, },
            { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: '', Important: false, OverTime: true, RequestStatus: 2, },
            { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: 'Please verify patient leave ward', Important: true, OverTime: false, RequestStatus: 1, },
            { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: 'Please verify patient leave ward', Important: false, OverTime: false, RequestStatus: 0, },
            { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: '', Important: false, OverTime: false, RequestStatus: 1, }, { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: 'Please verify patient leave ward', Important: true, OverTime: true, RequestStatus: 3, },
            { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: 'Please verify patient leave ward', Important: false, OverTime: true, RequestStatus: 2, },
            { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: 'Please verify patient leave ward', Important: true, OverTime: false, RequestStatus: 1, },
            { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'DripIssue', Description: 'Please verify patient leave ward', Important: false, OverTime: false, RequestStatus: 0, },
            { BedCode: '701A', BedName: '701A', RequestTime: '29/05/2024 16:18', PatientFullName: 'Himani Nandana Neha Nupur Ruchika Seema Shivani Mehak Surbhi', RequestCode: 'critical', Description: '', Important: false, OverTime: false, RequestStatus: 1, }],
            BulletinList: [
                {
                    Time: "29/05/2024 10:18",
                    Content: "Please store some water as water supply will be suspended during 13:00~16:00. We apologize for the inconvenience.Please store some water as water supply will be suspended during 13:00~16:00. We apologize for the inconvenience.",
                    FileRowId: "aafukhss464",
                    FileName: "file.pdf",
                    FileType: 'pdf'
                },
                {
                    Time: "2024/06/11",
                    Content: "only English",
                    FileRowId: "sa12df4556",
                    FileName: "file.png",
                    FileType: 'png'
                },
                {
                    Time: "2024/06/11",
                    Content: "only English",
                    FileRowId: "sa12df4556",
                    FileName: "file.png",
                    FileType: 'png'
                },
            ],

        },
        ElapsedSeconds: 0.14,
        Message: "Mock"

    }
}

export default {
    GetHomeData,
}


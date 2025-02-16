import moment from 'moment';

export default function useDate() {
    const GetNowDateYYYYMMDD = () => {
        const now = moment().format();
        const DateText = GetDateYYYYMMDD(now);
        return DateText;
    };
    const GetNowDateDDMMYYYY = () => {
        const now = moment().format();
        const DateText = GetDateDDMMYYYY(now);
        return DateText;
    };

    const  GetNowDateTimeYYYYMMDDHHmm= () => {
        const now = moment().format();
        const DateText = GetDateTimeYYYYMMDDHHmm(now);
        return DateText;
    };

    const  GetNowDateTimeDDMMYYYYHHmm= () => {
        const now = moment().format();
        const DateText = GetDateTimeDDMMYYYYHHmm(now);
        return DateText;
    };

    const GetDateTimeDDMMYYYYHHmm =  (date) => {
        const DateText = moment(date).format('DD/MM/yyyy HH:mm')
        return DateText;
    };

    const GetDateYYYYMMDD =  (date) => {
        const DateText = moment(date).format('yyyy/MM/DD')
        return DateText;
    };

    const GetDateTimeYYYYMMDDHHmm =  (date) => {
        const DateText = moment(date).format('yyyy/MM/DD HH:mm')
        return DateText;
    };
    const GetDateTimeYYYYMMDDHHmmApi =  (date) => {
        const DateText = moment(date).format('yyyy-MM-DD HH:mm')
        return DateText;
    };
    const GetDateTimeYYYYMMDDApi =  (date) => {
        const DateText = moment(date).format('yyyy-MM-DD')
        return DateText;
    };
    const GetDateDDMMYYYY =  (date) => {
        const DateText = moment(date).format('DD/MM/yyyy')
        return DateText;
    };

    const GetDateTimeHHmmDDMMYYYY =  (date) => {
        const DateText = moment(date).format('HH:mm DD/MM/yyyy')
        return DateText;
    };

    const GetDateTimeDDMMHHmm =  (date) => {
        const DateText = moment(date).format('DD/MM HH:mm')
        return DateText;
    };
    const GetHHmm =  (date) => {
        const DateText = moment(date).format('HH:mm')
        return DateText;
    };
//     dddd：取得完整的星期名稱，例如「星期一」， ddd：取得簡短的星期名稱，例如「週一」, d 取得，例如星期三就是3
    const GetDateWeek= (date) => {
        const DateText = moment(date).format('DD/MM d') // 加入 dddd 取得完整星期名稱
        return DateText
      }


    return {
        GetNowDateYYYYMMDD,
        GetNowDateTimeYYYYMMDDHHmm,
        GetNowDateTimeDDMMYYYYHHmm,
        GetDateTimeDDMMYYYYHHmm,
        GetDateYYYYMMDD,
        GetDateTimeYYYYMMDDHHmm,
        GetDateDDMMYYYY,
        GetDateTimeHHmmDDMMYYYY,
        GetDateTimeDDMMHHmm,
        GetNowDateDDMMYYYY,
        GetDateWeek,
        GetHHmm,
        GetDateTimeYYYYMMDDHHmmApi,
        GetDateTimeYYYYMMDDApi
    };

}
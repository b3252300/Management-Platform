/**
 * 定義本地測試接口，最好與正是接口一致，盡可能減少前後端整合測試階段修改量
 */

//引用mockjs
import Mock from 'mockjs';
//引入模板函數
import user from './modules/user';
import home from './modules/home';
import manage from './modules/manage';
import lineUser from './modules/lineUser';
import account from './modules/account.js';


const { mock } = Mock; // Mock函數
// const appStore = useAppStore();

//使用攔截規則攔截命中的請求
//mock(url, post/get, 返回的數據/函數(有return))
//Login
// mock(import.meta.env.VITE_API_ROOT + '/api/webapp/Management/1/Login/Validation', 'post', user.login);

//Home
// mock(import.meta.env.VITE_API_ROOT + '/api/WebApp/Management/1/Home/GetHomeData', 'post', home.GetHomeData);
mock(import.meta.env.VITE_API_ROOT + '/api/SecurityKey/Test', 'post', manage.CaseTracking);


//帳號管理
mock(import.meta.env.VITE_API_ROOT + '/api/webapp/Eras/Account/Patient', 'post', account.AccountPatient);


//line
mock(import.meta.env.VITE_API_ROOT + '/api/webapp/Eras/OpdRegister/GetClinicList', 'post', lineUser.GetClinicList);
mock(import.meta.env.VITE_API_ROOT + '/api/webapp/Eras/OpdRegister/QueryReservationList', 'post', lineUser.QueryReservationList);


console.log('mock!!!!!')
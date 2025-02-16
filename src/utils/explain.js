export const axiosConfiguration = {
  // baseURL: 'https://hccmapi.kangzhiyunyi.cn', // 正式环境环境
  //baseURL: 'http://192.168.26.14/smartward/smartwardwebapidev', // 测试环境
  baseURL: '', // 测试环境

  fileAPI: '/api/File',
  // 即时通讯api

}
export const getBaseUrl = function () {
  // let host = location.host;
  // if (host === "hccmn.kangzhiyunyi.cn" || host === 'testhccmn.kangzhiyunyi.cn') {
  //   // 线上环境（正式/测试）
  //   return process.env.VUE_APP_BASE_API;
  // } else {
  //   // 本地环境
  //   return axiosConfiguration.baseURL;
  // }

  return import.meta.env.VITE_API_ROOT;

  //return axiosConfiguration.baseURL;
}

export const getFileUrl = function () {
  return getBaseUrl() + axiosConfiguration.fileAPI;
}

const Download = (res) => {
    // 將返回的資料轉為 Blob
    console.log(res, "resresresres");
    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]); // 取得 Base64 字串
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
     

    const blob = new Blob([res.data], { type: res.headers['content-type'] });
    
    console.log(blob, "base64Data");



    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;

    // 從 header 提取檔名
    let disposition = res.headers['content-disposition'];
    let fileName = '下載檔案.xlsx'; // 預設檔名

    if (disposition) {
        // 優先處理 filename* (RFC 5987 編碼)
        const fileNameStar = disposition.match(/filename\*\=([^;]+)/);
        if (fileNameStar) {
            fileName = decodeURIComponent(fileNameStar[1].split("''")[1]);
            fileName = decodeURIComponent(fileName); // 解碼多餘的編碼層
        } else {
            // 處理 filename
            const fileNameRegular = disposition.match(/filename\=\"?([^;"]+)\"?/);
            if (fileNameRegular) {
                fileName = decodeURIComponent(fileNameRegular[1]);
            }
        }
    }

    // 設置下載檔名
    link.download = fileName;

    // 觸發下載
    document.body.appendChild(link);
    link.click();

    // 清除 URL 物件
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
};

export default function DownloadFunction() {
    return {
        Download
    };
}

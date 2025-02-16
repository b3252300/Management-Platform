const UploadView = (res)=>{ 
    console.log("8.1 取檔案", res.data);
      const blob = new Blob([res.data], { type: res.headers['content-type'] });
 
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL);
}

export default function UploadFunction(){
    return {
        UploadView
    }
}

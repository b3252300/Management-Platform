export default function mobilefunction() {
    const isMobileDevice = ()=> {
        let mobileDevices = ['Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone']
        for (var i = 0; i < mobileDevices.length; i++) {
            if (navigator.userAgent.match(mobileDevices[i])) {
              //console.log("isMobileDevice: match " + mobileDevices[i]);
              return true;
            }
        }
        return false
      }
      
    return {
        isMobileDevice
    }
}
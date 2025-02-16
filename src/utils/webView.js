import HybridWebView from '@/utils/HybridWebView.js';
import { ref } from 'vue';
import { useAppStore } from '@/store'


export default function useWebView() {
    let embeddedWebViewFrameMode = ref(false);
    const appStore = useAppStore()

    const EnabledEmbeddedWebViewFrameMode = () => {
        // console.log("set embeddedWebViewFrameMode true")
        embeddedWebViewFrameMode.value = 'true';
        appStore.SET_FrameMode(embeddedWebViewFrameMode.value);
        console.log("set embeddedWebViewFrameMode true")
    }

    const EnabledEmbeddedWebView = (byUrl) => {
        console.log(appStore.embeddedWebViewFrameMode)

        if (appStore.embeddedWebViewFrameMode == 'true') {
            console.log("get embeddedWebViewFrameMode true")

            //呼叫表單獨立開啟頁面
            var jsonObject = {
                Action: "OpenEmbeddedWebView",
                Url: byUrl
            }
            var jsonMessage = JSON.stringify(jsonObject);
            HybridWebView.SendRawMessageToDotNet(jsonMessage);
        } else {
            console.log("get embeddedWebViewFrameMode false")

            window.open(byUrl);
        }
    }


    return {
        // initWebView,
        EnabledEmbeddedWebViewFrameMode,
        EnabledEmbeddedWebView
    }
}
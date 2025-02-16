import { ref } from 'vue';
// import router from "@/router";
import { login } from '@/api/user';
import { useUserStore, useAppStore } from '@/store';
import { useRouter, useRoute } from 'vue-router'



export default function LoginFunction() {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const accountErrorText = ref('');
    const passwordErrorText = ref('');
    const toastRef = ref(null);
    const router = useRouter();
    const route = useRoute();

    function gotoHome() {
        //router.push('/');
        window.history.back();
    }

    // onMounted(() => {
    //     toastRef.value = document.querySelector(".toast");
    //   })
    const useLogin = (params) => {
        login(params).then((res) => {
            const { Code, Data, Message } = res;
            console.log(res);

            if (Code === '0') {

                const { Token, FileToken, DisplayName } = Data;
                // console.log(Data, "Data");
                userStore.SET_TOKEN(Token);
                userStore.SET_USER_NAME(DisplayName)
                // appStore.SET_ROLE(Role);
                userStore.SET_FILE_TOKEN(FileToken);
                router.push( '/' )
             

          

            } else {
                console.log(Code);
                // if (Code === '1') {
                //     accountErrorText.value = 'Invalid username or password';
                //     passwordErrorText.value = 'Invalid username or password';
                //     // toastRef.value.show({ text: 'Invalid username or password', duration: 2000 });
                // } else if (Code === '2') {
                //     toastRef.value.show({ text: 'No permissions to log in', duration: 2000 });
                // } else if (Code === '3') {
                //     toastRef.value.show({ text: 'account is block', duration: 2000 });
                // } else if (Code === '4') {
                //     toastRef.value.show({
                //         text: 'you are only allowed to login when this bed is occupied with patient!',
                //         duration: 2000,
                //         closeCallback: gotoHome,
                //     });
                // } else {
                //     toastRef.value.show({
                //         text: 'A system error occurred, please contact the administrator',
                //         duration: 2000,
                //         closeCallback: gotoHome,
                //     });
                // }
            }
        }).finally(() => {

        });

    }


    return { accountErrorText, passwordErrorText, toastRef, useLogin }
}
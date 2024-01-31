import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfoData = reactive({
        username: '',
        sex: '',
        nickname: '',
        _id: '',
    });
    function userInfoActions() {
        console.log(userInfoData);
    }
    return { userInfoData, userInfoActions }
}, {
    persist: {
        storage: localStorage,
    }
})
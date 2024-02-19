import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', () => {
    const userInfoData = reactive({
        username: '',
        sex: '',
        nickname: '',
        email: '',
        phone: '',
        birthday: '',
        address: '',
        _id: '',
        avatar: '',
    });
    return { userInfoData }
}, {
    persist: {
        storage: localStorage,
    }
})
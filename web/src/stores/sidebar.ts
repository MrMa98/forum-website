import { defineStore } from 'pinia'

export const useSidebarInfo = defineStore('sidebarInfo', () => {

    /** 话题id */
    const sidebarKey = ref<string[]>(['post']);
    /** 左侧菜单栏id */
    const post_id = ref<string>('');

    /** 重置 */
    const postIdReset = ()=>{
        post_id.value = '';
    }

    return { sidebarKey, post_id, postIdReset}
},{
    persist: {
        storage: sessionStorage,
    }
})
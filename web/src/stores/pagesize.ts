import { defineStore } from "pinia";

export const usePageSizeData =  defineStore('pageSizeData', ()=>{
    const pageNumber = ref<number>(1);
    const pageSize = ref<number>(10);

    const reset = ()=>{
        pageNumber.value = 1;
        pageSize.value = 10;
    }

    return { pageNumber, pageSize, reset}
},{
    persist: {
        storage: sessionStorage
    }
})
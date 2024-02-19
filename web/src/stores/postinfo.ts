import type { PostInfo } from '@/untils/type';
import { defineStore } from 'pinia'

export const usePostInfoData = defineStore('postInfo', () => {
    const postInfoData = reactive<PostInfo>({
        create_at: '',
        dislikedBy: [],
        isDelete: false,
        likedBy: [],
        post_caption: '',
        post_text: '',
        user_id: '',
        __v: 0,
        _id: '',
        post_type: [],
    });

    const reset = () => {
        Object.assign(postInfoData, {
            create_at: '',
            dislikedBy: [],
            isDelete: false,
            likedBy: [],
            post_caption: '',
            post_text: '',
            user_id: '',
            __v: 0,
            _id: '',
            post_type: [],
        });
    }

    return { postInfoData, reset }
})
/** 用户信息 */
export interface Users {
    username: string,
    password?: string,
    sex: 'man' | 'woman',
    email: string,
    phone: number | null,
    address: string,
    birthday: Date | null | string,
    nickname: string,
    _id?: string,
}

export interface UserInfoStore {
    username: string,
    sex: string,
    nickname: string,
    email: string,
    phone: string,
    birthday: string,
    address: string,
    _id: string,
}

/** 账号密码 */
export interface Login {
    username: string,
    password: string,
}

export interface AddPostInfo {
    user_id: string,
    post_caption: string,
    post_text: string,
    post_type: string[],
}

export interface UpdatePostInfo {
    post_id: string,
    post_caption: string,
    post_text: string,
    post_type: string[],
}

export interface PostInfo {
    create_at: string,
    dislikedBy: string[],
    isDelete: boolean,
    likedBy: string[],
    post_caption: string,
    post_text: string,
    post_type: string[],
    user_id: string,
    __v: number,
    _id: string,
}

export interface OperationLog {
    _id: string,
    user_id: string,
    post_id: PostInfo,
    operation: 'add' | 'update' | 'delete' | 'recover',
    __v: number,
    operation_at: Date,
}

export interface Post {
    create_at: string,
    dislikedBy: string[],
    isDelete: boolean,
    likedBy: string[],
    post_caption: string,
    post_text: string,
    post_type: string[],
    user_id: {
        nickname: string,
        create_at: Date,
        _id: string,
    },
    __v: number,
    _id: string,
}

export interface GetPostParams {
    current: number,
    pageSize: number,
    gauge: 'author' | 'title' | 'type',
    keywords: string
}

export interface CommentParams {
    post_id: string,
    parent_id: string | null,
    mention_id: string | null,
    comment_text: string,
}


export interface CommentInfo {
    children: CommentChildrenInfo[],
    comment_text: string,
    created_at: Date,
    dislikedBy: string[],
    isDelete: boolean
    likedBy: string[],
    parent_id: string | null,
    post_id: string,
    user_id: {
        nickname: string,
        avatar: string,
        _id: string,
    },
    __v: number,
    _id: string,
}


export interface CommentChildrenInfo {
    comment_text: string,
    created_at: Date,
    dislikedBy: string[],
    isDelete: boolean,
    likedBy: string[],
    mention_id: {
        nickname: string,
        avatar: string,
        _id: string,
    },
    parent_id: string,
    post_id: string,
    user_id: {
        nickname: string,
        _id: string,
    },
    _id: string,
}



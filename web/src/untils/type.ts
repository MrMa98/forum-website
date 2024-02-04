/** 用户信息 */
export interface Users {
    username: string;
    password?: string;
    sex: 'man' | 'woman';
    email: string;
    phone: number | null;
    address: string;
    birthday: Date | null | string;
    nickname: string;
    _id?: string;
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
}

export interface UpdatePostInfo {
    post_id: string,
    post_caption: string,
    post_text: string,
}

export interface PostInfo {
    create_at: string;
    dislikedBy: string[];
    isDelete: boolean;
    likedBy: string[];
    post_caption: string;
    post_text: string;
    user_id: string;
    __v: number;
    _id: string;
  }

  export interface OperationLog {
    _id: string,
    user_id: string,
    post_id: PostInfo,
    operation: 'add' | 'update' | 'delete' | 'recover',
    __v: number,
    operation_at: Date,
}



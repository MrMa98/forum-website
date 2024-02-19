<template>
    <div class="container">
        <div class="topic-show">
            <div class="post">
                <div class="title">
                    {{ postinfo?.post_caption }}
                </div>
                <div class="content" v-html="postinfo?.post_text"></div>
            </div>
        </div>
        <a-drawer :width="666" placement="right" :closable="false" :open="reviewDrawer" @close="onClose"
            style="position: relative;">
            <div class="review">
                <a-collapse v-model:activeKey="activeKey" ghost>
                    <a-collapse-panel :showArrow="false" v-for="commentInfo in commentAllData" :key="commentInfo._id">
                        <template #header>
                            <a-comment>
                                <template #actions>
                                    <span key="comment-basic-like">
                                        <a-tooltip title="喜欢">
                                            <template v-if="action === 'liked'">
                                                <LikeFilled @click.stop="like" />
                                            </template>
                                            <template v-else>
                                                <LikeOutlined @click.stop="like" />
                                            </template>
                                        </a-tooltip>
                                        <span style="padding-left: 8px; cursor: auto">
                                            {{ commentInfo.likedBy.length }}
                                        </span>
                                    </span>
                                    <span key="comment-basic-dislike">
                                        <a-tooltip title="不喜欢">
                                            <template v-if="action === 'disliked'">
                                                <DislikeFilled @click.stop="dislike" />
                                            </template>
                                            <template v-else>
                                                <DislikeOutlined @click.stop="dislike" />
                                            </template>
                                        </a-tooltip>
                                        <span style="padding-left: 8px; cursor: auto">
                                            {{ commentInfo.dislikedBy.length }}
                                        </span>
                                    </span>
                                    <span @click.stop="showDrawer(commentInfo._id)" key="comment-basic-reply-to">回复</span>
                                    <span v-if="commentInfo.children.length" class="comment-basic-expand">—
                                        <span>展开</span>{{
                                            commentInfo.children.length }}条回复</span>
                                </template>
                                <template #author><a>{{ commentInfo.user_id.nickname }}</a></template>
                                <template #avatar>
                                    <a-avatar :src="base64(commentInfo.user_id.avatar)" alt="Han Solo" />
                                </template>
                                <template #content>
                                    <p>
                                        {{ commentInfo.comment_text }}
                                    </p>
                                </template>
                                <template #datetime>
                                    <a-tooltip :title="dayjs(commentInfo.created_at).format('YYYY-MM-DD HH:mm:ss')">
                                        <span>{{ dayjs(commentInfo.created_at).fromNow() }}</span>
                                    </a-tooltip>
                                </template>
                            </a-comment>
                        </template>
                        <div class="children">
                            <a-comment v-for="item in commentInfo.children" :key="item._id">
                                <template #actions>
                                    <span key="comment-basic-like">
                                        <a-tooltip title="喜欢">
                                            <template v-if="action === 'liked'">
                                                <LikeFilled @click="like" />
                                            </template>
                                            <template v-else>
                                                <LikeOutlined @click="like" />
                                            </template>
                                        </a-tooltip>
                                        <span style="padding-left: 8px; cursor: auto">
                                            {{ item.likedBy.length }}
                                        </span>
                                    </span>
                                    <span key="comment-basic-dislike">
                                        <a-tooltip title="不喜欢">
                                            <template v-if="action === 'disliked'">
                                                <DislikeFilled @click="dislike" />
                                            </template>
                                            <template v-else>
                                                <DislikeOutlined @click="dislike" />
                                            </template>
                                        </a-tooltip>
                                        <span style="padding-left: 8px; cursor: auto">
                                            {{ item.dislikedBy.length }}
                                        </span>
                                    </span>
                                    <span @click.stop="showDrawer(commentInfo._id, item.user_id._id)"
                                        key="comment-basic-reply-to">回复</span>
                                </template>
                                <template #author><a>{{ item.user_id.nickname }}</a><span v-if="item.mention_id">
                                        <CaretRightFilled />{{ item.mention_id?.nickname }}
                                    </span></template>
                                <template #avatar>
                                    <a-avatar :src="base64(commentInfo.user_id.avatar)" alt="Han Solo" />
                                </template>
                                <template #content>
                                    <p>
                                        {{ item.comment_text }}
                                    </p>
                                </template>
                                <template #datetime>
                                    <a-tooltip :title="dayjs().format('YYYY-MM-DD HH:mm:ss')">
                                        <span>{{ dayjs(item.created_at).fromNow() }}</span>
                                    </a-tooltip>
                                </template>
                            </a-comment>
                        </div>
                    </a-collapse-panel>
                </a-collapse>
                <a-drawer :height="222" placement="bottom" :closable="false" :open="open" :get-container="false"
                    :style="{ position: 'absolute' }" @close="onClose">
                    <a-mentions v-model:value="commentValue" rows="3" placeholder="You can use @ to ref user here"
                        :options="mentionOptions"></a-mentions>
                    <a-button type="dashed" @click="submit">发布评论</a-button>
                </a-drawer>
            </div>
        </a-drawer>
    </div>
    <a-float-button v-if="!open || !reviewDrawer" shape="square" :description="!open && !reviewDrawer ? '评论' : '添加评论'"
        type="primary" :style="{
            right: '88px',
            bottom: '88px',
            'z-index': 99999999999999,
        }" @click="showDrawer()"></a-float-button>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined, CaretRightFilled } from '@ant-design/icons-vue';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getPostAllById } from '@/service/postInfo';
import type { CommentParams, CommentInfo, Post } from '@/untils/type';
import { addComment, getComment } from '@/service/comment';
import { openNotification } from '@/untils/antvNotification';
const props = defineProps({
    id: {
        type: String,
        default: '',
    }
});
let postinfo = ref<Post>();
dayjs.extend(relativeTime);


const action = ref<string>('');
const commentValue = ref<string>('');
let commentAllData = ref<CommentInfo[]>()!;
let parent_id = ref<string>('');
let mention_id = ref<string>('');

const like = () => {
    action.value = 'liked';
};

const dislike = () => {
    action.value = 'disliked';
};

const activeKey = ref([]);

const open = ref<boolean>(false);

const reviewDrawer = ref<boolean>(false);

const mentionOptions = [
    {
        value: 'afc163',
        label: 'afc163',
    },
    {
        value: 'zombieJ',
        label: 'zombieJ',
    },
    {
        value: 'yesmeck',
        label: 'yesmeck',
    },
];

const showDrawer = (parentId: string = '', commentId: string = '') => {
    mention_id.value = commentId;
    parent_id.value = parentId;

    if (reviewDrawer.value == true) {
        open.value = true;
    } else {
        reviewDrawer.value = true;
    }
};

const onClose = () => {

    if (open.value == false) {
        reviewDrawer.value = false;
    }
    open.value = false;
};

const submit = () => {
    const params: CommentParams = {
        post_id: props.id,
        mention_id: mention_id.value ? mention_id.value : null,
        parent_id: parent_id.value ? parent_id.value : null,
        comment_text: commentValue.value,
    }
    addComment(params).then((res) => {
        const isError = Boolean(res.data);
        openNotification('bottomRight', '', '评论成功', false, isError)
    });
}

watch(activeKey, val => {
    console.log(val);
});

const base64 = (avatar: { data: Iterable<number>; }) => {
    return avatar ? base64ToUrl(avatar.data) : "";
};

const base64ToUrl = (data: Iterable<number>) => {
    const blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
    return URL.createObjectURL(blob);
};


onMounted(() => {
    getPostAllById(props.id).then((res) => {
        postinfo.value = res.data;
    })
    getComment(props.id).then((res) => {
        commentAllData.value = res.data as CommentInfo[];
    });
})
</script>

<style lang="less" scoped>
.container {
    width: 100%;
    height: 100%;

    .topic-show {
        height: calc(100% - 30px);
        overflow: auto;

        .post {
            width: 100%;
            /* 让内部内容宽度填满容器 */
            height: 100%;
            /* 让内部内容高度填满容器 */
            box-sizing: border-box;
            /* 内边距和边框不会增加元素的实际宽度和高度 */

            .title {
                font-size: 18px;
                font-weight: 600;
                text-align: center;
            }
        }
    }
}


.children {
    padding-left: 40px;
}

:global(.ant-comment .ant-comment-inner) {
    padding: 6px !important;
}

:global(.ant-drawer .ant-drawer-mask) {
    background: rgba(0, 0, 0, 0.1);
}

:global(.ant-drawer-inline) {
    height: calc(100% - 46px);
}

:global(.ant-drawer-right>.ant-drawer-content-wrapper) {
    // transform: translateX(0) !important;
}
</style>
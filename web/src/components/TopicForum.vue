<template>
    <a-input-group class="input-group" compact>
        <a-select v-model:value="gauge">
            <a-select-option v-for="item in gaugeList" :key="item.value" :value="item.value">{{ item.label
            }}</a-select-option>
        </a-select>
        <a-input v-model:value="keywords" style="width: 50%">
            <template #suffix>
                <a-tooltip title="Extra information">
                    <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" @click="search" />
                </a-tooltip>
            </template>
        </a-input>
        <a-popover placement="right">
            <template #content>
                <span>通过话题查询：查询多个用#分割</span>
            </template>
            <ExclamationCircleOutlined class="input-title-icon" />
        </a-popover>
    </a-input-group>
    <a-collapse v-model:activeKey="activeKey" :bordered="false" class="container">
        <template #expandIcon="{ isActive }">
            <caret-right-outlined :rotate="isActive ? 90 : 0" />
        </template>
        <!-- :showArrow="false" -->
        <a-collapse-panel class="post-list" v-for="item in postAll" :key="item._id">
            <template #header>
                <div class="header-post-caption">
                    <span>{{ item.post_caption }}</span>
                    <a-button class="header-button" type="dashed" size="small"
                        @click.stop="viewDetails(item._id)">前往</a-button>
                </div>
            </template>
            <div class="post-info">
                <span>作者： {{ item.user_id.nickname }}</span>
                <span>发布时间：{{ time(item.user_id.create_at) }}</span>
                <span>
                    <span>
                        <LikeOutlined /> {{ item.likedBy.length }}
                    </span>
                    <span class="dislike">
                        <DislikeOutlined /> {{ item.dislikedBy.length }}
                    </span>
                </span>
                <span v-if="item.post_type.length" class="tag-button">
                    <span>标签：</span><a-button type="dashed" class="tag-a-button" size="small" danger
                        v-for="(tag, index) in item.post_type" :key="index">{{ tag }}</a-button>
                </span>
            </div>
        </a-collapse-panel>
    </a-collapse>
    <a-pagination class="pagination" :total="postTotal" v-model:current="current" v-model:pageSize="pageSize"
        :show-total="() => `Total ${postTotal} items`" show-size-changer show-quick-jumper @change="changePageNumber" />
</template>
<script lang="ts" setup>
import router from '@/router';
import { getPostAll } from '@/service/postInfo';
import { usePageSizeData } from '@/stores/pagesize';
import type { GetPostParams, Post } from '@/untils/type';
import { CaretRightOutlined, LikeOutlined, DislikeOutlined, SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import moment from 'moment';
const pageSizeData = usePageSizeData();
/** 话题的全部数据 */
const postAll = ref<Post[]>([]);

const activeKey = ref(['1']);

/** 当前查询结果的总数据条数 */
const postTotal = ref<number>(50);
/** 页数 */
const current = ref<number>(1);
/** 页码 */
const pageSize = ref<number>(10);

/** 查询依据（作者|标题|话题） */
const gauge = ref<'author' | 'title' | 'type'>('title');
const gaugeList = ref<{ label: string, value: string }[]>([
    { label: '作者', value: 'author' },
    { label: '标题', value: 'title' },
    { label: '类型', value: 'type' }
])
/** 查询关键字 */
const keywords = ref<string>('');

/** 格式化时间 */
const time = (date: Date) => {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
};

/** 查看话题详情 */
const viewDetails = (id: string) => {
    router.push(`/detail/${id}`)
}
/** 查询 */
const search = () => {
    const params: GetPostParams = {
        current: current.value,
        pageSize: pageSize.value,
        gauge: gauge.value,
        keywords: keywords.value
    }
    getPostAll(params).then((res) => {
        postAll.value = res.data.data as Post[];
        postTotal.value = res.data.total;
    });
}

const changePageNumber = ()=>{
    pageSizeData.$patch({pageNumber: current.value, pageSize: pageSize.value});
    search();
}

onMounted(() => {
    current.value = pageSizeData.pageNumber;
    pageSize.value = pageSizeData.pageSize;
    search();
});

onBeforeUnmount(()=>{
    pageSizeData.reset();
})
</script>

<style lang="less" scoped>
.input-group {
    margin-bottom: 28px;

    .input-title-icon {
        font-size: large;
        line-height: 32px;
        margin-left: 8px;
    }
}

.container {
    height: 88%;
    background: rgb(255, 255, 255);
    overflow-y: scroll;

    .post-info {
        display: grid;
        grid-template-columns: 188px 288px 88px auto;
        cursor: pointer;

        .dislike {
            margin-left: 8px;
        }

        .tag-button {
            .tag-a-button {
                margin-right: 8px;
                margin-top: 1px;
            }
        }
    }
}

.header-button {
    margin-left: 88px;
}

.post-list {

    background: #f7f7f7;
    border-radius: 4px;
    margin-bottom: 24px;
    border: 0;
    overflow: hidden;

    .header-post-caption {
        height: 24px;
        line-height: 24px;
    }

    .header-button {
        display: none;
    }

    &:hover {
        .header-button {
            display: inline-block;
        }
    }
}

.pagination {
    margin-top: 10px;
}
</style>
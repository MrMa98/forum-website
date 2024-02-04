<template>
    <div class="container">
        <div class="button">
            <a-button :icon="H(PlusCircleOutlined)" @click="add" type="primary">新增</a-button>
            <a-button :icon="H(EditOutlined)" @click="edit">修改</a-button>
            <a-button :icon="H(DeleteOutlined)" @click="del" type="primary" danger>删除</a-button>
            <span>
                <label for="search">搜索：</label>
                <a-select id="search" v-model:value="searchValue" allowClear show-search placeholder="请输入想查询的关键词"
                    style="width: 200px" :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                    :not-found-content="null" :options="options" @search="handleSearch" @change="handleChange">
                </a-select>
            </span>
        </div>
        <div class="title">
            <label for="title">标题</label>
            <a-textarea id="title" v-model:value="titleValue" placeholder="Autosize height based on content lines"
                auto-size />
        </div>
        <div class="content">
            <label for="content">内容</label><span class="preview-button" @click="openDrawer">预览</span>
            <TinyMCE id="content" v-model="textValue"></TinyMCE>
        </div>
        <a-drawer :width="888" title="效果预览" :placement="placement" :open="open" @close="onClose">
            <template #extra>
                <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
                <a-button type="primary" @click="onSubmit">发布</a-button>
            </template>
            <div class="preview-content" :class="{ 'preview-nodata': !titleValue && !preview }">
                <div class="preview-title">{{ titleValue }}</div>
                <div v-html="preview"></div>
                <a-empty v-if="!titleValue && !preview" :image="simpleImage"><template
                        #description>暂无数据</template></a-empty>
            </div>
        </a-drawer>
    </div>
</template>
<script lang="ts" setup>
import { addPost, getPostByName, getPostById, updatePostById, deletePostById } from '@/service/postInfo';
import TinyMCE from '../untils/tinyMCE.vue'
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { openNotification } from '@/untils/antvNotification';
import type { PostInfo } from '@/untils/type';
import type { Options } from 'ant-design-vue/es/_util/cssinjs/transformers/px2rem';
import { usePostInfoData } from '@/stores/postinfo';
import { Empty } from 'ant-design-vue';
import type { DrawerProps } from 'ant-design-vue';
const route = useRoute();

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const H = h;
const titleValue = ref<string>('');
const textValue = ref<string>('');
const userInfoStore = useUserInfoStore().userInfoData;
const postInfoStore = usePostInfoData();
const options = ref<Options[]>([]);
const searchValue = ref();
const placement = ref<DrawerProps['placement']>('right');
const open = ref<boolean>(false);
let preview = ref<string>('');


const onClose = () => {
    open.value = false;
};

const onSubmit = async () => {
    if (postInfoStore.postInfoData._id) {
        await edit()
    } else {
        await add()
    }
    open.value = false;
}

const openDrawer = () => {
    preview = textValue;
    open.value = true;
}



/** 添加话题 */
const add = () => {
    const params = {
        user_id: userInfoStore._id,
        post_caption: titleValue.value,
        post_text: textValue.value,
    }
    return addPost(params).then((data) => {
        const isError = Boolean(data);
        if (isError) {
            initData();
        }
        openNotification('bottomRight', '添加成功', '', false, isError)
    })
}

/** 修改 */
const edit = () => {
    const params = {
        post_id: postInfoStore.postInfoData._id,
        post_caption: titleValue.value,
        post_text: textValue.value,
    }
    return updatePostById(params).then((data) => {
        const isError = Boolean(data)
        openNotification('bottomRight', '修改成功', '', false, isError)
    })
}

/** 删除 */
const del = () => {
    if (postInfoStore.postInfoData._id) {
        deletePostById(postInfoStore.postInfoData._id).then((data) => {
            const isError = Boolean(data);
            initData();
            postInfoStore.$patch({ postInfoData: { _id: '' } });
            openNotification('bottomRight', '删除成功', '', false, isError);

        })
    } else {
        openNotification('bottomRight', '删除失败', '请选择要删除的话题')
    }
}

/** 初始化数据 */
const initData = () => {
    titleValue.value = '';
    textValue.value = '';
    searchValue.value = '';
    options.value = [];
}

let timeout: number | null;

function search(value: string) {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }

    function fake() {
        getPostByName(value).then((res) => {
            options.value =
                res.data.map((post: PostInfo) => ({
                    value: post._id,
                    label: post.post_caption,
                }));
        })
    }

    timeout = setTimeout(fake, 500);
}

const handleSearch = (val: string) => {
    search(val)
};

const handleChange = (val: string) => {
    if (searchValue.value === undefined) {
        initData();
        postInfoStore.reset();
        console.log(postInfoStore.postInfoData);
    } else {
        searchValue.value = val || '';
        searchPostInfo(val);
    }

};

const searchPostInfo = (val: string) => {
    return getPostById(val).then((res: { data: PostInfo }) => {
        if (res.data) {
            const { post_caption, post_text } = res.data;
            searchValue.value = post_caption;
            titleValue.value = post_caption;
            textValue.value = post_text;
            postInfoStore.$patch({ postInfoData: res.data });
        } else {
            openNotification('bottomRight', '查询失败', '该话题已删除')
        }

    });
}

onMounted(() => {
    const id = route.query.id as string;
    if(id){
        searchPostInfo(id);
    }
})


</script>
<style lang="less" scoped>
.container {
    widows: 100%;
    height: 100%;
    position: relative;
}

.button,
.title {
    width: 600px;
}

.button {
    display: flex;
    justify-content: space-between;

    span {
        label {
            color: blue;
            cursor: pointer;
        }
    }
}

.title,
.content {
    margin-top: 18px;

    label {
        display: inline-block;
        font-size: 18px;
        margin-bottom: 8px;
    }

    .preview-button {
        font-size: 15px;
        float: right;
        cursor: pointer;
    }
}

.content {
    max-width: 888px;
}

.preview-content {}

.preview-nodata {
    display: grid;
    place-items: center;
    height: 50vh
}

.preview-title {
    display: grid;
    place-items: center;
    font-size: 18px;
    font-weight: 600;
}
</style>
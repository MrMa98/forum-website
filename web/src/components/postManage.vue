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
            <label for="select" class="post-tag">标签：
                <a-popover placement="right">
                    <template #content>
                        <p>最多可以为话题添加三个标签</p>
                    </template>
                    <template #title>
                        <span>标签最好贴近话题</span>
                    </template>
                    <ExclamationCircleOutlined />
                </a-popover>
            </label>
            <a-select id="select" v-model:value="selectValue" mode="multiple" style="width: 888px" placeholder="选择内容类型"
                :max-tag-text-length="maxTagTextLength" :options="selectOptions">
            </a-select>
            <label for="select" class="post-tag">自定义标签：</label>
            <a-input v-model:value="customTag" show-count :maxlength="20" style="width: 388px;" />
            <a-button @click="addTag" type="dashed" size="middle">添加</a-button>
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
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { openNotification } from '@/untils/antvNotification';
import type { PostInfo } from '@/untils/type';
import type { Options } from 'ant-design-vue/es/_util/cssinjs/transformers/px2rem';
import { usePostInfoData } from '@/stores/postinfo';
import { Empty } from 'ant-design-vue';
import type { DrawerProps } from 'ant-design-vue';
import { useSidebarInfo } from '@/stores/sidebar';
import PostTypeArr from '@/untils/postType';
import { addCustomTag, getCustomTag } from '@/service/users';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const H = h;
const titleValue = ref<string>('');
const textValue = ref<string>('');
const userInfoStore = useUserInfoStore().userInfoData;
const postInfoStore = usePostInfoData();
const sidebarInfoStore = useSidebarInfo();
const options = ref<Options[]>([]);
const searchValue = ref();
const placement = ref<DrawerProps['placement']>('right');
const open = ref<boolean>(false);
let preview = ref<string>('');
const maxTagTextLength = ref(10);
const selectValue = ref<string[]>([]);

const selectOptions = ref<{ label: string, value: string }[]>(PostTypeArr);
const customTag = ref<string>('')

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

const addTag = () => {
    if(!customTag.value){
        openNotification('bottomRight', '请输入要添加的话题', '', true);
        return false;
    }
    addCustomTag(customTag.value).then((res) => {
        const isError = Boolean(res.data)
        if (!selectOptions.value.some(option => option.value === customTag.value)) {
            selectOptions.value.push({ label: customTag.value, value: customTag.value });
            openNotification('bottomRight', '添加话题标签成功', '', false, isError);
        }
    })
}

/** 限制标签个数 */
const tagFail = ()=>{
    if(selectValue.value.length>3){
      openNotification('bottomRight', 'error', '每个话题最多可以添加三个标签', true);
      return  false;
    }
    return  true;
}



/** 添加话题 */
const add = () => {
    if (!tagFail()) {
        return false; 
    }
    const params = {
        user_id: userInfoStore._id,
        post_caption: titleValue.value,
        post_text: textValue.value,
        post_type: selectValue.value,
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
    if (!tagFail()) {
        return false; 
    }
    const params = {
        post_id: postInfoStore.postInfoData._id,
        post_caption: titleValue.value,
        post_text: textValue.value,
        post_type: selectValue.value,
    }
    return updatePostById(params).then((res) => {
        const isError = Boolean(res.data);
        openNotification('bottomRight', '修改成功', '', false, isError)
    })
}

/** 删除 */
const del = () => {
    /** 后端也做了处理，正常开发也需要前后端同时处理 */
    if (postInfoStore.postInfoData._id) {
        deletePostById(postInfoStore.postInfoData._id).then((res) => {
            
            const isError = Boolean(res.data);
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
    selectValue.value = [];
    sidebarInfoStore.$patch({ post_id: '' });
}

let timeout: number | null;

/** 通过标题查询（模糊查询） */
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
    } else {
        searchValue.value = val || '';
        searchPostInfo(val);
    }

};

/** 通过id查询话题 */
const searchPostInfo = (val: string) => {
    return getPostById(val).then((res: { data: PostInfo }) => {
        if (res.data) {
            const { post_caption, post_text, post_type } = res.data;
            searchValue.value = post_caption;
            titleValue.value = post_caption;
            textValue.value = post_text;
            selectValue.value = post_type;
            postInfoStore.$patch({ postInfoData: res.data });
        } else {
            openNotification('bottomRight', '查询失败', '该话题已删除')
        }

    });
}

onMounted(() => {
    getCustomTag().then((res) => {
        res.data.custom_type.forEach((value: string) => {
            const tag = {
                label: value,
                value,
            }
            selectOptions.value.push(tag);
        });
    })
    if (sidebarInfoStore.post_id) {
        searchPostInfo(sidebarInfoStore.post_id);
    }
});

onUnmounted(() => {
    sidebarInfoStore.postIdReset();
});


</script>
<style lang="less" scoped>
.container {
    widows: 100%;
    height: 100%;
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;
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

    .post-tag {
        margin-top: 18px;
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
<template>
    <div class="title">
        <div class="instruction">
            <span>
                <PlusCircleOutlined style="font-size: 16px; color:green" />新增
            </span>
            <span>
                <EditOutlined style="font-size: 16px; color:blue" />修改
            </span>
            <span>
                <DeleteOutlined style="font-size: 16px; color:red" />删除
            </span>
            <span>
                <SyncOutlined style="font-size: 16px; color:aquamarine" />恢复
            </span>
        </div>
        <div class="delete">
            <a-popconfirm placement="left" title="确定要删除操作记录吗？该操作无法恢复" ok-text="确定" cancel-text="放弃"
                @confirm="deleteConfirm">
                <a-button type="primary" danger>删除操作记录</a-button>
            </a-popconfirm>
        </div>
    </div>
    <a-timeline class="operation" v-if="operationArr.length" mode="alternate" ref="el">
        <a-timeline-item class="log" v-for="(item, index) in operationArr" :key="item._id">
            <template #dot>
                <PlusCircleOutlined v-if="item.operation == 'add'" style="font-size: 16px; color:green" />
                <EditOutlined v-if="item.operation == 'update'" style="font-size: 16px; color:blue" />
                <DeleteOutlined v-if="item.operation == 'delete'" style="font-size: 16px; color:red" />
                <SyncOutlined v-if="item.operation == 'recover'" style="font-size: 16px; color:aquamarine" />
            </template>

            <a-popconfirm :placement="placement(index)" ok-text="确定" cancel-text="取消"
                @confirm="confirm(item.post_id._id, item.operation)" @openChange="openChange(item.operation)">
                <template #title>
                    <span>{{ text }}</span>
                </template>
                {{ item.post_id.post_caption }}
                <br>
                {{ time(item.operation_at) }}
            </a-popconfirm>
        </a-timeline-item>
    </a-timeline>
    <a-empty v-if="!operationArr.length" class="empty" :image="simpleImage">
        <template #description>
            暂无操作记录
        </template>
    </a-empty>
</template>
<script lang="ts" setup>
import { getOperationLog, recoverPostById } from '@/service/postInfo';
import { openNotification } from '@/untils/antvNotification';
import type { OperationLog } from '@/untils/type';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons-vue';
import moment from 'moment';
import { Empty } from 'ant-design-vue';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const router = useRouter();
const el = ref<HTMLInputElement | null>(null)

const time = (date: Date) => {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a')
};
let operationArr = reactive<OperationLog[]>([]);

const placement = (index: number) => {
    if (index % 2 === 0) {
        return 'right'
    } else {
        return 'left'
    }
}

const openChange = (operation: 'add' | 'update' | 'delete' | 'recover') => {
    if (operation === 'delete') {
        text.value = '是否恢复数据';
    } else {
        text.value = '是否修改该话题';
    }
}

let text = ref<string>('');

const confirm = (id: string, operation: 'add' | 'update' | 'delete' | 'recover') => {
    if (operation === 'delete') {
        recoverPostById(id).then((data) => {
            let isError = Boolean(data);
            openNotification('bottomRight', '恢复成功', '', false, isError);
        });
    } else {
        router.push(`/home/post?id=${id}`);
    }

};

const deleteConfirm = () => {

}

async function operation() {
    const data = await getOperationLog();
    Object.assign(operationArr, data);
    await nextTick();
    const element = document.getElementsByClassName('operation')[0]
    element.scrollTop = element.scrollHeight;
}

onMounted(() => {
    operation();
})
</script>

<style lang="less" scoped>
.title {
    display: flex;
    justify-content: space-between;
}

.instruction {
    width: 100px;
    display: flex;
    justify-content: space-between;
}

.log {
    cursor: pointer;
}

.delete {
    display: inline-block;
}

.empty {
    height: 66%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.operation {
    height: 88%;
    overflow-y: scroll;
    overflow-x: hidden;
    padding-top: 8px;
}
</style>
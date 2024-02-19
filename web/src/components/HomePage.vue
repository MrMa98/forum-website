<template>
    <a-layout style="height: 100vh;">
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" :theme="theme" collapsible>
            <div class="logo" :class="{ 'logo-content': collapsed }" @click="showDrawer">
                <img :src="logoImg" alt="" width="66px">
                <div class="username" :style="fontColor"><span>{{ userInfoStore.nickname || userInfoStore.username }}</span>
                </div>
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" :theme="theme" mode="inline">
                <a-menu-item key="post">
                    <BarsOutlined />
                    <span>话题管理</span>
                </a-menu-item>
                <a-menu-item key="record">
                    <ReconciliationOutlined />
                    <span>操作记录</span>
                </a-menu-item>
                <a-menu-item key="forum">
                    <WeiboOutlined />
                    <span>论坛</span>
                </a-menu-item>
            </a-menu>
            <a-switch class="switch-theme" v-model:checked="theme" checked-children="夜间模式" un-checked-children="日间模式"
                checkedValue="light" unCheckedValue="dark" />
            <a-drawer :width="666" placement="left" :closable="false" :open="open" @close="onClose">
                <UserInfo />
            </a-drawer>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                <div class="hottest-omments">
                    <div class="animated-text" @click="viewHotPost(animationId)">{{ animationValue }}</div>
                </div>
                <div class="count-down">
                    <a-statistic-countdown class="day-level" :value="deadline" format="D 天 H 时 m 分 s 秒" />
                </div>
            </a-layout-header>
            <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
                <router-view></router-view>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script lang="ts" setup>
import {
    BarsOutlined,
    ReconciliationOutlined,
    WeiboOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons-vue';
import { fadeColorMap } from '../untils/fadeColor';
import { useUserInfoStore } from '@/stores/userInfo';
import router from '@/router';
import { getPostByHottest } from '@/service/postInfo';
import { useSidebarInfo } from '@/stores/sidebar';
import UserInfo from './UserInfo.vue'
import { bufferToBase64 } from '@/untils/bufferToBase64';

const theme = ref<'dark' | 'light'>('dark');
const selectedKeys = ref<string[]>(['post']);
const collapsed = ref<boolean>(false);
const userInfoStore = useUserInfoStore().userInfoData;
const sidebarInfoStore = useSidebarInfo();
let animationValue = ref<string>('');
let animationId = ref<string>('');
let count = ref<number>(0);
let time: number | undefined;
const now = new Date();
const currentHour = now.getHours();
let logoImg = ref<string>('')

const color = fadeColorMap.get(204);
/** 倒计时 */
const deadline = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0).getTime();

const fontColor = reactive({
    background: `linear-gradient(to right, ${color.start}, ${color.end})`,
    /* 修改这里的颜色值 */
    '-webkit-background-clip': 'text',
    color: 'transparent',
    display: 'inline - block',
})
watch(selectedKeys, (newVal) => {
    sidebarInfoStore.sidebarKey = newVal;
    navigateToNewPath(newVal[0]);
});

const navigateToNewPath = (selectedKeys: string | null) => {
    if (selectedKeys) {
        router.push(`/home/${selectedKeys}`);
    }
};

const modern = () => {
    switch (true) {
        case currentHour >= 6 && currentHour < 12:
            return '早上好';
        case currentHour >= 12 && currentHour < 14:
            return '中午好';
        case currentHour >= 14 && currentHour < 18:
            return '下午好';
        case currentHour >= 18 && currentHour < 24:
            return '晚上好';
        default:
            return '深夜好';
    }
};

function fetchPostInfoHotData() {
    animationValue.value = (`${modern()}，${userInfoStore.nickname} ${userInfoStore.sex === 'man' ? '先生' : '女士'}`);
    return getPostByHottest().then(res => {
        if (modern() === '深夜好') {
            res.data.unshift({ id: 0, post_caption: '没事早点睡吧，心里已经很变态了！身体一定要健康。' })
        }
        return res.data
    });
}

const viewHotPost = (id: string) => {
    if (id) {
        router.push(`/detail/${id}`)
    }
}


const open = ref(false);
const showDrawer = () => {
    open.value = true;
};

const onClose = () => {
    open.value = false;
};

onMounted(() => {
    logoImg.value = bufferToBase64(userInfoStore.avatar as unknown as { data: ArrayBuffer });
    sidebarInfoStore.$subscribe((mutation) => {
        if (mutation.type === "patch object" && mutation.payload.sidebarKey) {
            selectedKeys.value = mutation.payload.sidebarKey as string[];
        }
    });

    if (sidebarInfoStore.sidebarKey) {
        selectedKeys.value = sidebarInfoStore.sidebarKey;
    }

    fetchPostInfoHotData().then((data) => {
        function updateAnimationValue() {
            if (count.value === 10) {
                count.value = 0;
            }
            animationId.value = data[count.value]._id;
            animationValue.value = data[count.value].post_caption;
            count.value += 1;
            time = setTimeout(updateAnimationValue, 12000);
        }

        time = setTimeout(updateAnimationValue, 12000);
    });
});

onUnmounted(() => {
    clearTimeout(time);
})

</script>
<style lang="less">
#components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
}

.site-layout .site-layout-background {
    background: #fff;
}

.logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 88px;

    img {
        width: 66px;
        height: 66px;
        border-radius: 50%;
    }

    .username {
        display: flex;
        flex-direction: column;
        margin-left: 8px;
    }
}

.logo-content {
    height: 98px;
    flex-direction: column;

    img {
        width: 50px;
        height: 50px;
    }

}

.switch-theme {
    margin-top: auto;
}


.hottest-omments {
    display: inline-block;
    width: calc(100vw - 490px);
    height: 100%;
    overflow: hidden;

    @keyframes slideIn {
        from {
            transform: translateX(-100%);
        }

        to {
            transform: translateX(calc(100vw - 490px));
        }
    }

    .animated-text {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        animation: slideIn 12s ease-in-out infinite;
        cursor: pointer;
        user-select: none;
    }
}

.count-down {
    display: inline-block;

    .day-level {
        position: absolute;
        top: 8px;
        right: 8px;
    }
}

.ant-layout-sider-children {
    display: flex;
    flex-direction: column;
}
</style>

<template>
    <a-layout style="height: 100vh;">
        <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
            <div class="logo" :class="{ 'logo-content': collapsed }">
                <img src="../assets/logo.png" alt="" width="66px">
                <div class="username" :style="fontColor"><span>{{ userInfoStore.username }}</span>
                </div>
            </div>
            <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                <a-menu-item key="post">
                    <BarsOutlined />
                    <span>nav 1</span>
                </a-menu-item>
                <a-menu-item key="post1">
                    <video-camera-outlined />
                    <span>nav 2</span>
                </a-menu-item>
                <a-menu-item key="post2">
                    <upload-outlined />
                    <span>nav 3</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
                <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
                <div class="hottest-omments">
                    <div class="animated-text">这是一行从左到右的动画文字</div>
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
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons-vue';
import { fadeColorMap } from '../untils/fadeColor';
import { useUserInfoStore } from '@/stores/userInfo';
import router from '@/router';
const selectedKeys = ref<string[]>(['post']);
const collapsed = ref<boolean>(false);
const userInfoStore = useUserInfoStore().userInfoData;

const color = fadeColorMap.get(204);
/** 倒计时 */
const deadline = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0, 0).getTime();

const fontColor = reactive({
    background: `linear-gradient(to right, ${color.start}, ${color.end})`,
    /* 修改这里的颜色值 */
    '-webkit-background-clip': 'text',
    color: 'transparent',
    display: 'inline - block',
})
watch(selectedKeys, (newVal) => {
  navigateToNewPath(newVal[0]);
});

const navigateToNewPath = (selectedKeys: string | null) => {
  if (selectedKeys) {
    router.push(`/home/${selectedKeys}`);
  }
};
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
</style>

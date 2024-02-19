<template>
  <a-layout class="layout">
    <a-layout-header>
      <div class="logo" />
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Detail</a-breadcrumb-item>
        <a-breadcrumb-item>12312</a-breadcrumb-item>
      </a-breadcrumb>
      <div class="content"><TopicShow :id="id"/></div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Mr.Ma ©2024 Created
    </a-layout-footer>
  </a-layout>
</template>
<script lang="ts" setup>
import TopicShow from './TopicShow.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.params.id as string;
</script>
<style lang="less" scoped>
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}

#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
  background: #141414;
}

.layout {
  height: 100vh;

  .content {
    height: 100%;
    background: #fff;
    padding: 24px;
  }
}
</style>
  
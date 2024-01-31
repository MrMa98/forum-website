<script setup lang="ts">
import { RouterView } from 'vue-router';
const model = reactive({
  // image: 'https://th.bing.com/th/id/OIP.4YZslcy6RU6M1Wpx0-WcywAAAA?w=458&h=458&rs=1&pid=ImgDetMain',
  content: ['Mr.Ma', 'PERSONAL WEBSITE'],
  font: {
    fontSize: 12,
  },
  zIndex: 11,
  rotate: -22,
  gap: [88, 88] as [number, number],
  offset: [],
  color: 'rgba(0,0,0,.15)',
});


</script>

<template>
  <a-watermark v-bind="model">
    <div style="height: 100vh">
      <RouterView />
    </div>
  </a-watermark>
  <a-float-button-group shape="circle">
    <a-float-button :badge="{ count: 12 }">
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
    <a-float-button :badge="{ count: 123, overflowCount: 999 }"></a-float-button>
    <a-back-top :visibility-height="0" />
  </a-float-button-group>
</template>

<style scoped></style>

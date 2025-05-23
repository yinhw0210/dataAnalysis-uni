<route lang="json5" type="user">
{
  layout: "main",
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed } from "vue";

const statusBarHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight ?? 0;
});

const navBarHeight = computed(() => {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  return (
    menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight.value) * 2
  );
});

const contentHeight = computed(() => {
  return `calc(100vh - ${navBarHeight.value}px - ${statusBarHeight.value}px)`;
});

const onHandleIssue = () => {
  uni.navigateTo({
    url: "/pages/issue/index",
  });
};
</script>
<template>
  <div class="home-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <div
      :style="{ height: `${navBarHeight}px` }"
      class="flex justify-center items-center px-[16rpx] font-bold"
    >
      星栈屿
    </div>
    <div
      :style="{ height: `${contentHeight}px` }"
      class="flex flex-col gap-[16rpx] p-[16rpx]"
    >
      <div
        class="flex items-center gap-[16rpx] px-[24rpx] text-[28rpx] font-bold py-[24rpx] rounded-md shadow-[0px_4rpx_15rpx_0px_rgba(46,45,116,0.065)]"
        @click="onHandleIssue"
      >
        <wd-icon name="help-circle" size="22px"></wd-icon>
        <span>常见问题</span>
      </div>
      <div
        class="flex items-center gap-[16rpx] px-[24rpx] text-[28rpx] font-bold py-[24rpx] rounded-md shadow-[0px_4rpx_15rpx_0px_rgba(46,45,116,0.065)]"
      >
        <wd-icon name="service" size="22px"></wd-icon>
        <button class="button-text" open-type="contact">联系客服</button>
      </div>
    </div>
  </div>
</template>

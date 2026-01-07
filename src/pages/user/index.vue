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

const menuItems = [
  { icon: "help-circle", label: "常见问题", type: "navigate", url: "/pages/issue/index" },
  { icon: "service", label: "联系客服", type: "contact" },
  { icon: "star-on", label: "给个好评", type: "feedback" },
  { icon: "share", label: "分享给好友", type: "share" },
];

const handleMenuClick = (item: typeof menuItems[0]) => {
  if (item.type === "navigate" && item.url) {
    uni.navigateTo({ url: item.url });
  }
};
</script>
<template>
  <div class="home-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <div
      class="flex items-center justify-center text-[#fff] text-[34rpx] font-bold"
      :style="{ height: `${navBarHeight}px` }"
    >
      我的
    </div>

    <!-- 用户卡片 -->
    <div
      class="absolute left-[24rpx] right-[24rpx] bg-white rounded-[20rpx] p-[32rpx] flex items-center shadow-sm"
      :style="{ top: `${statusBarHeight + navBarHeight + 20}px` }"
    >
      <div
        class="w-[100rpx] h-[100rpx] rounded-full flex items-center justify-center mr-[24rpx]"
        style="background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%)"
      >
        <wd-icon name="user" size="40px" color="#667eea"></wd-icon>
      </div>
      <div class="flex-1">
        <div class="text-[34rpx] font-bold text-[#333] mb-[8rpx]">欢迎使用</div>
        <div class="text-[26rpx] text-[#999]">去水印工具 · 让创作更简单</div>
      </div>
    </div>

    <!-- 菜单列表 -->
    <div
      class="absolute left-[24rpx] right-[24rpx] bg-white rounded-[20rpx] overflow-hidden"
      :style="{ top: `${statusBarHeight + navBarHeight + 180}px` }"
    >
      <div
        v-for="(item, index) in menuItems"
        :key="item.label"
        class="flex items-center justify-between p-[28rpx]"
        :class="{ 'border-b border-[#f5f5f5]': index < menuItems.length - 1 }"
        @click="handleMenuClick(item)"
      >
        <div class="flex items-center">
          <div
            class="w-[64rpx] h-[64rpx] rounded-[16rpx] flex items-center justify-center mr-[20rpx]"
            style="background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%)"
          >
            <wd-icon :name="item.icon" size="18px" color="#667eea"></wd-icon>
          </div>
          <template v-if="item.type === 'contact'">
            <button class="menu-btn" open-type="contact">{{ item.label }}</button>
          </template>
          <template v-else-if="item.type === 'share'">
            <button class="menu-btn" open-type="share">{{ item.label }}</button>
          </template>
          <template v-else-if="item.type === 'feedback'">
            <button class="menu-btn" open-type="feedback">{{ item.label }}</button>
          </template>
          <template v-else>
            <span class="text-[30rpx] text-[#333]">{{ item.label }}</span>
          </template>
        </div>
        <wd-icon name="arrow-right" size="14px" color="#ccc"></wd-icon>
      </div>
    </div>

    <!-- 底部版权 -->
    <div class="absolute bottom-[140rpx] left-0 right-0 text-center">
      <span class="text-[24rpx] text-[#ccc]">v1.0.0</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100vh;
  background: #f5f7fa;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0 0 40rpx 40rpx;
  }
}

.shadow-sm {
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.menu-btn {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 30rpx;
  color: #333;
  line-height: normal;
  text-align: left;

  &::after {
    display: none;
  }
}
</style>

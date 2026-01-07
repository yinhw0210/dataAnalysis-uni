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
  {
    icon: "help-circle",
    label: "常见问题",
    type: "navigate",
    url: "/pages/issue/index",
    color: "#6366f1",
  },
  { icon: "service", label: "联系客服", type: "contact", color: "#10b981" },
  { icon: "star-on", label: "给个好评", type: "feedback", color: "#f59e0b" },
  { icon: "share", label: "分享给好友", type: "share", color: "#ec4899" },
];

const handleMenuClick = (item: any) => {
  if (item.type === "navigate" && item.url) {
    uni.navigateTo({ url: item.url });
  }
};
</script>
<template>
  <div class="user-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <div
      class="flex items-center justify-end px-[32rpx] text-[#1e293b] text-[36rpx] font-bold z-10 relative"
      :style="{ height: `${navBarHeight}px` }"
    >
      <!-- Optional: Settings Icon can go here -->
    </div>

    <div class="flex flex-col items-center pt-[40rpx] pb-[60rpx] relative z-10">
      <div
        class="w-[180rpx] h-[180rpx] rounded-full flex items-center justify-center mb-[24rpx] shadow-xl relative"
        style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      >
        <div
          class="absolute inset-0 rounded-full border-[6rpx] border-white"
        ></div>
        <wd-icon name="user" size="60px" color="#94a3b8"></wd-icon>
      </div>

      <div class="text-[40rpx] font-bold text-[#1e293b] mb-[8rpx]">
        欢迎使用
      </div>
      <div class="text-[26rpx] text-[#64748b]">去水印工具 · 让创作更简单</div>
    </div>

    <!-- Menu List -->
    <div class="px-[32rpx] relative z-10">
      <div
        class="bg-white rounded-[32rpx] shadow-sm overflow-hidden mb-[40rpx]"
      >
        <div
          v-for="(item, index) in menuItems"
          :key="item.label"
          class="flex items-center justify-between p-[32rpx] active:bg-gray-50 transition-colors"
          :class="{ 'border-b border-gray-50': index < menuItems.length - 1 }"
          @click="handleMenuClick(item)"
        >
          <div class="flex items-center">
            <div
              class="w-[72rpx] h-[72rpx] rounded-[20rpx] flex items-center justify-center mr-[24rpx]"
              :style="{ background: `${item.color}15` }"
            >
              <wd-icon
                :name="item.icon"
                size="20px"
                :color="item.color"
              ></wd-icon>
            </div>

            <template v-if="item.type === 'contact'">
              <button class="menu-btn" open-type="contact">
                {{ item.label }}
              </button>
            </template>
            <template v-else-if="item.type === 'share'">
              <button class="menu-btn" open-type="share">
                {{ item.label }}
              </button>
            </template>
            <template v-else-if="item.type === 'feedback'">
              <button class="menu-btn" open-type="feedback">
                {{ item.label }}
              </button>
            </template>
            <template v-else>
              <span class="text-[30rpx] font-medium text-[#1e293b]">{{
                item.label
              }}</span>
            </template>
          </div>
          <wd-icon name="arrow-right" size="16px" color="#cbd5e1"></wd-icon>
        </div>
      </div>

      <div class="text-center">
        <div class="text-[22rpx] text-[#cbd5e1] mb-[8rpx]">当前版本 v1.0.0</div>
      </div>
    </div>

    <!-- Background Elements -->
    <div
      class="absolute top-0 inset-x-0 h-[500rpx] bg-gradient-to-b from-[#eff6ff] to-transparent -z-10"
    ></div>
    <div
      class="absolute -top-[200rpx] -right-[200rpx] w-[600rpx] h-[600rpx] bg-[#f0f9ff] rounded-full blur-[100rpx] -z-10 opacity-60"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.user-container {
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.shadow-xl {
  box-shadow: 0 20rpx 40rpx -10rpx rgba(148, 163, 184, 0.2);
}

.shadow-sm {
  box-shadow: 0 4rpx 20rpx rgba(148, 163, 184, 0.05);
}

.menu-btn {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 30rpx;
  font-weight: 500;
  color: #1e293b;
  line-height: normal;
  text-align: left;

  &::after {
    display: none;
  }
}
</style>

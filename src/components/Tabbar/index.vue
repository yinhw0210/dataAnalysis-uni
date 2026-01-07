<script setup lang="ts">
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";

const tabbar = ref("home");

// 根据当前路由设置选中状态
const updateTabbar = () => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route || "";
    if (route.includes("/home/")) {
      tabbar.value = "home";
    } else if (route.includes("/tool/")) {
      tabbar.value = "tool";
    } else if (route.includes("/user/")) {
      tabbar.value = "user";
    }
  }
};

// 每次页面显示时更新选中状态
onShow(() => {
  updateTabbar();
});

const handleChange = ({ value }: { value: string }) => {
  if (value === tabbar.value) return;
  tabbar.value = value;
  uni.switchTab({
    url: `/pages/${value}/index`,
  });
};
</script>

<template>
  <wd-tabbar 
    :model-value="tabbar" 
    fixed 
    @change="handleChange"
    active-color="#667eea"
    inactive-color="#999"
  >
    <wd-tabbar-item name="home" title="首页" icon="home"></wd-tabbar-item>
    <wd-tabbar-item name="tool" title="工具" icon="image"></wd-tabbar-item>
    <wd-tabbar-item name="user" title="我的" icon="user"></wd-tabbar-item>
  </wd-tabbar>
</template>

<style lang="scss" scoped>
:deep(.wd-tabbar) {
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  border-top: none;
}
</style>

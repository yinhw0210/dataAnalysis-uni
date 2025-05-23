<script setup lang="ts">
import { ref, nextTick } from "vue";
const tabbar = ref(uni.getStorageSync("tabbar") ?? "home");

const handleChange = ({ value }: { value: string }) => {
  if (value === tabbar.value) return;
  // 存到sessionStorage
  uni.setStorageSync("tabbar", value);
  nextTick(() => {
    uni.switchTab({
      url: `/pages/${value}/index`,
    });
  });
};
</script>

<template>
  <wd-tabbar :model-value="tabbar" fixed @change="handleChange">
    <wd-tabbar-item name="home" title="首页" icon="home"></wd-tabbar-item>
    <wd-tabbar-item name="tool" title="拼图" icon="image"></wd-tabbar-item>
    <wd-tabbar-item name="user" title="我的" icon="user"></wd-tabbar-item>
  </wd-tabbar>
</template>

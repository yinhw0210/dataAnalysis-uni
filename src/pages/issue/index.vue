<script setup lang="ts">
import { ref, computed } from "vue";

const value = ref<string[]>(["item1"]);

const statusBarHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight ?? 0;
});

const navBarHeight = computed(() => {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  return (
    menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight.value) * 2
  );
});

const handleBack = () => {
  uni.navigateBack();
};

const faqList = [
  {
    name: "item1",
    title: "为什么链接解析不成功？",
    items: [
      "视频已被隐藏或下架，无法解析",
      "链接必须是最新复制的分享链接",
      "目前仅支持主流视频平台",
    ],
  },
  {
    name: "item2",
    title: "文件下载失败怎么办？",
    items: [
      "请检查链接是否有效",
      "微信内无法直接下载视频，请长按保存",
    ],
  },
  {
    name: "item3",
    title: "豆包去水印怎么用？",
    items: [
      "打开豆包APP，找到AI生成的图片",
      "点击分享，复制分享链接",
      "粘贴到本工具，点击提取即可",
    ],
  },
];
</script>
<template>
  <div class="issue-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <!-- 导航栏 -->
    <div
      class="flex items-center px-[24rpx]"
      :style="{ height: `${navBarHeight}px` }"
    >
      <div class="w-[60rpx] flex items-center" @click="handleBack">
        <wd-icon name="arrow-left" size="20px" color="#333"></wd-icon>
      </div>
      <div class="flex-1 text-center text-[34rpx] font-bold text-[#333]">常见问题</div>
      <div class="w-[60rpx]"></div>
    </div>

    <!-- 内容区域 -->
    <div class="flex flex-col p-[24rpx]">
      <div class="bg-white rounded-[20rpx] overflow-hidden">
        <wd-collapse v-model="value">
          <wd-collapse-item
            v-for="faq in faqList"
            :key="faq.name"
            :title="faq.title"
            :name="faq.name"
          >
            <div class="flex flex-col gap-[20rpx] px-[8rpx] pb-[8rpx]">
              <div
                v-for="(item, idx) in faq.items"
                :key="idx"
                class="flex items-start"
              >
                <div class="w-[8rpx] h-[8rpx] rounded-full mt-[14rpx] mr-[16rpx] flex-shrink-0 bg-[#667eea]"></div>
                <span class="text-[26rpx] text-[#666] leading-[1.6]">{{ item }}</span>
              </div>
            </div>
          </wd-collapse-item>
        </wd-collapse>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.issue-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
}

:deep(.wd-collapse-item__title) {
  font-size: 28rpx;
  font-weight: 500;
}
</style>

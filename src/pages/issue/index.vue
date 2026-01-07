<route lang="json5" type="page">
{
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

const handleBack = () => {
  uni.navigateBack();
};

const faqList = [
  {
    icon: "warn-bold",
    color: "#f43f5e",
    title: "解析失败怎么办？",
    content:
      "首先请确保链接是有效的分享链接。如果视频已被博主删除、设置为私密或审核中，则无法解析。另外，目前仅支持抖音、快手、小红书、微博等主流平台。",
  },
  {
    icon: "download",
    color: "#3b82f6",
    title: "下载失败或无反应？",
    content:
      "部分安卓机型可能存在兼容性问题，建议尝试点击'复制链接'，然后在浏览器中打开下载。iOS用户请留意是否给予了相册权限。",
  },
  {
    icon: "user",
    color: "#10b981",
    title: "豆包去水印教程",
    content:
      "1. 打开豆包APP找到AI图片\n2. 点击分享按钮复制链接\n3. 回到本工具粘贴链接即可提取无水印原图",
  },
  {
    icon: "info-circle",
    color: "#8b5cf6",
    title: "其他问题反馈",
    content:
      "如果遇到其他无法解决的问题，请在'我的'页面点击'联系客服'，我们会尽快为您解答。",
  },
];
</script>
<template>
  <div class="issue-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <!-- 导航栏 -->
    <div
      class="flex items-center justify-between px-[24rpx] z-10 relative"
      :style="{ height: `${navBarHeight}px` }"
    >
      <div class="w-[60rpx] flex items-center" @click="handleBack">
        <div
          class="w-[60rpx] h-[60rpx] rounded-full flex items-center justify-center bg-white/40 backdrop-blur-md active:scale-95 transition-all"
        >
          <wd-icon name="arrow-left" size="20px" color="#1e293b"></wd-icon>
        </div>
      </div>
      <div class="text-[34rpx] font-bold text-[#1e293b]">常见问题</div>
      <div class="w-[60rpx]"></div>
    </div>

    <!-- 内容区域 -->
    <div class="p-[32rpx] relative z-10 pb-[100rpx]">
      <div class="text-[28rpx] text-[#64748b] mb-[40rpx] text-center">
        这里列出了大家最关心的问题
      </div>

      <div class="flex flex-col gap-[24rpx]">
        <div
          v-for="(item, index) in faqList"
          :key="index"
          class="glass-card p-[32rpx] animate-fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="flex items-center mb-[20rpx]">
            <div
              class="w-[64rpx] h-[64rpx] rounded-[16rpx] flex items-center justify-center mr-[20rpx]"
              :style="{ background: `${item.color}15` }"
            >
              <wd-icon
                :name="item.icon"
                size="20px"
                :color="item.color"
              ></wd-icon>
            </div>
            <div class="text-[30rpx] font-bold text-[#1e293b]">
              {{ item.title }}
            </div>
          </div>

          <div
            class="text-[28rpx] text-[#64748b] leading-[1.6] pl-[84rpx] whitespace-pre-line"
          >
            {{ item.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- Background Gradients -->
    <div
      class="absolute top-[-100rpx] right-[-100rpx] w-[500rpx] h-[500rpx] bg-[#fdf2f8] rounded-full blur-[100rpx] -z-10 opacity-60"
    ></div>
    <div
      class="absolute top-[30vh] left-[-100rpx] w-[400rpx] h-[400rpx] bg-[#f0f9ff] rounded-full blur-[100rpx] -z-10 opacity-60"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.issue-container {
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20rpx);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(148, 163, 184, 0.08);
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

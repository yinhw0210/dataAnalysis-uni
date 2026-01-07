<route lang="json5" type="home">
{
  layout: "main",
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed, ref } from "vue";
import useRequest from "@/hooks/useRequest";
import AnalyzeResult from "@/components/Home/AnalyzeResult/index.vue";
import analyzeService from "@/services/analyzeService";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";

const value = ref("");

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

const { data, run } = useRequest(
  async () => await analyzeService.getAnalyzeResult(value.value),
  {
    manual: true,
    onSuccess: () => {
      uni.hideLoading();
    },
    onError: (err) => {
      uni.hideLoading();
      uni.showToast({
        title: err as unknown as string,
        icon: "none",
      });
    },
  }
);

const onHandleAnalyze = async () => {
  if (!value.value.trim()) {
    uni.showToast({ title: "请输入链接", icon: "none" });
    return;
  }
  uni.showLoading({ title: "解析中..." });
  run();
};

const goToDoubao = () => {
  uni.navigateTo({
    url: "/pages/doubao/index",
  });
};

const onPaste = async () => {
  const pasteData = await uni.getClipboardData();
  if (pasteData.data) {
    value.value = pasteData.data;
  }
};

onShareAppMessage(() => {
  return {
    title: "免费去水印，多平台短视频、图片一键去水印。",
    path: "/pages/home/index",
  };
});

onShareTimeline(() => {
  return {
    title: "免费去水印，多平台短视频、图片一键去水印。",
    path: "/pages/home/index",
  };
});
</script>
<template>
  <div class="home-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <div
      class="flex items-center px-[32rpx] text-[#fff] text-[36rpx] font-bold z-10 relative"
      :style="{ height: `${navBarHeight}px` }"
    >
      <div class="flex items-center"><span class="mr-2">✨</span> 去水印</div>
    </div>

    <div
      class="flex flex-col px-[32rpx] overflow-y-auto relative z-10"
      :style="{ height: contentHeight }"
    >
      <!-- Hero Text -->
      <div class="mt-[40rpx] mb-[60rpx] text-center text-white">
        <h1 class="text-[48rpx] font-bold mb-[16rpx] tracking-wide">
          一键去除水印
        </h1>
        <p class="text-[28rpx] opacity-80 font-light">
          支持抖音 / 快手 / 小红书 / 微博等全平台
        </p>
      </div>

      <!-- Main Input Card -->
      <div class="glass-card p-[32rpx] mb-[32rpx] animate-fade-in-up">
        <div class="relative w-full mb-[32rpx]">
          <wd-input
            type="text"
            custom-class="premium-input"
            :no-border="true"
            v-model="value"
            placeholder="粘贴视频或图片链接..."
          />
          <div
            class="absolute right-[16rpx] top-1/2 -translate-y-1/2 text-[#6366f1] text-[26rpx] font-medium py-[8rpx] px-[16rpx] bg-[#eff6ff] rounded-[12rpx]"
            @click="onPaste"
            v-if="!value"
          >
            粘贴
          </div>
        </div>

        <div
          class="w-full h-[96rpx] rounded-[24rpx] flex items-center justify-center shadow-lg transition-all active:scale-95"
          style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
          :style="{ opacity: value ? 1 : 0.8 }"
          @click="onHandleAnalyze"
        >
          <wd-icon
            name="magic"
            size="20px"
            color="#fff"
            class="mr-[12rpx]"
          ></wd-icon>
          <span class="text-white text-[32rpx] font-bold">立即解析</span>
        </div>

        <!-- Supported Platforms Icons -->
        <div class="flex justify-center items-center mt-[32rpx] gap-[24rpx]">
          <image
            src="https://cdn.simpleicons.org/xiaohongshu/ff2442"
            class="w-[52rpx] h-[52rpx] opacity-80 grayscale-[30%]"
            mode="aspectFit"
          />
          <image
            src="https://cdn.simpleicons.org/sinaweibo/E6162D"
            class="w-[52rpx] h-[52rpx] opacity-80 grayscale-[30%]"
            mode="aspectFit"
          />
          <image
            src="https://cdn.simpleicons.org/tiktok/000000"
            class="w-[42rpx] h-[42rpx] opacity-80 grayscale-[30%]"
            mode="aspectFit"
          />
          <image
            src="https://cdn.simpleicons.org/kuaishou/fe4905"
            class="w-[42rpx] h-[42rpx] opacity-80 grayscale-[30%]"
            mode="aspectFit"
          />
        </div>
      </div>

      <!-- Doubao Entry -->
      <div
        class="glass-card flex items-center p-[24rpx] mb-[32rpx] active:scale-98 transition-all"
        @click="goToDoubao"
      >
        <div
          class="w-[80rpx] h-[80rpx] rounded-[20rpx] flex items-center justify-center mr-[24rpx]"
          style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
        >
          <image
            src="https://cdn.simpleicons.org/bytedance/FFFFFF"
            class="w-[40rpx] h-[40rpx]"
            mode="aspectFit"
          />
        </div>
        <div class="flex-1">
          <div class="text-[30rpx] font-bold text-[#1e293b] mb-[4rpx]">
            豆包 AI 去水印
          </div>
          <div class="text-[24rpx] text-[#64748b]">
            提取 AI生成图片无水印原图
          </div>
        </div>
        <wd-icon name="arrow-right" size="18px" color="#94a3b8"></wd-icon>
      </div>

      <!-- 解析结果 -->
      <div v-if="data" class="glass-card p-[24rpx] animate-fade-in-up">
        <AnalyzeResult :data="data" />
      </div>
    </div>

    <!-- Background Elements -->
    <div
      class="absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b from-[#6366f1] via-[#8b5cf6] to-transparent pointer-events-none opacity-20"
    ></div>
    <div
      class="absolute -top-[100rpx] -right-[100rpx] w-[500rpx] h-[500rpx] rounded-full bg-[#ec4899] blur-[120rpx] opacity-20 pointer-events-none"
    ></div>
    <div
      class="absolute top-[200rpx] -left-[100rpx] w-[400rpx] h-[400rpx] rounded-full bg-[#3b82f6] blur-[100rpx] opacity-20 pointer-events-none"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100vh;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20rpx);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(148, 163, 184, 0.1);
}

:deep(.premium-input) {
  width: 100%;
  height: 100rpx;
  background: #f1f5f9;
  border-radius: 20rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  color: #1e293b;
  transition: all 0.3s ease;

  &.wd-input__inner:focus {
    background: #fff;
    box-shadow: 0 0 0 4rpx rgba(99, 102, 241, 0.2);
  }

  .wd-input__body {
    height: 100%;
    background: transparent;
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
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

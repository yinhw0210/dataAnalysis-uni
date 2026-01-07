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
  return `calc(100vh - ${navBarHeight.value}px - ${statusBarHeight.value}px - 100rpx)`;
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
      class="flex items-center px-[32rpx] text-[#fff] text-[36rpx] font-bold"
      :style="{ height: `${navBarHeight}px` }"
    >
      去水印工具
    </div>
    <div
      class="flex flex-col px-[24rpx] overflow-y-auto"
      :style="{ height: contentHeight }"
    >
      <!-- 豆包去水印主功能卡片 -->
      <div
        class="relative rounded-[24rpx] overflow-hidden mb-[24rpx]"
        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        @click="goToDoubao"
      >
        <div class="flex items-center p-[32rpx]">
          <div
            class="w-[88rpx] h-[88rpx] rounded-[20rpx] flex items-center justify-center mr-[24rpx]"
            style="background: rgba(255, 255, 255, 0.2)"
          >
            <image
              src="https://cdn.simpleicons.org/bytedance/FFFFFF"
              class="w-[48rpx] h-[48rpx]"
              mode="aspectFit"
            />
          </div>
          <div class="flex-1">
            <div class="text-[32rpx] font-bold text-white mb-[8rpx]">豆包AI去水印</div>
            <div class="text-[24rpx]" style="color: rgba(255,255,255,0.8)">一键提取豆包AI生成图片的无水印原图</div>
          </div>
          <wd-icon name="arrow-right" size="20px" color="rgba(255,255,255,0.8)"></wd-icon>
        </div>
        <div
          class="absolute top-0 right-[32rpx] text-white text-[22rpx] px-[20rpx] py-[8rpx]"
          style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%); border-radius: 0 0 12rpx 12rpx"
        >
          推荐
        </div>
      </div>

      <!-- 分类标签 -->
      <div class="flex items-center mb-[20rpx] pl-[8rpx]">
        <span class="text-[32rpx] mr-[12rpx]">🎬</span>
        <span class="text-[30rpx] font-bold text-[#333]">短视频去水印</span>
      </div>

      <!-- 短视频去水印区域 -->
      <div class="bg-white rounded-[24rpx] p-[32rpx] mb-[24rpx]">
        <div class="flex justify-center mb-[16rpx]">
          <image src="https://cdn.simpleicons.org/xiaohongshu/white" class="w-[44rpx] h-[44rpx] rounded-[10rpx] mx-[10rpx] p-[6rpx]" style="background: #fe2c55" mode="aspectFit" />
          <image src="https://cdn.simpleicons.org/sinaweibo/E6162D" class="w-[44rpx] h-[44rpx] rounded-[10rpx] mx-[10rpx] p-[6rpx] border border-[#eee]" style="background: #fff" mode="aspectFit" />
          <image src="https://cdn.simpleicons.org/tiktok/white" class="w-[44rpx] h-[44rpx] rounded-[10rpx] mx-[10rpx] p-[6rpx]" style="background: #000" mode="aspectFit" />
          <image src="https://cdn.simpleicons.org/kuaishou/white" class="w-[44rpx] h-[44rpx] rounded-[10rpx] mx-[10rpx] p-[6rpx]" style="background: #fe4905" mode="aspectFit" />
        </div>
        <div class="text-center text-[24rpx] text-[#999] mb-[28rpx]">支持抖音、快手、小红书、微博等平台</div>

        <wd-input
          type="text"
          custom-class="input-box"
          :no-border="true"
          v-model="value"
          placeholder="请粘贴视频/图片分享链接"
        />

        <div
          class="w-full h-[88rpx] rounded-[44rpx] flex items-center justify-center mt-[24rpx]"
          style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          :style="{ opacity: value ? 1 : 0.5 }"
          @click="onHandleAnalyze"
        >
          <span class="text-white text-[30rpx] font-medium">开始解析</span>
        </div>
      </div>

      <!-- 解析结果 -->
      <div v-if="data" class="bg-white rounded-[24rpx] p-[24rpx]">
        <AnalyzeResult :data="data" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 40%, #f5f7fa 40%);
}

:deep(.input-box) {
  width: 100%;
  height: 88rpx;
  border-radius: 16rpx;
  border: 2rpx solid #e8f0fe;
  background: #f8fafc;
  padding: 0 24rpx;
  .wd-input__body {
    height: 100%;
    .wd-input__value {
      height: 100%;
      font-size: 28rpx;
    }
  }
}
</style>

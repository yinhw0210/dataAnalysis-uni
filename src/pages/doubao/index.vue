<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed, ref } from "vue";
import doubaoService, { type DoubaoExtractResult } from "@/services/doubaoService";
import { base64ToTempFilePath } from "@/utils";

const shareUrl = ref("");
const extractResult = ref<DoubaoExtractResult | null>(null);
const isLoading = ref(false);
const downloadingIds = ref<Set<string>>(new Set());

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

const handleBack = () => {
  uni.navigateBack();
};

const handleExtract = async () => {
  if (!shareUrl.value.trim()) {
    uni.showToast({ title: "请输入豆包分享链接", icon: "none" });
    return;
  }

  if (!shareUrl.value.includes("doubao.com")) {
    uni.showToast({ title: "请输入有效的豆包链接", icon: "none" });
    return;
  }

  isLoading.value = true;
  extractResult.value = null;

  try {
    const result = await doubaoService.extract(shareUrl.value.trim());
    extractResult.value = result;
    
    if (result.image_count === 0) {
      uni.showToast({ title: "未找到图片", icon: "none" });
    }
  } catch (error: any) {
    uni.showToast({ title: error || "提取失败", icon: "none" });
  } finally {
    isLoading.value = false;
  }
};

const handleDownload = async (image: DoubaoExtractResult["images"][0]) => {
  if (downloadingIds.value.has(image.id)) return;
  
  downloadingIds.value.add(image.id);
  
  try {
    uni.showLoading({ title: "下载中..." });
    
    const result = await doubaoService.download(image.original_url, `doubao_${image.id}.png`);
    const tempFilePath = await base64ToTempFilePath(result.image_base64);
    
    uni.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        uni.showToast({ title: "保存成功", icon: "success" });
      },
      fail: () => {
        uni.showToast({ title: "保存失败", icon: "none" });
      },
    });
  } catch (error: any) {
    uni.showToast({ title: error || "下载失败", icon: "none" });
  } finally {
    uni.hideLoading();
    downloadingIds.value.delete(image.id);
  }
};

const handleDownloadAll = async () => {
  if (!extractResult.value?.images.length) return;
  
  for (const image of extractResult.value.images) {
    await handleDownload(image);
  }
};

const handlePreview = (url: string) => {
  if (!extractResult.value) return;
  uni.previewImage({
    current: url,
    urls: extractResult.value.images.map(i => i.original_url),
  });
};

const handleClear = () => {
  shareUrl.value = "";
  extractResult.value = null;
};

const handlePaste = () => {
  uni.getClipboardData({
    success: (res) => {
      if (res.data) {
        shareUrl.value = res.data;
        uni.showToast({ title: "已粘贴", icon: "none", duration: 1000 });
      }
    },
  });
};
</script>
<template>
  <div class="home-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <!-- 导航栏 -->
    <div
      class="flex items-center justify-between px-[24rpx]"
      :style="{ height: `${navBarHeight}px` }"
    >
      <div class="w-[60rpx] flex items-center" @click="handleBack">
        <wd-icon name="arrow-left" size="20px" color="#333"></wd-icon>
      </div>
      <div class="text-[34rpx] font-bold text-[#333]">豆包去水印</div>
      <div class="w-[60rpx]"></div>
    </div>

    <!-- 内容区域 -->
    <div
      class="flex flex-col px-[24rpx] overflow-y-auto"
      :style="{ height: contentHeight }"
    >
      <!-- 输入卡片 -->
      <div class="bg-white rounded-[20rpx] p-[28rpx] mb-[24rpx] shadow-sm">
        <div class="flex items-center mb-[24rpx]">
          <div
            class="w-[72rpx] h-[72rpx] rounded-[16rpx] flex items-center justify-center mr-[20rpx]"
            style="background: linear-gradient(135deg, #e8f3ff 0%, #d4e8ff 100%)"
          >
            <image src="https://cdn.simpleicons.org/bytedance/3C8CFF" class="w-[40rpx] h-[40rpx]" mode="aspectFit" />
          </div>
          <div class="flex-1">
            <div class="text-[30rpx] font-bold text-[#333] mb-[4rpx]">豆包AI图片提取</div>
            <div class="text-[24rpx] text-[#999]">粘贴分享链接，一键获取无水印原图</div>
          </div>
        </div>

        <div class="relative mb-[20rpx]">
          <textarea
            v-model="shareUrl"
            class="w-full h-[140rpx] bg-[#f8fafc] border-[2rpx] border-[#e8f0fe] rounded-[12rpx] p-[20rpx] text-[28rpx] text-[#333]"
            placeholder="请粘贴豆包分享链接"
            :maxlength="500"
          />
          <div class="absolute right-[12rpx] bottom-[12rpx] flex items-center">
            <div
              class="px-[20rpx] py-[10rpx] rounded-[20rpx] bg-[#f0f7ff] text-[24rpx] text-[#3C8CFF]"
              @click="handlePaste"
            >
              粘贴
            </div>
            <div
              v-if="shareUrl"
              class="ml-[12rpx] px-[14rpx] py-[10rpx] rounded-[20rpx] bg-[#f5f5f5]"
              @click="handleClear"
            >
              <wd-icon name="close" size="14px" color="#999"></wd-icon>
            </div>
          </div>
        </div>

        <div
          class="w-full h-[88rpx] rounded-[44rpx] flex items-center justify-center"
          style="background: linear-gradient(135deg, #3C8CFF 0%, #5B9FFF 100%)"
          :style="{ opacity: (!shareUrl.trim() || isLoading) ? 0.5 : 1 }"
          @click="handleExtract"
        >
          <span class="text-white text-[30rpx] font-medium">{{ isLoading ? '提取中...' : '开始提取' }}</span>
        </div>
      </div>

      <!-- 结果区域 -->
      <template v-if="extractResult?.images?.length">
        <div class="flex items-center justify-between mb-[20rpx]">
          <div class="text-[30rpx] font-bold text-[#333]">提取结果 ({{ extractResult.image_count }}张)</div>
          <div
            class="px-[20rpx] py-[10rpx] rounded-[20rpx] bg-[#f0f7ff] text-[24rpx] text-[#3C8CFF]"
            @click="handleDownloadAll"
          >
            全部下载
          </div>
        </div>

        <div class="grid grid-cols-2 gap-[16rpx]">
          <div
            v-for="image in extractResult.images"
            :key="image.id"
            class="bg-white rounded-[16rpx] overflow-hidden shadow-sm"
          >
            <image
              :src="image.original_url"
              mode="aspectFill"
              class="w-full h-[240rpx]"
              @click="handlePreview(image.original_url)"
            />
            <div class="flex items-center justify-between p-[16rpx] bg-[#fafafa]">
              <span class="text-[22rpx] text-[#999]">{{ image.width }}×{{ image.height }}</span>
              <div
                class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center"
                style="background: linear-gradient(135deg, #3C8CFF 0%, #5B9FFF 100%)"
                @click.stop="handleDownload(image)"
              >
                <wd-icon name="download" size="14px" color="#fff"></wd-icon>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 空状态 -->
      <template v-else-if="!isLoading">
        <div class="flex flex-col items-center py-[60rpx]">
          <div class="text-[28rpx] text-[#999] mb-[40rpx]">粘贴豆包分享链接开始提取</div>
          <div class="w-full bg-white rounded-[16rpx] p-[28rpx]">
            <div class="flex items-center mb-[20rpx]">
              <div
                class="w-[36rpx] h-[36rpx] rounded-full flex items-center justify-center mr-[16rpx] text-white text-[22rpx]"
                style="background: linear-gradient(135deg, #3C8CFF 0%, #5B9FFF 100%)"
              >1</div>
              <span class="text-[26rpx] text-[#666]">打开豆包APP，找到AI生成的图片</span>
            </div>
            <div class="flex items-center mb-[20rpx]">
              <div
                class="w-[36rpx] h-[36rpx] rounded-full flex items-center justify-center mr-[16rpx] text-white text-[22rpx]"
                style="background: linear-gradient(135deg, #3C8CFF 0%, #5B9FFF 100%)"
              >2</div>
              <span class="text-[26rpx] text-[#666]">点击分享，复制链接</span>
            </div>
            <div class="flex items-center">
              <div
                class="w-[36rpx] h-[36rpx] rounded-full flex items-center justify-center mr-[16rpx] text-white text-[22rpx]"
                style="background: linear-gradient(135deg, #3C8CFF 0%, #5B9FFF 100%)"
              >3</div>
              <span class="text-[26rpx] text-[#666]">粘贴到上方输入框，点击提取</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #f0f7ff 0%, #f5f7fa 30%);
}

.shadow-sm {
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}
</style>

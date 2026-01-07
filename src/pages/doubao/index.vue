<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed, ref } from "vue";
import doubaoService, {
  type DoubaoExtractResult,
} from "@/services/doubaoService";
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

    const result = await doubaoService.download(
      image.original_url,
      `doubao_${image.id}.png`
    );
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
    urls: extractResult.value.images.map((i) => i.original_url),
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
  <div class="doubao-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <!-- 导航栏 -->
    <div
      class="flex items-center justify-between px-[24rpx] z-10 relative"
      :style="{ height: `${navBarHeight}px` }"
    >
      <div class="w-[60rpx] flex items-center" @click="handleBack">
        <div
          class="w-[60rpx] h-[60rpx] rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md active:scale-95 transition-all"
        >
          <wd-icon name="arrow-left" size="20px" color="#1e293b"></wd-icon>
        </div>
      </div>
      <div class="text-[34rpx] font-bold text-[#1e293b]">豆包 AI 去水印</div>
      <div class="w-[60rpx]"></div>
    </div>

    <!-- 内容区域 -->
    <div
      class="flex flex-col px-[32rpx] overflow-y-auto relative z-10"
      :style="{ height: contentHeight }"
    >
      <!-- 输入卡片 -->
      <div
        class="glass-card p-[32rpx] mb-[32rpx] mt-[20rpx] animate-fade-in-up"
      >
        <div class="flex items-center mb-[32rpx]">
          <div
            class="w-[88rpx] h-[88rpx] rounded-[24rpx] flex items-center justify-center mr-[24rpx] shadow-lg"
            style="
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            "
          >
            <image
              src="https://cdn.simpleicons.org/bytedance/FFFFFF"
              class="w-[48rpx] h-[48rpx]"
              mode="aspectFit"
            />
          </div>
          <div class="flex-1">
            <div class="text-[32rpx] font-bold text-[#1e293b] mb-[4rpx]">
              图片提取
            </div>
            <div class="text-[26rpx] text-[#64748b]">
              获取 AI生成图片无水印原图
            </div>
          </div>
        </div>

        <div class="relative w-full mb-[32rpx]">
          <wd-input
            type="text"
            custom-class="premium-input"
            :no-border="true"
            v-model="shareUrl"
            placeholder="请粘贴豆包分享链接..."
          />
          <div
            class="absolute right-[16rpx] top-1/2 -translate-y-1/2 flex items-center gap-[12rpx]"
          >
            <div
              v-if="shareUrl"
              class="w-[48rpx] h-[48rpx] rounded-full bg-gray-100 flex items-center justify-center active:scale-95"
              @click="handleClear"
            >
              <wd-icon name="close" size="14px" color="#94a3b8"></wd-icon>
            </div>
            <div
              class="text-[#3b82f6] text-[26rpx] font-medium py-[8rpx] px-[16rpx] bg-[#eff6ff] rounded-[12rpx] active:scale-95"
              @click="handlePaste"
            >
              粘贴
            </div>
          </div>
        </div>

        <div
          class="w-full h-[96rpx] rounded-[24rpx] flex items-center justify-center shadow-lg transition-all active:scale-95"
          style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
          :style="{ opacity: !shareUrl.trim() || isLoading ? 0.6 : 1 }"
          @click="handleExtract"
        >
          <wd-icon
            v-if="isLoading"
            name="loading"
            size="20px"
            color="#fff"
            class="animate-spin mr-[12rpx]"
          ></wd-icon>
          <span class="text-white text-[32rpx] font-bold">{{
            isLoading ? "正在提取..." : "一键提取"
          }}</span>
        </div>
      </div>

      <!-- 结果区域 -->
      <template v-if="extractResult?.images?.length">
        <div
          class="flex items-center justify-between mb-[24rpx] animate-fade-in-up"
          style="animation-delay: 0.1s"
        >
          <div class="text-[32rpx] font-bold text-[#1e293b]">
            提取结果
            <span class="text-[#64748b] text-[26rpx] font-normal ml-[8rpx]"
              >{{ extractResult.image_count }}张</span
            >
          </div>
          <div
            class="px-[24rpx] py-[12rpx] rounded-[16rpx] bg-[#eff6ff] text-[26rpx] font-medium text-[#3b82f6] active:scale-95 transition-all"
            @click="handleDownloadAll"
          >
            全部下载
          </div>
        </div>

        <div
          class="grid grid-cols-2 gap-[24rpx] animate-fade-in-up"
          style="animation-delay: 0.2s"
        >
          <div
            v-for="(image, index) in extractResult.images"
            :key="image.id"
            class="bg-white rounded-[24rpx] overflow-hidden shadow-sm border border-gray-100 group relative"
          >
            <div
              class="relative w-full h-[300rpx]"
              @click="handlePreview(image.original_url)"
            >
              <image
                :src="image.original_url"
                mode="aspectFill"
                class="w-full h-full"
              />
              <div
                class="absolute top-[16rpx] left-[16rpx] backdrop-blur-md bg-black/30 px-[12rpx] py-[6rpx] rounded-[8rpx] text-white text-[20rpx]"
              >
                Image {{ index + 1 }}
              </div>
            </div>

            <div class="p-[16rpx]">
              <div class="flex items-center justify-between mb-[16rpx]">
                <span class="text-[22rpx] text-[#94a3b8] font-medium"
                  >{{ image.width }} × {{ image.height }}</span
                >
              </div>
              <div
                class="w-full h-[72rpx] rounded-[16rpx] flex items-center justify-center text-white text-[26rpx] font-medium active:scale-95 transition-all"
                style="
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                "
                @click.stop="handleDownload(image)"
              >
                下载原图
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- 空状态 / 使用指南 -->
      <template v-else-if="!isLoading">
        <div
          class="mt-[40rpx] animate-fade-in-up"
          style="animation-delay: 0.2s"
        >
          <div
            class="text-[28rpx] text-[#64748b] mb-[32rpx] text-center font-medium"
          >
            使用指南
          </div>
          <div class="glass-card p-[32rpx] space-y-[40rpx]">
            <div class="flex items-start">
              <div
                class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center mr-[24rpx] text-white text-[24rpx] font-bold shadow-md shrink-0"
                style="
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                "
              >
                1
              </div>
              <div class="flex-1 pt-[4rpx]">
                <div class="text-[28rpx] text-[#1e293b] font-medium mb-[4rpx]">
                  打开豆包 APP
                </div>
                <div class="text-[24rpx] text-[#94a3b8]">
                  找到 AI 生成的图片页面
                </div>
              </div>
            </div>

            <div class="flex items-start">
              <div
                class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center mr-[24rpx] text-white text-[24rpx] font-bold shadow-md shrink-0"
                style="
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                "
              >
                2
              </div>
              <div class="flex-1 pt-[4rpx]">
                <div class="text-[28rpx] text-[#1e293b] font-medium mb-[4rpx]">
                  复制分享链接
                </div>
                <div class="text-[24rpx] text-[#94a3b8]">
                  点击分享按钮，选择"复制链接"
                </div>
              </div>
            </div>

            <div class="flex items-start">
              <div
                class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center mr-[24rpx] text-white text-[24rpx] font-bold shadow-md shrink-0"
                style="
                  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                "
              >
                3
              </div>
              <div class="flex-1 pt-[4rpx]">
                <div class="text-[28rpx] text-[#1e293b] font-medium mb-[4rpx]">
                  粘贴并提取
                </div>
                <div class="text-[24rpx] text-[#94a3b8]">
                  返回本页面粘贴链接，点击一键提取
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Background Gradients -->
    <div
      class="absolute top-0 right-0 w-[500rpx] h-[500rpx] bg-[#eff6ff] rounded-full blur-[80rpx] -z-10 opacity-60"
    ></div>
    <div
      class="absolute bottom-[200rpx] left-[-100rpx] w-[400rpx] h-[400rpx] bg-[#f0f9ff] rounded-full blur-[100rpx] -z-10 opacity-50"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.doubao-container {
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
  font-size: 28rpx;
  color: #1e293b;
  transition: all 0.3s ease;

  &.wd-input__inner:focus {
    background: #fff;
    box-shadow: 0 0 0 4rpx rgba(59, 130, 246, 0.2);
  }

  .wd-input__body {
    height: 100%;
    background: transparent;
  }
}

.animate-fade-in-up {
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

.shadow-lg {
  box-shadow: 0 10rpx 25rpx -5rpx rgba(59, 130, 246, 0.4);
}
</style>

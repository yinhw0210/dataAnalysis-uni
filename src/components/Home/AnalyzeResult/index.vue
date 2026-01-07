<script setup lang="ts">
import { useToast } from "wot-design-uni";
import { computed, ref } from "vue";
import VideoPlayer from "@/components/VideoPlayer/index.vue";

enum ImageType {
  ORIGINAL = "original",
  LIVE = "live",
}

const toast = useToast();

const props = defineProps<{
  data: API.Analyze.AnalyzeResult;
}>();

const imageType = ref<ImageType>(ImageType.ORIGINAL);

const renderType = computed(() => {
  return props?.data?.video ? "video" : "image";
});

const onHandleDownload = (item: string) => {
  uni.showLoading({ title: "下载中..." });
  uni.downloadFile({
    url: `https://www.solitude.top/download.php?url=${item}`,
    success: (res) => {
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: () => {
          uni.hideLoading();
          toast.success("保存成功");
        },
        fail: () => {
          toast.show("不支持的下载类型，请复制链接到浏览器下载");
          uni.hideLoading();
        },
      });
    },
    fail: () => {
      toast.show("不支持的下载类型，请复制链接到浏览器下载");
      uni.hideLoading();
    },
  });
};

const onHandleCopyLink = (item: string) => {
  uni.setClipboardData({
    data: item,
    success: () => {
      toast.success("已复制");
    },
  });
};

const onPreviewImage = (current: string) => {
  uni.previewImage({
    current,
    urls: props.data?.image_list || [],
  });
};
</script>
<template>
  <div class="result-container">
    <div
      class="text-[30rpx] font-bold mb-[24rpx] text-[#1e293b]"
      v-if="data.title"
    >
      {{ data.title }}
    </div>

    <template v-if="renderType === 'video'">
      <div class="rounded-[24rpx] overflow-hidden shadow-sm">
        <VideoPlayer :src="data?.video" :poster="data?.image_list[0]" />
      </div>
      <div class="flex mt-[24rpx] gap-[16rpx]">
        <div
          class="flex-1 h-[88rpx] rounded-[24rpx] flex items-center justify-center text-white text-[28rpx] font-medium transition-all active:scale-95"
          style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
          @click="onHandleDownload(data?.video)"
        >
          保存视频
        </div>
        <div
          class="flex-1 h-[88rpx] rounded-[24rpx] flex items-center justify-center text-[#6366f1] text-[28rpx] font-medium bg-[#eff6ff] transition-all active:scale-95"
          @click="onHandleCopyLink(data?.video)"
        >
          复制链接
        </div>
      </div>
    </template>

    <template v-else>
      <!-- Toggle Switch for Live Photos -->
      <div
        class="flex p-[8rpx] bg-[#f1f5f9] rounded-[20rpx] mb-[24rpx] w-fit"
        v-if="data?.live_list?.length > 1"
      >
        <div
          class="px-[32rpx] py-[12rpx] rounded-[16rpx] text-[26rpx] font-medium transition-all duration-300"
          :class="
            imageType === ImageType.ORIGINAL
              ? 'bg-white text-[#6366f1] shadow-sm'
              : 'text-[#64748b]'
          "
          @click="imageType = ImageType.ORIGINAL"
        >
          图片
        </div>
        <div
          class="px-[32rpx] py-[12rpx] rounded-[16rpx] text-[26rpx] font-medium transition-all duration-300"
          :class="
            imageType === ImageType.LIVE
              ? 'bg-white text-[#6366f1] shadow-sm'
              : 'text-[#64748b]'
          "
          @click="imageType = ImageType.LIVE"
        >
          Live图
        </div>
      </div>

      <!-- Live图列表 -->
      <div
        class="grid grid-cols-2 gap-[16rpx]"
        v-if="imageType === ImageType.LIVE"
      >
        <div
          class="bg-white rounded-[24rpx] overflow-hidden shadow-sm border border-gray-100"
          v-for="item in data?.live_list"
          :key="item"
        >
          <VideoPlayer :src="item" height="280rpx" :controls="false" />
          <div class="flex p-[16rpx] gap-[12rpx]">
            <div
              class="flex-1 h-[64rpx] rounded-[16rpx] flex items-center justify-center text-white text-[24rpx] font-medium"
              style="
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              "
              @click="onHandleDownload(item)"
            >
              保存
            </div>
            <div
              class="flex-1 h-[64rpx] rounded-[16rpx] flex items-center justify-center text-[#6366f1] text-[24rpx] font-medium bg-[#eff6ff]"
              @click="onHandleCopyLink(item)"
            >
              链接
            </div>
          </div>
        </div>
      </div>

      <!-- 图片列表 -->
      <div
        class="grid grid-cols-2 gap-[16rpx]"
        v-if="imageType === ImageType.ORIGINAL"
      >
        <div
          class="bg-white rounded-[24rpx] overflow-hidden shadow-sm border border-gray-100 group"
          v-for="(item, index) in data?.image_list"
          :key="item"
        >
          <div class="relative w-full h-[280rpx]" @click="onPreviewImage(item)">
            <image :src="item" class="w-full h-full" mode="aspectFill" />
            <div
              class="absolute top-[12rpx] left-[12rpx] w-[40rpx] h-[40rpx] rounded-full flex items-center justify-center text-white text-[24rpx] font-medium backdrop-blur-sm"
              style="background: rgba(0, 0, 0, 0.4)"
            >
              {{ index + 1 }}
            </div>
          </div>
          <div class="flex p-[16rpx] gap-[12rpx]">
            <div
              class="flex-1 h-[64rpx] rounded-[16rpx] flex items-center justify-center text-white text-[24rpx] font-medium transition-all active:scale-95"
              style="
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              "
              @click="onHandleDownload(item)"
            >
              保存
            </div>
            <div
              class="flex-1 h-[64rpx] rounded-[16rpx] flex items-center justify-center text-[#6366f1] text-[24rpx] font-medium bg-[#eff6ff] transition-all active:scale-95"
              @click="onHandleCopyLink(item)"
            >
              链接
            </div>
          </div>
        </div>
      </div>
      <wd-toast />
    </template>
  </div>
</template>
<style lang="scss" scoped>
.shadow-sm {
  box-shadow: 0 4rpx 12rpx rgba(148, 163, 184, 0.1);
}
</style>

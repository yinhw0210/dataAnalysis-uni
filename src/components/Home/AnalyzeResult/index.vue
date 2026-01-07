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
  <template>
    <div class="text-[28rpx] font-bold mb-[20rpx]" v-if="data.title">
      {{ data.title }}
    </div>
  </template>
  <template v-if="renderType === 'video'">
    <VideoPlayer :src="data?.video" :poster="data?.image_list[0]" />
  </template>
  <template v-else>
    <div class="flex mb-[20rpx]" v-if="data?.live_list?.length > 1">
      <div
        class="px-[24rpx] py-[12rpx] rounded-[20rpx] mr-[16rpx] text-[26rpx]"
        :class="imageType === ImageType.ORIGINAL ? 'text-white' : 'text-[#666] bg-[#f5f7fa]'"
        :style="imageType === ImageType.ORIGINAL ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : ''"
        @click="imageType = ImageType.ORIGINAL"
      >
        图片
      </div>
      <div
        class="px-[24rpx] py-[12rpx] rounded-[20rpx] text-[26rpx]"
        :class="imageType === ImageType.LIVE ? 'text-white' : 'text-[#666] bg-[#f5f7fa]'"
        :style="imageType === ImageType.LIVE ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : ''"
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
        class="bg-white rounded-[12rpx] overflow-hidden shadow-sm"
        v-for="item in data?.live_list"
        :key="item"
      >
        <VideoPlayer :src="item" height="240rpx" :controls="false" />
      </div>
    </div>

    <!-- 图片列表 -->
    <div
      class="grid grid-cols-2 gap-[16rpx]"
      v-if="imageType === ImageType.ORIGINAL"
    >
      <div
        class="bg-white rounded-[12rpx] overflow-hidden shadow-sm"
        v-for="(item, index) in data?.image_list"
        :key="item"
      >
        <div class="relative w-full h-[240rpx]" @click="onPreviewImage(item)">
          <image :src="item" class="w-full h-full" mode="aspectFill" />
          <div class="absolute top-[8rpx] left-[8rpx] w-[36rpx] h-[36rpx] rounded-full flex items-center justify-center text-white text-[22rpx]" style="background: rgba(0,0,0,0.5)">
            {{ index + 1 }}
          </div>
        </div>
        <div class="flex p-[12rpx] gap-[8rpx]">
          <div
            class="flex-1 h-[52rpx] rounded-[26rpx] flex items-center justify-center text-white text-[24rpx]"
            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            @click="onHandleDownload(item)"
          >
            下载
          </div>
          <div
            class="flex-1 h-[52rpx] rounded-[26rpx] flex items-center justify-center text-[#667eea] text-[24rpx] bg-[#f0f4ff]"
            @click="onHandleCopyLink(item)"
          >
            复制
          </div>
        </div>
      </div>
    </div>
    <wd-toast />
  </template>
</template>
<style lang="scss" scoped>
.shadow-sm {
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}
</style>

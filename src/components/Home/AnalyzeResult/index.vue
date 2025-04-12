<script setup lang="ts">
import { computed, ref } from "vue";
import { useToast } from "wot-design-uni";
import VideoPlayer from "@/components/VideoPlayer/index.vue";
const toast = useToast();

enum ImageType {
  ORIGINAL = "original",
  LIVE = "live",
}

const props = defineProps<{
  data: API.Analyze.AnalyzeResult;
}>();

const imageType = ref<ImageType>(ImageType.ORIGINAL);

const renderType = computed(() => {
  return props?.data?.video ? "video" : "image";
});

const onHandleDownload = (item: string) => {
  uni.showLoading({
    title: "初始化资源...",
  });
  uni.downloadFile({
    url: item,
    success: (res) => {
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (res) => {
          uni.hideLoading();
        },
        fail: (err) => {
          uni.hideLoading();
        },
      });
    },
    fail: (err) => {
      uni.hideLoading();
    },
  });
};

const onHandleCopyLink = (item: string) => {
  uni.setClipboardData({
    data: item,
  });
};
</script>
<template>
  <template>
    <div class="text-[32rpx] font-bold mb-[20rpx] px-[28rpx]">
      {{ data.title }}
    </div>
  </template>
  <template v-if="renderType === 'video'">
    <VideoPlayer :src="data?.video" :poster="data?.image_list[0]" />
  </template>
  <template v-else>
    <div class="px-[28rpx] mb-[20rpx]" v-if="data?.live_list.length > 1">
      <wd-radio-group v-model="imageType" shape="button">
        <wd-radio :value="ImageType.ORIGINAL">图片</wd-radio>
        <wd-radio :value="ImageType.LIVE">live图</wd-radio>
      </wd-radio-group>
    </div>
    <div
      class="grid-cols-2 justify-center justify-items-center gap-y-[20rpx]"
      :style="{
        display: imageType === ImageType.LIVE ? 'grid' : 'none',
      }"
    >
      <div
        class="flex flex-col rounded-[16rpx] shadow-lg"
        v-for="item in data?.live_list"
        :key="item"
      >
        <div class="size-full w-[320rpx] min-h-[320rpx] p-[4rpx] rounded-[16rpx]">
          <VideoPlayer :src="item" height="320rpx" :controls="false" />
        </div>
      </div>
    </div>
    <div
      class="none grid-cols-2 justify-center justify-items-center gap-y-[20rpx]"
      :style="{
        display: imageType === ImageType.ORIGINAL ? 'grid' : 'none',
      }"
    >
      <div
        class="flex flex-col rounded-[16rpx] shadow-lg"
        v-for="item in data?.image_list"
        :key="item"
      >
        <div class="size-full w-[320rpx] h-[320rpx] p-[4rpx] rounded-[16rpx]">
          <image :src="item" class="size-full" mode="aspectFit" />
        </div>
        <div class="h-[80rpx] flex justify-center items-center gap-[10rpx]">
          <div
            class="w-[130rpx] h-[56rpx] flex justify-center items-center bg-[#3250ff] text-[#fff] text-[24rpx] font-bold rounded-[10rpx]"
            @click="onHandleDownload(item)"
          >
            下载
          </div>
          <div
            class="w-[130rpx] h-[56rpx] flex justify-center items-center bg-[#3250ff] text-[#fff] text-[24rpx] font-bold rounded-[10rpx]"
            @click="onHandleCopyLink(item)"
          >
            复制链接
          </div>
        </div>
        <!-- <div class="mb-[20rpx] flex justify-center items-center">
          <div
            class="w-[270rpx] h-[56rpx] flex justify-center items-center bg-[#3250ff] text-[#fff] text-[24rpx] font-bold rounded-[10rpx]"
          >
            下载live图
          </div>
        </div> -->
      </div>
    </div>
    <wd-toast />
  </template>
</template>
<style lang="scss" scoped></style>

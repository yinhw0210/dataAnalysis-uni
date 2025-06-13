<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed } from "vue";
import { PHOTO_SIZE_LIST } from "@/constant/photo";
import { DisposeTypeEnum } from "@/enum";
import { usePhotoStore } from "@/store/modules/photo";

const photoStore = usePhotoStore();

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

const handleClick = (key: string) => {
  uni.navigateTo({
    url: `/pages/generate/index?key=${key}`,
  });
};

const onHandleCutout = (type: DisposeTypeEnum) => {
  uni.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"],
    sourceType: ["album"],
    success: (res) => {
      const kb = res.tempFiles[0].size / 1024;
      photoStore.setUrl(res.tempFilePaths[0]);
      photoStore.setKb(kb);
      uni.navigateTo({
        url: `/pages/photoDispose/index?type=${type}`,
      });
    },
  });
};
</script>
<template>
  <div class="home-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <div
      class="pt-[320rpx] flex flex-col"
      :style="{
        height: contentHeight,
      }"
    >
      <div class="h-full flex flex-col bg-[rgba(194,234,251,0.4)]">
        <div
          class="h-[420rpx] grid grid-cols-2 grid-rows-2 gap-[16rpx] px-[16rpx] py-[24rpx]"
        >
          <div
            class="row-span-2 flex flex-col items-center bg-white shadow-md rounded-[24rpx] p-[16rpx]"
            @click="handleClick('1')"
          >
            <img
              src="https://img.picui.cn/free/2025/06/04/683fc00022f41.png"
              class="h-[300rpx] w-[212rpx]"
              alt=""
            />
            <div class="text-center text-[28rpx] mt-[8rpx]">
              一寸照
              <span class="text-[24rpx] text-[#a9a0a0]"> (413*295) </span>
            </div>
          </div>
          <div
            class="shadow-md bg-white rounded-[24rpx]"
            :style="{
              backgroundImage: `url('https://img.picui.cn/free/2025/06/06/68424b2e99868.png')`,
              backgroundSize: '100%',
              backgroundPosition: 'center',
            }"
            @click="
              () => {
                onHandleCutout(DisposeTypeEnum.CUTOUT);
              }
            "
          ></div>
          <div
            class="shadow-md bg-white rounded-[24rpx]"
            :style="{
              backgroundImage: `url('https://img.picui.cn/free/2025/06/12/684a9a2d6f503.png')`,
              backgroundSize: '100%',
              backgroundPosition: 'center',
            }"
            @click="
              () => {
                onHandleCutout(DisposeTypeEnum.IMAGE_SIZE_MODIFY);
              }
            "
          ></div>
        </div>
        <div
          class="flex-1 flex flex-col px-[16rpx] py-[24rpx] overflow-hidden bg-white rounded-t-[24rpx]"
        >
          <div
            class="h-[100rpx] py-[16rpx] px-[26rpx] flex items-center font-bold text-[32rpx] mb-[16rpx] border-b border-[#e5e5e5]"
          >
            更多尺寸
          </div>
          <div class="flex-1 overflow-hidden">
            <div class="h-full overflow-y-auto">
              <div class="flex flex-col gap-[16rpx]">
                <div
                  v-for="item in PHOTO_SIZE_LIST.slice(1)"
                  :key="item.key"
                  class="h-[100rpx] bg-white py-[16rpx] px-[26rpx] items-center flex justify-between border-b border-[#e5e5e5]"
                  @click="handleClick(item.key)"
                >
                  {{ item.label }}
                  <wd-icon name="arrow-right" size="22px"></wd-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  background: url(https://img.picui.cn/free/2025/05/27/68352d8cdbf3a.png)
    no-repeat;
  background-size: contain;
}
</style>

<route lang="json5" type="home">
{
  layout: "main",
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed } from "vue";
import { usePuzzleStore } from "@/store/modules/puzzle";
import { nanoid } from "nanoid/non-secure";
import { useSudokuStore } from "@/store/modules/sudoku";
import { useRemoveStore } from "@/store/modules/remove";

const puzzleStore = usePuzzleStore();
const sudokuStore = useSudokuStore();
const removeStore = useRemoveStore();

const tools = [
  {
    label: "排版拼图",
    iconName: "image",
    desc: "多张图片一键合成任意模板",
    key: "1",
    bgColor: "#f0f4ff",
    iconBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    path: "puzzle",
  },
  {
    label: "切分九宫格",
    iconName: "apps",
    desc: "一张图片分割多张",
    key: "2",
    bgColor: "#e8faf5",
    iconBg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    path: "sudoku",
  },
  {
    label: "智能证件照",
    iconName: "user",
    desc: "一键生成证件照",
    key: "3",
    bgColor: "#fff5eb",
    iconBg: "linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)",
  },
  {
    label: "智能消除",
    iconName: "close",
    desc: "涂抹消除不需要的元素",
    key: "4",
    bgColor: "#fff0f5",
    iconBg: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
  },
];

const statusBarHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight ?? 0;
});

const navBarHeight = computed(() => {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  return (
    menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight.value) * 2
  );
});

const handleClick = (item: any) => {
  if (item.key === "3") {
    uni.navigateTo({ url: `/pages/photo/photo` });
    return;
  }
  const count = item.key === "1" ? 16 : 1;
  uni.chooseMedia({
    count: count,
    mediaType: ["image"],
    sourceType: ["album"],
    success: async (res) => {
      const mediaInfoList: any[] = [];
      const promiseList = res.tempFiles.map((file) => {
        return new Promise((resolve) => {
          uni.getImageInfo({
            src: file.tempFilePath,
            success: (imageRes) => {
              resolve({
                id: nanoid(),
                url: file.tempFilePath,
                width: imageRes.width,
                height: imageRes.height,
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                scale: 1,
              });
            },
            fail: () => {
              resolve({
                id: nanoid(),
                url: file.tempFilePath,
                width: 0,
                height: 0,
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                scale: 1,
              });
            },
          });
        });
      });
      try {
        mediaInfoList.push(...(await Promise.all(promiseList)));
        if (item.key === "1" && mediaInfoList.length === 1) {
          uni.showToast({ title: "请选择多张图片", icon: "none" });
          return;
        }
        if (item.key === "1") {
          puzzleStore.setImageList(mediaInfoList);
          uni.navigateTo({ url: `/pages/puzzle/${item.path}` });
        }
        if (item.key === "2") {
          sudokuStore.setSudokuInfo(mediaInfoList[0]);
          uni.navigateTo({ url: `/pages/sudoku/${item.path}` });
        }
        if (item.key === "4") {
          removeStore.setImageInfo(mediaInfoList[0]);
          uni.navigateTo({ url: `/pages/remove/index` });
        }
      } catch (error) {
        console.error("处理图片信息时出错:", error);
      }
    },
  });
};
</script>
<template>
  <div class="home-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <div
      class="flex items-center px-[32rpx] text-[#fff] text-[36rpx] font-bold"
      :style="{ height: `${navBarHeight}px` }"
    >
      图片工具箱
    </div>
    <div
      class="absolute inset-0 flex flex-col gap-[20rpx] p-[24rpx] pt-[32rpx] bg-[#f5f7fa] rounded-t-[40rpx]"
      :style="{ top: `${statusBarHeight + navBarHeight + 60}px` }"
    >
      <div class="flex items-center mb-[8rpx] pl-[8rpx]">
        <span class="text-[32rpx] mr-[12rpx]">🛠️</span>
        <span class="text-[30rpx] font-bold text-[#333]">常用工具</span>
      </div>

      <div
        v-for="item in tools"
        :key="item.key"
        class="flex items-center p-[24rpx] rounded-[20rpx]"
        :style="{ background: item.bgColor }"
        @click="handleClick(item)"
      >
        <div
          class="w-[80rpx] h-[80rpx] rounded-[18rpx] flex items-center justify-center mr-[24rpx]"
          :style="{ background: item.iconBg }"
        >
          <wd-icon :name="item.iconName" size="22px" color="#fff"></wd-icon>
        </div>
        <div class="flex-1 overflow-hidden">
          <div class="text-[30rpx] font-bold text-[#333] mb-[6rpx]">{{ item.label }}</div>
          <div class="text-[24rpx] text-[#999] truncate">{{ item.desc }}</div>
        </div>
        <wd-icon name="arrow-right" size="16px" color="#ccc"></wd-icon>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}
</style>

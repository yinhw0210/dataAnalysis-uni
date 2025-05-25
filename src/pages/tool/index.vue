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
const puzzleStore = usePuzzleStore();
import { useSudokuStore } from "@/store/modules/sudoku";
const sudokuStore = useSudokuStore();
import { useToast } from "wot-design-uni";

const toast = useToast();

const info = [
  {
    label: "排版拼图",
    icon: "https://img.picui.cn/free/2025/05/23/683009e0409b9.png",
    desc: "多张图片一键合成任意模板",
    key: "1",
    iconColor: "#72b8f9",
    path: "puzzle",
  },
  {
    label: "切分九宫格",
    icon: "https://img.picui.cn/free/2025/05/23/683009e03ea99.png",
    desc: "一张图片分割多张",
    key: "2",
    iconColor: "#7fd6fb",
    path: "sudoku",
  },
  {
    label: "AI证件照",
    icon: "https://img.picui.cn/free/2025/05/23/683009e039ee6.png",
    desc: "AI一键生成证件照",
    key: "3",
    iconColor: "#8378f7",
  },
  {
    label: "拼长图",
    icon: "https://img.picui.cn/free/2025/05/23/683009e03b375.png",
    desc: "多张图片合成一张长图",
    key: "4",
    iconColor: "#396be5",
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
  if (item.key === "3" || item.key === "4") {
    uni.showToast({
      title: "功能内测中，敬请期待",
      icon: "none",
    });
    return;
  }
  const count = item.key === "1" ? 16 : 1;
  uni.chooseMedia({
    count: count,
    mediaType: ["image"],
    sourceType: ["album"],
    success: async (res) => {
      const mediaInfoList = [];
      const promiseList = res.tempFiles.map((item) => {
        return new Promise((resolve) => {
          uni.getImageInfo({
            src: item.tempFilePath,
            success: (imageRes) => {
              resolve({
                id: nanoid(),
                url: item.tempFilePath,
                width: imageRes.width,
                height: imageRes.height,
                rotate: 0,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                scale: 1,
              });
            },
            fail: (err) => {
              console.error("获取图片信息失败:", err);
              resolve({
                id: nanoid(),
                url: item.tempFilePath,
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
          uni.showToast({
            title: "请选择多张图片",
            icon: "none",
          });
          return;
        }
        // 如果需要进行页面跳转，可以在这里进行
        // 但要确保跳转的 URL 是合法的
        // 其中 "item.path" 需要替换为实际的页面路径
        if (item.key === "1") {
          // 确保图像信息已获取完毕后再进行后续操作
          puzzleStore.setImageList(mediaInfoList);
          uni.navigateTo({ url: `/pages/puzzle/${item.path}` });
        }
        if (item.key === "2") {
          sudokuStore.setSudokuInfo(mediaInfoList[0]);
          uni.navigateTo({ url: `/pages/sudoku/${item.path}` });
        }
      } catch (error) {
        console.error("处理图片信息时出错:", error);
      }
    },
    fail: (err) => {
      console.error("选择媒体失败:", err);
    },
  });
};
</script>
<template>
  <div class="home-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <div
      class="flex items-center px-[16rpx] text-[#fff] text-[32rpx] font-bold sticky top-0 z-10"
      :style="{
        height: `${navBarHeight}px`,
        top: `${statusBarHeight}px`,
      }"
    ></div>
    <div
      class="absolute inset-0 top-[380rpx] flex flex-col gap-[40rpx] p-[32rpx] pt-[48rpx] items-center bg-[#fff] rounded-[28rpx_28rpx_0_0]"
    >
      <div
        class="item"
        :data-key="item.key"
        v-for="item in info"
        :key="item.key"
        @click="handleClick(item)"
      >
        <div class="item_icon">
          <image :src="item.icon" alt="" />
        </div>
        <div class="h-full flex flex-col justify-between py-[6rpx]">
          <div class="text-[24rpx] font-bold">{{ item.label }}</div>
          <div class="text-[20rpx] text-[#999]">{{ item.desc }}</div>
        </div>
        <div class="absolute right-[24rpx] bottom-[50%] translate-y-[50%]">
          <wd-icon
            name="arrow-right"
            size="22px"
            :color="item.iconColor"
          ></wd-icon>
        </div>
      </div>
    </div>
    <wd-toast />
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  background: url(https://img.picui.cn/free/2025/05/19/682af2cb250dd.png)
    no-repeat top center;
  background-size: contain;
  position: relative;
  .item {
    height: 128rpx;
    width: 100%;
    border-radius: 24rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
    position: relative;

    &[data-key="1"] {
      background: #e6f3fe;
    }
    &[data-key="2"] {
      background: #e7f9fb;
    }
    &[data-key="3"] {
      background: #edebfd;
    }
    &[data-key="4"] {
      background: #e5edfd;
    }

    .item_icon {
      background: #fff;
      border-radius: 12rpx;
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 50rpx;
        height: 50rpx;
      }
    }
  }
}
</style>

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
    desc: "多图拼接",
    key: "1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    shadow: "0 8rpx 16rpx rgba(99, 102, 241, 0.3)",
    path: "puzzle",
  },
  {
    label: "切分九宫格",
    iconName: "apps",
    desc: "一键切图",
    key: "2",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    shadow: "0 8rpx 16rpx rgba(16, 185, 129, 0.3)",
    path: "sudoku",
  },
  {
    label: "智能证件照",
    iconName: "user",
    desc: "最美证件照",
    key: "3",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    shadow: "0 8rpx 16rpx rgba(245, 158, 11, 0.3)",
  },
  {
    label: "智能消除",
    iconName: "close",
    desc: "消除路人",
    key: "4",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
    shadow: "0 8rpx 16rpx rgba(236, 72, 153, 0.3)",
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
  <div class="tool-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <div
      class="flex items-center px-[32rpx] text-[#1e293b] text-[40rpx] font-bold z-10 relative"
      :style="{ height: `${navBarHeight}px` }"
    >
      <div class="flex items-center"><span class="mr-2">🛠️</span> 创意工坊</div>
    </div>

    <div class="p-[32rpx] pb-[120rpx] relative z-10">
      <div class="text-[28rpx] text-[#64748b] mb-[40rpx] font-light">
        释放你的图片创造力
      </div>

      <div class="grid grid-cols-2 gap-[24rpx]">
        <div
          v-for="item in tools"
          :key="item.key"
          class="aspect-[1/1.2] rounded-[32rpx] p-[32rpx] flex flex-col justify-between relative overflow-hidden transition-all active:scale-95 shadow-sm bg-white"
          @click="handleClick(item)"
        >
          <div
            class="w-[88rpx] h-[88rpx] rounded-[24rpx] flex items-center justify-center text-white shadow-md mb-[24rpx]"
            :style="{ background: item.gradient, boxShadow: item.shadow }"
          >
            <wd-icon :name="item.iconName" size="28px"></wd-icon>
          </div>

          <div>
            <div class="text-[32rpx] font-bold text-[#1e293b] mb-[8rpx]">
              {{ item.label }}
            </div>
            <div class="text-[24rpx] text-[#94a3b8]">{{ item.desc }}</div>
          </div>

          <!-- Decorative Circle -->
          <div
            class="absolute -right-[40rpx] -bottom-[40rpx] w-[160rpx] h-[160rpx] rounded-full opacity-10"
            :style="{ background: item.gradient }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Background Gradients -->
    <div
      class="absolute top-0 right-0 w-[600rpx] h-[600rpx] bg-[#f0f9ff] rounded-full blur-[100rpx] -z-10 opacity-60"
    ></div>
    <div
      class="absolute bottom-0 left-0 w-[500rpx] h-[500rpx] bg-[#f5f3ff] rounded-full blur-[80rpx] -z-10 opacity-60"
    ></div>
  </div>
</template>
<style lang="scss" scoped>
.tool-container {
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  position: relative;
}

.shadow-sm {
  box-shadow: 0 4rpx 20rpx rgba(148, 163, 184, 0.1);
}
</style>

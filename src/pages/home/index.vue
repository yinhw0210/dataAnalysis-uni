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
  return `calc(100vh - ${navBarHeight.value}px - ${statusBarHeight.value}px)`;
});

const { data, run } = useRequest(
  async () => await analyzeService.getAnalyzeResult(value.value),
  {
    manual: true,
    onSuccess: (res) => {
      console.log(JSON.stringify(res));
    },
  }
);

const onHandleAnalyze = async () => {
  run();
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
    >
      相信成长的力量
    </div>
    <div
      class="pt-[200rpx] flex flex-col"
      :style="{
        height: contentHeight,
      }"
    >
      <div
        class="w-[90%] h-[250rpx] z-[20] absolute rounded-[16rpx] flex flex-col justify-around items-center shadow-[0px_4rpx_15rpx_0px_rgba(46,45,116,0.065)] bg-[#fff]"
        :style="{
          top: `${navBarHeight + statusBarHeight + 50}px`,
          left: `5%`,
        }"
      >
        <wd-input
          type="text"
          custom-class="input-box"
          :no-border="true"
          v-model="value"
          placeholder="请输入链接"
        />
        <div
          class="w-[50%] h-[80rpx] bg-[#3250ff] text-[#fff] text-[32rpx] font-bold rounded-[20rpx] flex justify-center items-center"
          @click="onHandleAnalyze"
        >
          开始解析
        </div>
      </div>
      <div
        class="flex-1 flex flex-col items-center rounded-[10rpx] bg-white content-center pt-[200rpx] pb-[100rpx] relative overflow-hidden"
      >
        <div class="h-full flex flex-col w-full overflow-y-auto">
          <template v-if="data">
            <AnalyzeResult :data="data" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
  background: url(https://img.picui.cn/free/2025/04/10/67f766cbd157b.png)
    no-repeat center center;
  background-size: cover;
  :deep(.input-box) {
    width: 600rpx;
    height: 80rpx;
    border-radius: 50rpx;
    border: 1rpx solid #e5e5e5;
    padding: 0 20rpx;
    .wd-input__body {
      height: 100%;
      .wd-input__value {
        height: 100%;
      }
    }
  }
  .content-center {
    border-radius: 50rpx 50rpx 0 0;
  }
}
</style>

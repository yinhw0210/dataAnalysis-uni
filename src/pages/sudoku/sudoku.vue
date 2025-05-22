<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { SudokuStateType, useSudokuStore } from "@/store/modules/sudoku";
import { SUDOKU_INFO } from "@/constant/sudoku";
import { SudokuNumEnum } from "@/enum";
import Boundary from "@/components/Tool/Boundary/index.vue";

const size = 3072;

const sudokuStore = useSudokuStore();

// 选中的图片列表
const sudokuInfo = ref<SudokuStateType["sudokuInfo"]>();

// 选中类型key
const sudokuTypeKey = ref<SudokuNumEnum>(SudokuNumEnum.SIX);

// 选中的信息
const sudokuKeyInfo = computed(() => {
  return SUDOKU_INFO.find((item) => item.key === sudokuTypeKey.value);
});

const mode = computed(() => {
  // 根据图片大小判断
  if (sudokuInfo.value?.width > sudokuInfo.value?.height) {
    return "widthFix";
  } else {
    return "heightFix";
  }
});

const onHandleSudokuType = (key: SudokuNumEnum) => {
  sudokuTypeKey.value = key;
};

const handleSavePuzzle = () => {

};

onMounted(() => {
  sudokuInfo.value = sudokuStore.getSudokuInfo;
  console.log(sudokuInfo.value);
});
</script>
<template>
  <div
    class="size-full h-[100vh] overflow-hidden bg-[#e4f0f9] relative flex flex-col"
  >
    <div class="h-[70vh] w-full flex justify-center items-center">
      <div
        class="w-[90vw] h-[90vw] bg-white flex justify-center items-center relative nodes"
      >
        <image :src="sudokuInfo?.url" class="size-full" :mode="mode" />
        <Boundary :publicKey="sudokuTypeKey" />
      </div>
    </div>
    <div class="h-[30vh] w-full rounded-t-[24rpx] bg-[#fff]">
      <div class="h-[calc(100%-100rpx)] w-full flex flex-col p-[16rpx]">
        <div class="overflow-x-auto flex gap-[16rpx]">
          <div
            class="w-[100rpx] h-[100rpx] p-[10rpx] gap-[10rpx] grid border border-[#c8c8c8] rounded-[6rpx]"
            :class="{
              '!border-[#396be5]': sudokuTypeKey === item.key,
            }"
            v-for="item in SUDOKU_INFO"
            :key="item.key"
            :style="item.style"
            @click="onHandleSudokuType(item.key)"
          >
            <div
              v-for="i in item.num"
              :key="i"
              class="bg-[#c8c8c8]"
              :class="{
                '!bg-[#396be5]': sudokuTypeKey === item.key,
              }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="w-full h-[100rpx] border-t border-[#f2f2f2] flex items-center justify-around px-[32rpx]"
      >
        <div
          class="w-[200rpx] h-[60rpx] rounded-2xl text-[#396be5] bg-[#d7e1fa] flex items-center justify-center"
        >
          更换图片
        </div>
        <div
          class="w-[200rpx] h-[60rpx] rounded-2xl text-[#fff] bg-[#396be5] flex items-center justify-center"
          @click="handleSavePuzzle"
        >
          保存拼图
        </div>
      </div>
    </div>
  </div>
</template>

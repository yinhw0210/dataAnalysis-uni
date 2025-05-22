<script setup lang="ts">
import { SudokuNumEnum } from "@/enum";
import { computed } from "vue";

const props = defineProps<{
    publicKey: SudokuNumEnum;
}>();

</script>
<template>
  <!-- 三行三列分界线 -->
  <div class="absolute inset-0" v-if="publicKey === SudokuNumEnum.SIX">
    <div
      class="absolute inset-y-0 left-[calc(33.333%)] w-[1px] bg-[rgba(0,0,0,0.5)]"
    />
    <div
      class="absolute inset-y-0 right-[calc(33.333%)] w-[1px] bg-[rgba(0,0,0,0.5)]"
    />
    <div
      class="absolute inset-x-0 top-[calc(33.333%)] h-[1px] bg-[rgba(0,0,0,0.5)]"
    />
    <div
      class="absolute inset-x-0 bottom-[calc(33.333%)] h-[1px] bg-[rgba(0,0,0,0.5)]"
    />
  </div>
  <!-- 三行两列分界线 -->
  <div class="absolute inset-0" v-if="publicKey === SudokuNumEnum.FIVE">
    <div
      class="absolute inset-x-0 top-[calc(33.333%)] h-[1px] bg-[rgba(0,0,0,0.5)]"
    />
    <div
      class="absolute inset-x-0 bottom-[calc(33.333%)] h-[1px] bg-[rgba(0,0,0,0.5)]"
    />
    <div
      class="absolute inset-y-0 left-[calc(50%)] w-[1px] bg-[rgba(0,0,0,0.5)]"
    />
  </div>
  <!-- 两行两列分界线 -->
  <div class="absolute inset-0" v-if="publicKey === SudokuNumEnum.FOUR">
    <div
      class="absolute inset-y-0 left-[calc(50%)] w-[1px] bg-[rgba(0,0,0,0.5)]"
    />
    <div
      class="absolute inset-x-0 bottom-[calc(50%)] h-[1px] bg-[rgba(0,0,0,0.5)]"
    />
  </div>
  <!-- 三行一列分界线 -->
  <div class="absolute inset-0" v-if="publicKey === SudokuNumEnum.THREE">
    <div
      class="absolute inset-x-0 top-[calc(33.333%)] h-[1px] bg-[rgba(0,0,0,0.5)]"
    />
    <div
      class="absolute inset-x-0 bottom-[calc(33.333%)] h-[1px] bg-[rgba(0,0,0,0.5)]"
    />
  </div>
  <!-- 两行一列分界线 -->
  <div class="absolute inset-0" v-if="publicKey === SudokuNumEnum.TWO">
    <div
      class="absolute inset-x-0 top-[calc(50%)] h-[1px] bg-[rgba(0,0,0,0.5)]"
    />
  </div>
  <!-- 一行一列分界线 -->
  <div class="absolute inset-0" v-if="publicKey === SudokuNumEnum.ONE">
    <div
      class="absolute inset-y-0 left-[calc(50%)] w-[1px] bg-[rgba(0,0,0,0.5)]"
    />
  </div>
</template>

<script setup lang="ts"></script>

<template>
  <div class="w-[100vw] h-[100vh] flex flex-col items-center">
    <div class="flex justify-center items-center relative mt-[77%]">
      <image
        src="@/static/logo.png"
        alt="logo"
        class="size-full w-[80rpx] h-[80rpx]"
      ></image>
      <div
        class="w-[140rpx] h-[140rpx] absolute loading"
      ></div>
    </div>
    <div class="text-xl font-bold mt-[40rpx]">星栈屿</div>
  </div>
</template>

<style scoped>
.loading {
  border-radius: 50%;
  border: 1rpx solid #bfbfbf;
  border-top-color: transparent;
  border-radius: 100%;
  animation: circle infinite 0.75s linear;
}
@keyframes circle {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

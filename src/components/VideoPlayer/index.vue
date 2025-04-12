<script setup lang="ts">
import { useToast } from "wot-design-uni";

interface IProps {
  src: string;
  poster?: string;
  height?: string;
  controls?: boolean;
}

const toast = useToast();

const props = withDefaults(defineProps<IProps>(), {
  height: "450rpx",
  controls: true,
});

const onHandleDownload = () => {
  uni.showLoading({
    title: "初始化资源...",
  });
  uni.downloadFile({
    url: props.src,
    success: (res) => {
      uni.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (res) => {
          uni.hideLoading();
          toast.success("下载成功");
        },
        fail: (err) => {
          uni.hideLoading();
          toast.error("下载失败");
        },
      });
    },
    fail: (err) => {
      uni.hideLoading();
      toast.error("下载失败");
    },
  });
};

const onHandleCopyLink = () => {
  uni.setClipboardData({
    data: props.src,
  });
};
</script>

<template>
  <div class="w-full px-[32rpx]">
    <video
      :src="src"
      :poster="poster"
      :controls="controls"
      class="w-full"
      :style="{ height: height }"
    ></video>
    <div class="h-[80rpx] flex justify-center items-center gap-[10rpx]">
      <div
        class="w-[130rpx] h-[56rpx] flex justify-center items-center bg-[#3250ff] text-[#fff] text-[24rpx] font-bold rounded-[10rpx]"
        @click="() => onHandleDownload()"
      >
        下载
      </div>
      <div
        class="w-[130rpx] h-[56rpx] flex justify-center items-center bg-[#3250ff] text-[#fff] text-[24rpx] font-bold rounded-[10rpx]"
        @click="() => onHandleCopyLink()"
      >
        复制链接
      </div>
    </div>
    <wd-toast />
  </div>
</template>

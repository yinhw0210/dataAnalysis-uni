<script setup lang="ts">
import { useToast } from 'wot-design-uni';

const toast = useToast();

interface IProps {
  src: string;
  poster?: string;
  height?: string;
  controls?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  height: "450rpx",
  controls: true,
});

const onHandleDownload = () => {
  uni.showLoading({
    title: "初始化资源...",
  });
  uni.downloadFile({
    url: `https://www.solitude.top/download.php?url=${props.src}`,
    success: (res) => {
      uni.saveVideoToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (res) => {
          uni.hideLoading();
        },
        fail: (err) => {
          toast.show("不支持的下载类型，请复制链接到浏览器下载。")
          uni.hideLoading();
        },
      });
    },
    fail: (err) => {
      toast.show("不支持的下载类型，请复制链接到浏览器下载。")
      uni.hideLoading();
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

<script setup lang="ts">
import useRequest from "@/hooks/useRequest";
import photoService from "@/services/photoService";
import { base64ToTempFilePath } from "@/utils";
import { ref, watch } from "vue";

const props = defineProps<{
  initValue: string;
}>();

const url = ref<string>(props.initValue);

const { data: humanMattingData, run: runHumanMatting } = useRequest(
  async (params: API.Photo.HumanMattingParams) =>
    await photoService.human_matting(params),
  {
    onSuccess: () => {
      uni.hideLoading();
    },
    onError: () => {
      uni.hideLoading();
      uni.showToast({
        title: "生成失败，请重新上传RGB三通道图或联系客服",
        icon: "none",
      });
    },
    manual: true,
  }
);

const handleRunUrlToBase64 = (url: string) => {
  uni.showLoading({
    title: "处理中...",
    mask: true,
  });
  uni.getFileSystemManager().readFile({
    filePath: url,
    encoding: "base64",
    success: (res) => {
      const params: API.Photo.HumanMattingParams = {
        input_image_base64: res.data as string,
        human_matting_model: "modnet_photographic_portrait_matting",
      };
      runHumanMatting(params);
    },
    fail: (err) => {
      uni.hideLoading();
      uni.showToast({
        title: "生成失败，请重新上传或联系客服",
        icon: "none",
      });
    },
  });
};

const handleUpload = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["original", "compressed"],
    sourceType: ["album"],
    success: (res) => {
      url.value = res.tempFilePaths[0];
      handleRunUrlToBase64(url.value);
    },
  });
};

const handleSave = async () => {
  uni.showToast({
    title: "保存中...",
    mask: true,
  });
  const tempFilePath = await base64ToTempFilePath(
    humanMattingData.value.image_base64
  );
  uni.saveImageToPhotosAlbum({
    filePath: tempFilePath,
    success: () => {
      uni.hideLoading();
      uni.showToast({
        title: "保存成功",
        icon: "success",
      });
    },
    fail: (err) => {
      uni.hideLoading();
      console.log(err, "保存到相册失败");
      uni.showToast({
        title: "保存失败",
        icon: "none",
      });
    },
  });
};

watch(
  () => props.initValue,
  (newVal) => {
    handleRunUrlToBase64(newVal);
  },
  {
    immediate: true,
  }
);
</script>
<template>
  <div class="h-full">
    <div class="w-full h-[calc(100%-150rpx)] bg-gray-100">
      <div class="w-full h-full flex justify-center items-center px-[32rpx]">
        <div
          class="w-full h-full p-[24rpx] bg-white rounded-[24rpx] shadow-md flex justify-center items-center"
        >
          <img
            :src="humanMattingData.image_base64"
            class="w-full"
            mode="widthFix"
          />
        </div>
      </div>
    </div>
    <div class="w-full h-[150rpx] flex justify-center items-center">
      <div class="w-full grid grid-cols-2 gap-[24rpx] px-[24rpx]">
        <wd-button @click="handleUpload">重新上传</wd-button>
        <wd-button @click="handleSave">保存</wd-button>
      </div>
    </div>
  </div>
</template>

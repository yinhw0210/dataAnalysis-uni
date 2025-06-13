<script setup lang="ts">
import useRequest from "@/hooks/useRequest";
import photoService from "@/services/photoService";
import { base64ToTempFilePath } from "@/utils";
import { ref, watch } from "vue";

const props = defineProps<{
  initValue: string;
  initKb: number;
}>();

const url = ref<string>(props.initValue);

const kb = ref<number>(props.initKb);

// 是否点击过修改
const isClickModify = ref<boolean>(false);

const { run } = useRequest(
  async (params: API.Photo.ImageSizeModifyParams) =>
    await photoService.image_size_modify(params),
  {
    onSuccess: (res) => {
      isClickModify.value = true;
      url.value = res.image_base64;
      uni.hideLoading();
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
      const params: API.Photo.ImageSizeModifyParams = {
        input_image_base64: res.data as string,
        kb: kb.value,
        dpi: 300,
      };
      run(params);
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

const handleSave = async () => {
  uni.showToast({
    title: "保存中...",
    mask: true,
  });
  const tempFilePath = await base64ToTempFilePath(url.value);
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
</script>
<template>
  <div class="size-full">
    <div class="w-full h-[calc(100%-150rpx)] bg-gray-100 flex flex-col items-center">
      <div class="flex-1 w-full flex justify-center items-center p-[32rpx]">
        <img :src="url" class="w-full" mode="widthFix" />
      </div>
      <div class="h-[150rpx] w-full flex flex-col gap-[24rpx] justify-center bg-white px-[32rpx]">
        <div class="text-[24rpx] font-bold">设置大小（kb）</div>
        <wd-input v-model="kb" type="number" placeholder="请输入大小" />
      </div>
    </div>
    <div class="w-full h-[150rpx] flex justify-center items-center">
      <div class="w-full grid grid-cols-2 gap-[24rpx] px-[24rpx]">
        <wd-button
          @click="
            () => {
              handleRunUrlToBase64(url);
            }
          "
          >修改</wd-button
        >
        <wd-button @click="handleSave" :disabled="!isClickModify">保存</wd-button>
      </div>
    </div>
  </div>
</template>

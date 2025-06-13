<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from "vue";
import { usePhotoStore } from "@/store/modules/photo";
import useRequest from "@/hooks/useRequest";
import photoService from "@/services/photoService";
import { onLoad } from "@dcloudio/uni-app";
import { PHOTO_SIZE_LIST, CUSTOM_COLOR_LIST } from "@/constant/photo";
import { base64ToTempFilePath } from "@/utils";

const photoStore = usePhotoStore();

const key = ref<string>("1");

const color = ref<string>("#4D9DE0");

const preColor = ref<string>("#4D9DE0");

const isHd = ref<boolean>(true);

const show = ref<boolean>(false);

const activeTab = ref<string>("1");

const generateImage = reactive({
  // 抠图
  cutout: "",
  // 抠图高清
  cutout_hd: "",
  // 标准
  standard: "",
  // 高清
  hd: "",
  // 排版
  layout: "",
});

onLoad((options) => {
  if (options.key && options.color) {
    key.value = options.key;
    color.value = options.color;
  }
  uni.showLoading({
    title: "生成中...",
    mask: true,
  });
  handleInit();
});

const localImage = computed(() => {
  return isHd.value ? generateImage.cutout_hd : generateImage.cutout;
});

const title = computed(() => {
  return PHOTO_SIZE_LIST.find((item) => item.key === key.value)?.label;
});

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

const keyInfo = computed(() => {
  return PHOTO_SIZE_LIST.find((item) => item.key === key.value);
});

const { run: runAddBackground } = useRequest(
  async (params: API.Photo.AddBackgroundParams & { callback: boolean }) =>
    await photoService.add_background(params),
  {
    onSuccess: (result, [params]) => {
      const { callback } = params;
      if (callback) {
        runLayout({
          input_image_base64: result.image_base64,
          width: keyInfo.value.size.width,
          height: keyInfo.value.size.height,
        });
      }
      if (isHd.value) {
        generateImage.hd = result.image_base64;
      } else {
        generateImage.standard = result.image_base64;
      }
    },
    manual: true,
  }
);

const { run: runLayout } = useRequest(
  async (params: API.Photo.GenerateLayoutPhotosParams) =>
    await photoService.generate_layout_photos(params),
  {
    onSuccess: (result) => {
      generateImage.layout = result.image_base64;
    },
    manual: true,
  }
);

const handleInit = () => {
  const width = keyInfo.value.size.width;
  const height = keyInfo.value.size.height;
  uni.getFileSystemManager().readFile({
    filePath: photoStore.getUrl,
    encoding: "base64",
    success: (res) => {
      const params: API.Photo.CreateParams = {
        input_image_base64: res.data as string,
        width,
        height,
      };
      handleCutout(params);
    },
  });
};

// 抠图
const handleCutout = async (params: API.Photo.CreateParams) => {
  const result = await photoService.create(params);
  generateImage.cutout = result.image_base64_standard;
  generateImage.cutout_hd = result.image_base64_hd;
  uni.hideLoading();
  // 生成带颜色的证件照
  runAddBackground({
    input_image_base64: result.image_base64_hd,
    color: color.value,
    callback: true,
  });
};

const handleSaveBase64 = async (base64: string) => {
  const tempFilePath = await base64ToTempFilePath(base64);
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

const handleSave = async (type: string) => {
  uni.showToast({
    title: "合成中...",
    mask: true,
  });
  const imageBase64 = isHd.value
    ? generateImage.cutout_hd
    : generateImage.cutout;
  const result = await runAddBackground({
    input_image_base64: imageBase64,
    color: color.value,
    callback: false,
  });
  if (type === "1") {
    handleSaveBase64(generateImage.layout);
  } else {
    handleSaveBase64(result.image_base64);
  }
};

const onHandleColor = (value: string) => {
  preColor.value = color.value;
  color.value = value;
};

const handleTab = async (value: string) => {
  if (value === "2" && preColor.value !== color.value) {
    uni.showLoading({
      title: "合成中...",
      mask: true,
    });
    await runAddBackground({
      input_image_base64: isHd.value ? generateImage.cutout_hd : generateImage.cutout,
      color: color.value,
      callback: true,
    });
    preColor.value = color.value;
    uni.hideLoading();
    activeTab.value = value;
  } else {
    activeTab.value = value;
  }
};
</script>
<template>
  <div
    class="home-container relative"
    :style="{ paddingTop: `${statusBarHeight}px` }"
  >
    <div
      :style="{ height: `${navBarHeight}px` }"
      class="flex justify-center items-center px-[16rpx] font-bold"
    >
      {{ title }}
    </div>
    <div
      class="flex flex-col overflow-hidden pb-[72rpx]"
      :style="{
        height: contentHeight,
      }"
    >
      <div class="w-full h-[68rpx] grid grid-cols-2 relative">
        <div
          class="flex justify-center items-center"
          :class="{ 'text-[#2977ff]': activeTab === '1' }"
          @click="handleTab('1')"
        >
          电子照片
        </div>
        <div
          class="flex justify-center items-center"
          :class="{ 'text-[#2977ff]': activeTab === '2' }"
          @click="handleTab('2')"
        >
          排版照片
        </div>
        <div
          class="absolute bottom-0 left-0 w-[25%] h-[3rpx] bg-[#2977ff]"
          :style="{
            transform: `translateX(${activeTab === '1' ? '50%' : '250%'})`,
            transition: 'transform 0.3s ease-in-out',
          }"
        ></div>
      </div>
      <div
        class="bg-[#F3F4F6] flex-1 flex justify-center items-center"
        v-if="activeTab === '1'"
      >
        <div
          class="size-[80%] flex justify-center items-center"
          v-if="generateImage.cutout"
        >
          <div
            class="h-full"
            :style="{
              backgroundColor: color,
            }"
          >
            <img :src="localImage" alt="" mode="heightFix" class="!h-full" />
          </div>
        </div>
      </div>
      <div
        class="bg-[#F3F4F6] flex-1 flex justify-center items-center"
        v-if="activeTab === '2'"
      >
        <div
          class="size-[90%] flex justify-center items-center"
          v-if="generateImage.layout"
        >
          <img
            :src="generateImage.layout"
            alt=""
            mode="widthFix"
            class="w-full"
          />
        </div>
      </div>
      <div
        class="h-[450rpx] bg-white flex flex-col py-[24rpx] gap-[28rpx]"
        v-if="activeTab === '1'"
      >
        <div class="flex flex-col gap-[16rpx]">
          <div class="text-[28rpx] px-[24rpx] font-bold">颜色:</div>
          <div
            class="grid grid-cols-6 px-[24rpx] gap-y-[24rpx] gap-x-[54rpx]"
            :style="{
              justifyItems: 'center',
            }"
          >
            <div
              :value="item"
              v-for="(item, index) in CUSTOM_COLOR_LIST"
              :key="index"
              class="size-[50rpx] shadow-md rounded-[16rpx]"
              :style="{
                backgroundColor: item,
                transform: color === item ? 'scale(1.3)' : 'scale(1)',
              }"
              @click="onHandleColor(item)"
            ></div>
          </div>
        </div>
        <div class="flex gap-[6rpx] items-center">
          <div class="text-[28rpx] px-[24rpx] font-bold">是否高清:</div>
          <div class="px-[24rpx]">
            <wd-switch v-model="isHd" />
          </div>
        </div>
        <div
          class="text-[24rpx] px-[24rpx] text-[#2977ff]"
          @click="show = true"
        >
          高清和标清有什么区别？
        </div>
        <div class="w-full">
          <div class="grid grid-cols-2 gap-[24rpx] px-[24rpx]">
            <wd-button @click="handleSave('1')">保存排版照片</wd-button>
            <wd-button @click="handleSave('2')">保存电子照片</wd-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <wd-popup
    v-model="show"
    custom-style="border-radius:32rpx;"
    custom-class="w-[80%] h-[65%]"
    @close="show = false"
  >
    <div class="flex flex-col gap-[24rpx] p-[24rpx]">
      <div class="text_title">标清与高清证件照的区别是什么?</div>
      <div class="text_content">
        通常用户上传的图片或者拍摄的图片清晰较高,包含的像素过多,无法在不损失像素的情况下,压缩成指定的小尺寸小像素的证件照。所以标清证件照会比高清证件照模糊一些,但是像素尺寸也更加准确一些。
      </div>
      <div class="text_title">标清与高清证件照的优劣势?</div>
      <div class="text_content">
        高清证件照会尽可能的保留的原图的清晰度,但是会牺牲一定的尺寸准确性,但依旧会保持原图的宽高比,在大部分场景下,都可以替代标清证件照。一寸高清与一寸标清都是一寸,但一寸高清的像素会大于标清,在部分对照片像素严格要求的场景,一寸标清的优势更加明显。
      </div>
      <div class="text_title">我应该怎样选择标清与高清证件照?</div>
      <div class="text_content">
        如何选用高清证件照与标清证件照取决于您的需求，如果您需要使用证件照的地方，有则严格的大小规定要求
      </div>
      <div class="text_content">
        案例1：某xxx考试网站，严格用户使用295px
        *413px像素大小的一寸证件照。这时，使用标清证件照更加能够满足您的需求，因为使用高清证件照，尺寸可能会是600px
        * 800px。
      </div>
      <div class="text_content">
        案例2：用户需要在某xxx证件上贴上自己的证件照，此时高清证件照是更佳的选择，因为更加清晰，尺寸也是一寸照片的宽高比，不影响打印排版照。
      </div>
    </div>
  </wd-popup>
</template>

<style lang="scss" scoped>
.tabBorder {
  border-bottom: 1rpx solid #e5e5e5;
}
.text_title {
  font-size: 32rpx;
  font-weight: bold;
}
.text_content {
  font-size: 28rpx;
  color: #666;
  text-indent: 2em;
}
</style>

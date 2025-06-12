<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import HexComp from "@/components/Photo/HexComp/index.vue";
import RgbComp from "@/components/Photo/RgbComp/index.vue";
import { PHOTO_SIZE_LIST, PHOTO_COLOR_LIST } from "@/constant/photo";
import { usePhotoStore } from "@/store/modules/photo";

const photoStore = usePhotoStore();

const key = ref<string>("1");

const current = ref<number>(0);

const swiperList = ref<any[]>([
  "https://img.picui.cn/free/2025/06/09/684678926e2d9.png",
  "https://img.picui.cn/free/2025/06/09/684678929f09c.png",
  "https://img.picui.cn/free/2025/06/09/68467893335e2.png",
  "https://img.picui.cn/free/2025/06/09/68467892c85c3.png",
  "https://img.picui.cn/free/2025/06/09/684678929bc4f.png",
]);

onLoad((options) => {
  if (options.key) {
    key.value = options.key;
  }
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

const model = ref({
  size: title.value,
  dpi: "300dpi",
  format: "PNG",
  // 头部测量比例
  head_measure_ratio: 0.2,
  // 顶部距离最大值
  top_distance_max: 0.12,
});

const color = ref("#4D9DE0");

const customColor = reactive({
  hex: "#4D9DE0",
  rgb: "rgb(77, 157, 224)",
});

const handleClick = (type: string) => {
  let colorValue = color.value;
  if (color.value === 'HEX') {
    colorValue = customColor.hex;
  } else if (color.value === 'RGB') {
    colorValue = customColor.rgb;
  }
  if (type === '1') {
    uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success: (res) => {
        photoStore.setUrl(res.tempFilePaths[0]);
        uni.navigateTo({
          url: `/pages/photoGenerate/index?key=${key.value}&color=${colorValue}`,
        });
      },
    });
  } else if (type === '2') {
    uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        photoStore.setUrl(res.tempFilePaths[0]);
        uni.navigateTo({
          url: `/pages/photoGenerate/index?key=${key.value}&color=${colorValue}`,
        });
      },
    });
  }
}
</script>
<template>
  <div
    class="home-container relative"
    :style="{ paddingTop: `${statusBarHeight}px` }"
  >
    <div class="absolute bottom-0 left-0 w-full p-[24rpx] bg-white z-[99999]">
      <div class="grid grid-cols-2 gap-[24rpx] px-[24rpx]">
        <wd-button @click="handleClick('1')">拍照</wd-button>
        <wd-button @click="handleClick('2')">相册选择</wd-button>
      </div>
    </div>
    <div
      :style="{ height: `${navBarHeight}px` }"
      class="flex justify-center items-center px-[16rpx] font-bold"
    >
      {{ title }}
    </div>
    <div
      class="flex flex-col overflow-y-auto pb-[72rpx]"
      :style="{
        height: contentHeight,
      }"
    >
      <div class="flex flex-col px-[24rpx]">
        <div class="flex flex-col gap-[24rpx] pt-[24rpx]">
          <div class="text-[28rpx] font-bold px-[24rpx]">生成配置</div>
          <div>
            <wd-form ref="form" :model="model">
              <wd-cell-group border>
                <wd-input
                  label="尺寸"
                  label-width="100px"
                  prop="size"
                  v-model="model.size"
                  placeholder="请输入尺寸"
                  disabled
                />
                <wd-input
                  label="图像分辨率"
                  label-width="100px"
                  prop="dpi"
                  v-model="model.dpi"
                  placeholder="请输入图像分辨率"
                  disabled
                />
                <wd-input
                  label="文件格式"
                  label-width="100px"
                  prop="format"
                  v-model="model.format"
                  placeholder="请输入文件格式"
                  disabled
                />
                <wd-input
                  label="头部测量比例"
                  label-width="100px"
                  prop="head_measure_ratio"
                  v-model="model.head_measure_ratio"
                  placeholder="请输入头部测量比例"
                  disabled
                />
                <wd-input
                  label="顶部距离最大值"
                  label-width="100px"
                  prop="top_distance_max"
                  v-model="model.top_distance_max"
                  placeholder="请输入顶部距离最大值"
                  disabled
                />
                <!-- <wd-cell title="背景颜色" title-width="100px" prop="color" custom-class="custom-cell">
                  <view style="text-align: left">
                    <wd-radio-group v-model="model.color" shape="button">
                      <wd-radio :value="item.color" v-for="item in PHOTO_COLOR_LIST" :key="item.key">
                        <view class="w-[128rpx] flex items-center gap-[10rpx]">
                          <view class="w-[20rpx] h-[20rpx] rounded-full" :style="{ backgroundColor: item.color }" v-if="item.color !== 'HEX' && item.color !== 'RGB'"></view>
                          <view>{{ item.label }}</view>
                        </view>
                      </wd-radio>
                    </wd-radio-group>
                  </view>
                </wd-cell> -->
              </wd-cell-group>
            </wd-form>
            <div class="flex flex-col gap-[24rpx] pt-[24rpx]">
              <div class="text-[26rpx] px-[24rpx]">背景颜色</div>
              <div class="grid grid-cols-3 gap-[24rpx] px-[24rpx]">
                <div
                  :value="item.color"
                  v-for="item in PHOTO_COLOR_LIST"
                  :key="item.key"
                  class="border border-solid border-[#d4d4d4] rounded-[16rpx] p-[16rpx]"
                  :style="{
                    borderColor: color === item.color ? '#006CF8' : '#d4d4d4',
                  }"
                  @click="color = item.color"
                >
                  <view class="w-[128rpx] flex items-center gap-[10rpx]">
                    <view
                      class="w-[20rpx] h-[20rpx] rounded-full"
                      :style="{ backgroundColor: item.color }"
                      v-if="item.color !== 'HEX' && item.color !== 'RGB'"
                    ></view>
                    <view>{{ item.label }}</view>
                  </view>
                </div>
              </div>
            </div>
            <HexComp
              v-model:model-value="customColor.hex"
              v-if="color === 'HEX'"
            />
            <RgbComp
              v-model:model-value="customColor.rgb"
              v-if="color === 'RGB'"
            />
          </div>
        </div>
        <div class="flex flex-col gap-[24rpx] pt-[24rpx]">
          <div class="text-[28rpx] font-bold px-[24rpx]">拍照建议</div>
          <div>
            <wd-swiper
              :list="swiperList"
              autoplay
              v-model:current="current"
              :height="220"
              imageMode="widthFix"
            ></wd-swiper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.custom-cell) {
  .wd-cell__wrapper {
    padding-right: 0 !important;
    .wd-radio-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
    }
  }
}
</style>

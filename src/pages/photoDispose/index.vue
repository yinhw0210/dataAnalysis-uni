<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { DisposeTypeEnum } from "@/enum/components/photo";
import { usePhotoStore } from "@/store/modules/photo";
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import PhotoCutout from "@/components/Photo/Cutout/index.vue";
import PhotoSizeModify from "@/components/Photo/SizeModify/index.vue";
import { dictInfo, getDictInfo } from "@/dict";

const photoStore = usePhotoStore();

const type = ref<DisposeTypeEnum>(DisposeTypeEnum.CHANGE_BACKGROUND);

const initValue = ref<string>("");

const initKb = ref<number>(1);

const title = computed(() => {
  return getDictInfo(dictInfo.disposeType, type.value, "value").label;
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

onLoad((options) => {
  type.value = options.type as DisposeTypeEnum;
  initValue.value = photoStore.getUrl;
  initKb.value = photoStore.getKb;
});
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
      <PhotoCutout
        class="h-full"
        :initValue="initValue"
        v-if="type === DisposeTypeEnum.CUTOUT"
      />
      <PhotoSizeModify
        class="h-full"
        :initValue="initValue"
        :initKb="initKb"
        v-if="type === DisposeTypeEnum.IMAGE_SIZE_MODIFY"
      />
    </div>
  </div>
</template>

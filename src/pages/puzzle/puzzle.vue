<script setup lang="ts">
import { IPuzzleInfo, PUZZLE_INFO } from "@/constant/puzzle";
import { dictInfo } from "@/dict/index";
import { computed, onMounted, ref } from "vue";
import { usePuzzleStore } from "@/store/modules/puzzle";
import { StandardPuzzleNum } from "@/enum";

interface IImageInfo {
  url: string;
  id: string;
  width: number;
  height: number;
}

interface ChildItemPosition {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

const puzzleStore = usePuzzleStore();

// 元素实例
const puzzleContainer = ref<HTMLElement>(null);

// 子项的位置信息
const dropRects = ref<ChildItemPosition[]>([]);

// 选中的比例
const ratio = ref<string>("1 / 1");

// 选中的拼图类型
const puzzleType = ref<string>("1");

// 选中的图片
const selectImageIndex = ref<number>();

// 当前触摸的元素id
const touchElementIndex = ref<number>();

// 点击触摸后的元素位置
const touchElementPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

// 当前元素的坐标
const moveElementPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

// 是否在移动状态
const isMoving = ref<boolean>(false);

// 当前高亮的目标元素索引
const highlightTargetIndex = ref<number | null>(null);

// 当前触摸点位置
const touchPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });

// 选中的图片列表
const selectImageList = ref<IImageInfo[]>([]);

// 选中的拼图类型列表
const selectPuzzleInfo = computed<IPuzzleInfo["children"] | undefined>(() => {
  return PUZZLE_INFO[selectImageList.value.length]?.children ?? undefined;
});

// 选中的拼图类型信息
const selectStylePuzzleInfo = computed(() => {
  return selectPuzzleInfo?.value?.find((item) => item.key === puzzleType.value);
});

const aspect_ratio = computed(() => {
  return dictInfo.aspect_ratio.map((item) => {
    const ratio = item.value.split("/").map(Number);
    return {
      ...item,
      ratio: ratio[0] / ratio[1],
    };
  });
});

const ratioInfo = computed(() => {
  return aspect_ratio.value.find((item) => item.value === ratio.value);
});

const handleClick = (value: string) => {
  ratio.value = value;
};

const handlePuzzleType = (value: string) => {
  puzzleType.value = value;
};

const handleSelectImage = (cIndex: number) => {
  selectImageIndex.value = cIndex;
};

// 检查触摸点是否在元素内
const isPointInRect = (x: number, y: number, rect: ChildItemPosition) => {
  return (
    x >= rect.left &&
    x <= rect.left + rect.width &&
    y >= rect.top &&
    y <= rect.top + rect.height
  );
};

// 基于触摸点位置检查当前触摸的是哪个元素
const checkTouchTarget = () => {
  if (!isMoving.value || touchElementIndex.value === undefined) return;

  highlightTargetIndex.value = null;

  // 遍历所有元素检查触摸点是否在元素内
  dropRects.value.forEach((rect, index) => {
    if (index === touchElementIndex.value) return; // 跳过自身

    if (isPointInRect(touchPosition.value.x, touchPosition.value.y, rect)) {
      highlightTargetIndex.value = index;
    }
  });
};

// 交换两个元素
const swapElements = (index1: number, index2: number) => {
  const temp = { ...selectImageList.value[index1] };
  selectImageList.value[index1] = { ...selectImageList.value[index2] };
  selectImageList.value[index2] = temp;
};

const handleTouchStart = (event: TouchEvent, cIndex: number) => {
  // 记录开始触摸的索引
  touchElementIndex.value = cIndex;
  isMoving.value = true;
  const offsetX = (event.currentTarget as HTMLElement).offsetLeft;
  const offsetY = (event.currentTarget as HTMLElement).offsetTop;
  touchElementPosition.value = {
    x: event.touches[0].clientX - offsetX,
    y: event.touches[0].clientY - offsetY,
  };

  // 在小程序中，不需要阻止默认行为
  if (event.preventDefault) {
    event.preventDefault();
  }

  // 每次开始拖拽存取所有子项
  const query = uni.createSelectorQuery();
  query.selectAll(".childItem").boundingClientRect();
  query.exec((res) => {
    dropRects.value = res[0];
  });

  // 重置高亮目标
  highlightTargetIndex.value = null;
};

const handleTouchMove = (event: TouchEvent, cIndex: number) => {
  if (!isMoving.value) return;

  // 元素的左上角的坐标
  const touchOffsetX = touchElementPosition.value.x;
  const touchOffsetY = touchElementPosition.value.y;

  const offsetX = (event.currentTarget as HTMLElement).offsetLeft;
  const offsetY = (event.currentTarget as HTMLElement).offsetTop;

  moveElementPosition.value = {
    x: event.touches[0].clientX - offsetX - touchOffsetX,
    y: event.touches[0].clientY - offsetY - touchOffsetY,
  };

  // 记录当前触摸点的绝对位置
  touchPosition.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };

  // 检查触摸点下的元素
  checkTouchTarget();
};

const handleTouchEnd = (event: TouchEvent, cIndex: number) => {
  if (isMoving.value && highlightTargetIndex.value !== null) {
    // 如果有高亮目标，交换两个元素
    swapElements(touchElementIndex.value!, highlightTargetIndex.value);
  }

  isMoving.value = false;
  touchElementPosition.value = { x: 0, y: 0 };
  moveElementPosition.value = { x: 0, y: 0 };
  highlightTargetIndex.value = null;
};

onMounted(() => {
  console.log(puzzleStore.getImageList, "111");
  selectImageList.value = puzzleStore.getImageList;
  console.log(selectImageList.value, "222");
});

const handleSavePuzzle = () => {
  console.log(selectImageList.value, "333");

  uni
    .createSelectorQuery()
    .select("#puzzleContainer")
    .boundingClientRect((containerRect: UniApp.NodeInfo) => {
      if (!containerRect) {
        uni.showToast({
          title: "获取容器信息失败",
          icon: "none",
        });
        return;
      }

      // 解析当前ratio值，计算目标canvas尺寸
      const ratioValues = ratio.value
        .split("/")
        .map((val) => Number(val.trim()));
      const ratioWidth = ratioValues[0];
      const ratioHeight = ratioValues[1];

      // 基准高度为4096，计算宽度
      const canvasHeight = 4096;
      const canvasWidth = Math.round((ratioWidth / ratioHeight) * canvasHeight);

      // 计算从容器到canvas的缩放比例
      const scaleX = canvasWidth / containerRect.width;
      const scaleY = canvasHeight / containerRect.height;

      // 创建canvas上下文
      const ctx = uni.createCanvasContext("puzzleCanvas");

      // 设置canvas尺寸
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 获取所有子元素
      uni
        .createSelectorQuery()
        .selectAll("#puzzleContainer .childItem")
        .boundingClientRect((childRects: UniApp.NodeInfo[]) => {
          if (!childRects || childRects.length === 0) {
            uni.showToast({
              title: "获取子元素信息失败",
              icon: "none",
            });
            return;
          }
          // 绘制每个子元素
          childRects.forEach((rect, index) => {
            const item = selectImageList.value[index];

            // 计算相对于容器的位置
            const relativeLeft = rect.left - containerRect.left;
            const relativeTop = rect.top - containerRect.top;

            // 计算在canvas上的位置和尺寸
            const canvasLeft = relativeLeft * scaleX;
            const canvasTop = relativeTop * scaleY;
            const canvasItemWidth = rect.width * scaleX;
            const canvasItemHeight = rect.height * scaleY;

            // 绘制子元素背景
            ctx.fillStyle = "#b2b2b2";
            ctx.fillRect(
              canvasLeft,
              canvasTop,
              canvasItemWidth,
              canvasItemHeight
            );

            // 如果有图片URL，则绘制图片
            if (item.url) {
              // 保存当前状态，绘制图片后恢复
              ctx.save();
              // 创建裁剪区域
              ctx.beginPath();
              ctx.rect(
                canvasLeft,
                canvasTop,
                canvasItemWidth,
                canvasItemHeight
              );
              ctx.clip();
              // 绘制图片
              ctx.drawImage(
                item.url,
                canvasLeft,
                canvasTop,
                canvasItemWidth,
                canvasItemHeight
              );
              ctx.restore();
            } else {
              // 如果没有图片，则显示ID文本
              ctx.fillStyle = "#ffffff";
              ctx.font = `${Math.round(canvasItemHeight / 10)}px sans-serif`;
              ctx.setTextAlign("center");
              ctx.setTextBaseline("middle");
              ctx.fillText(
                item.id,
                canvasLeft + canvasItemWidth / 2,
                canvasTop + canvasItemHeight / 2
              );
            }
          });

          // 绘制完成后保存
          ctx.draw(false, () => {
            uni.canvasToTempFilePath({
              canvasId: "puzzleCanvas",
              x: 0,
              y: 0,
              width: canvasWidth,
              height: canvasHeight,
              destWidth: canvasWidth,
              destHeight: canvasHeight,
              success: (res) => {
                uni.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: () => {
                    uni.showToast({
                      title: "保存成功",
                      icon: "success",
                    });
                  },
                  fail: (err) => {
                    console.log(err, "保存到相册失败");
                    uni.showToast({
                      title: "保存失败",
                      icon: "none",
                    });
                  },
                });
              },
              fail: (err) => {
                console.log(err, "导出图片失败");
                uni.showToast({
                  title: "导出图片失败",
                  icon: "none",
                });
              },
            });
          });
        })
        .exec();
    })
    .exec();
};

const getImageStyle = (item: IImageInfo, info: [string, StandardPuzzleNum]) => {
  const standar = info[1];
  const width = item.width;
  const height = item.height;
  if (standar === StandardPuzzleNum.WIDTH) {
    return {
      width: "100%!important",
    };
  }
  if (standar === StandardPuzzleNum.HEIGHT) {
    return {
      height: "100%!important",
    }
  }
  if (standar === StandardPuzzleNum.EQUAL) {
    return {
      width: "100%",
      height: "100%",
    }
  }
};

const getImageMode = (item: IImageInfo, info: [string, StandardPuzzleNum]) => {
  const standar = info[1];
  if (standar === StandardPuzzleNum.WIDTH) {
    return "widthFix";
  }
  if (standar === StandardPuzzleNum.HEIGHT) {
    return "heightFix";
  }
  if (standar === StandardPuzzleNum.EQUAL) {
    return "aspectFill";
  }
}
</script>
<template>
  <div class="size-full h-[100vh] overflow-hidden bg-[#e4f0f9]">
    <div class="w-full h-[70vh] flex items-center justify-center">
      <div
        class="w-full overflow-hidden"
        :style="{
          aspectRatio: ratioInfo?.ratio,
          maxWidth: `calc(70vh * ${ratioInfo?.ratio})`,
          maxHeight: '100%',
        }"
      >
        <div
          class="size-full grid gap-[12rpx] p-[12rpx]"
          :style="selectStylePuzzleInfo?.style"
          id="puzzleContainer"
          ref="puzzleContainer"
        >
          <div
            v-for="(item, cIndex) in selectImageList"
            :key="cIndex"
            class="bg-[#b2b2b2] box-border childItem overflow-hidden flex justify-center items-center"
            :id="`childItem_${cIndex}`"
            :style="{
              ...(selectStylePuzzleInfo?.children?.[cIndex] as any),
              transform: isMoving && touchElementIndex === cIndex ? `translate(${moveElementPosition.x}px, ${moveElementPosition.y}px) scale(0.85)` : 'none',
            }"
            :class="{
              'border-2 border-[#396be5]': selectImageIndex === cIndex,
              'border-2 border-[#ff9900] highlight-target':
                highlightTargetIndex === cIndex,
              'dragging-element': isMoving && touchElementIndex === cIndex,
            }"
            @touchstart="handleTouchStart($event, cIndex)"
            @touchmove="handleTouchMove($event, cIndex)"
            @touchend="handleTouchEnd($event, cIndex)"
            @click="handleSelectImage(cIndex)"
          >
          <!-- :mode="getImageMode(item, selectStylePuzzleInfo.children[cIndex])" -->
            <image
              :src="item.url"
              alt=""
              :mode="getImageMode(item, selectStylePuzzleInfo.children[cIndex])"
              :data-width="item.width"
              :data-height="item.height"
              :style="getImageStyle(item, selectStylePuzzleInfo.children[cIndex])"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-[30vh] bg-[#fff] rounded-t-[24rpx] flex flex-col">
      <div
        class="w-full h-[100rpx] px-[32rpx] py-[18rpx] border-b border-[#f2f2f2]"
      >
        <scroll-view scroll-x="true" class="whitespace-nowrap">
          <div
            v-for="item in aspect_ratio"
            :key="item.value"
            class="border border-[#c8c8c8] text-[#c8c8c8] inline-block mr-[36rpx] aspectItem"
            :class="{
              'border-blue-500': ratio === item.value,
              'text-blue-500': ratio === item.value,
            }"
            :style="{
              width: '64rpx',
              aspectRatio: item.ratio,
              maxWidth: `calc(64rpx * ${item.ratio})`,
              maxHeight: '100%',
            }"
            @click="handleClick(item.value)"
          >
            <div
              class="w-full h-full flex items-center justify-center text-[24rpx]"
            >
              {{ item.label }}
            </div>
          </div>
        </scroll-view>
      </div>
      <div
        class="w-full flex-1 grid grid-cols-5 overflow-y-auto gap-[32rpx] p-[12rpx]"
      >
        <!-- 几种类型 -->
        <div
          v-for="item in selectPuzzleInfo"
          :key="item.key"
          class="size-[100rpx] bg-[#f5f5f5] p-[12rpx] rounded-[6rpx] grid gap-[6rpx]"
          :id="`puzzleItem_${item.key}`"
          :style="{
            ...(item.style as any),
            border: puzzleType === item.key ? '1px solid #396be5' : 'none',
          }"
          @click="handlePuzzleType(item.key)"
        >
          <!-- 子元素，后期替换为图片 -->
          <div
            v-for="(_, cIndex) in selectImageList"
            :key="cIndex"
            class="bg-[#b2b2b2]"
            :style="item.children?.[cIndex][0]"
          ></div>
        </div>
      </div>
      <div
        class="w-full h-[100rpx] border-t border-[#f2f2f2] flex items-center justify-around px-[32rpx]"
      >
        <div
          class="w-[200rpx] h-[60rpx] rounded-2xl text-[#396be5] bg-[#d7e1fa] flex items-center justify-center"
        >
          添加图片
        </div>
        <div
          class="w-[200rpx] h-[60rpx] rounded-2xl text-[#fff] bg-[#396be5] flex items-center justify-center"
          @click="handleSavePuzzle"
        >
          保存拼图
        </div>
      </div>
    </div>
    <canvas
      canvas-id="puzzleCanvas"
      style="width: 4096px; height: 4096px"
    ></canvas>
  </div>
</template>

<style lang="scss" scoped>
.aspectItem {
  &:last-child {
    margin-right: 0;
  }
}

.highlight-target {
  border-style: dashed !important;
  background-color: #fff8e6 !important;
}

.dragging-element {
  opacity: 0.75;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>

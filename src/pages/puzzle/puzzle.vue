<script setup lang="ts">
import {
  IPuzzleInfo,
  PUZZLE_INFO,
  PUZZLE_OPTIONS_LIST,
  PUZZLE_ADVANCED_EDIT_OPTIONS_LIST,
} from "@/constant/puzzle";
import { dictInfo } from "@/dict/index";
import { computed, onMounted, ref } from "vue";
import { PuzzleStateType, usePuzzleStore } from "@/store/modules/puzzle";
import { StandardPuzzleNum } from "@/enum";
import { nanoid } from "nanoid/non-secure";

type IImageInfo = API.ArrayElement<PuzzleStateType["imageList"]>;

interface ChildItemPosition {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
}

const puzzleStore = usePuzzleStore();

// 展开/收起
const isExpand = ref<boolean>(true);

// 配置项展开收起
const isConfigExpand = ref<boolean>(false);

// 透明度展开
const isOpacityExpand = ref<boolean>(false);

// 高级编辑展开收起
const isAdvancedEditExpand = ref<boolean>(false);

// 相框编辑展开收起
const isFrameEditExpand = ref<boolean>(false);

// 透明度值
const opacityValue = ref<number>(100);

// 外框值
const frameValue = ref<number>(0);

// 圆角值
const borderRadiusValue = ref<number>(0);

// 内框值
const innerFrameValue = ref<number>(0);

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
  isConfigExpand.value = true;
  isExpand.value = false;
  if (isOpacityExpand.value) {
    opacityValue.value = selectImageList.value[cIndex].opacity * 100;
  }
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
  selectImageList.value[index1] = {
    ...selectImageList.value[index2],
    offsetX: 0,
    offsetY: 0,
  };
  selectImageList.value[index2] = { ...temp, offsetX: 0, offsetY: 0 };
};

// 存储图片拖动的起始触摸位置
const startTouchPosition = ref<{ x: number; y: number } | null>(null);
// 存储图片拖动开始时的初始偏移值
const startImageOffset = ref<{ x: number; y: number } | null>(null);
// 存储当前正在移动的图片索引
const currentMovingImageIndex = ref<number | null>(null);
// 存储是否正在移动图片
const isMovingImage = ref<boolean>(false);

const handleTouchStart = (event: TouchEvent, cIndex: number) => {
  // 记录开始触摸的索引
  touchElementIndex.value = cIndex;
  currentMovingImageIndex.value = cIndex;
  isMoving.value = true;
  isMovingImage.value = true;

  // 记录触摸的位置，用于计算元素拖动
  const offsetX = (event.currentTarget as HTMLElement).offsetLeft;
  const offsetY = (event.currentTarget as HTMLElement).offsetTop;
  touchElementPosition.value = {
    x: event.touches[0].clientX - offsetX,
    y: event.touches[0].clientY - offsetY,
  };

  // 记录触摸位置，用于计算图片偏移
  const touch = event.touches[0];
  startTouchPosition.value = {
    x: touch.clientX,
    y: touch.clientY,
  };

  // 记录当前图片的初始偏移值
  const currentItem = selectImageList.value[cIndex];
  startImageOffset.value = {
    x: currentItem.offsetX || 0,
    y: currentItem.offsetY || 0,
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

  // 获取当前触摸位置
  const touch = event.touches[0];

  // 1. 处理元素的拖动 (用于交换位置)
  const touchOffsetX = touchElementPosition.value.x;
  const touchOffsetY = touchElementPosition.value.y;

  const offsetX = (event.currentTarget as HTMLElement).offsetLeft;
  const offsetY = (event.currentTarget as HTMLElement).offsetTop;

  moveElementPosition.value = {
    x: touch.clientX - offsetX - touchOffsetX,
    y: touch.clientY - offsetY - touchOffsetY,
  };

  // 记录当前触摸点的绝对位置
  touchPosition.value = {
    x: touch.clientX,
    y: touch.clientY,
  };

  // 检查触摸点下的元素
  checkTouchTarget();

  // 2. 处理图片内部的偏移调整 (当没有高亮目标时)
  if (
    isMovingImage.value &&
    currentMovingImageIndex.value !== null &&
    highlightTargetIndex.value === null
  ) {
    const currentItem = selectImageList.value[currentMovingImageIndex.value];

    // 计算触摸移动的距离
    const deltaX = touch.clientX - startTouchPosition.value.x;
    const deltaY = touch.clientY - startTouchPosition.value.y;

    // 更新图片偏移量为初始偏移量加上移动距离
    currentItem.offsetX = startImageOffset.value.x + deltaX;
    currentItem.offsetY = startImageOffset.value.y + deltaY;
  }
};

const handleTouchEnd = (event: TouchEvent, cIndex: number) => {
  if (isMoving.value && highlightTargetIndex.value !== null) {
    // 如果有高亮目标，交换两个元素
    swapElements(touchElementIndex.value!, highlightTargetIndex.value);
  }

  // 重置所有状态
  isMoving.value = false;
  isMovingImage.value = false;
  currentMovingImageIndex.value = null;
  touchElementPosition.value = { x: 0, y: 0 };
  moveElementPosition.value = { x: 0, y: 0 };
  startTouchPosition.value = null;
  startImageOffset.value = null;
  highlightTargetIndex.value = null;
};

const onHandleExpand = () => {
  isExpand.value = !isExpand.value;
};

const onHandleConfigExpand = () => {
  if (isConfigExpand.value) {
    isConfigExpand.value = false;
    isExpand.value = true;
  } else {
    isConfigExpand.value = true;
    isExpand.value = false;
  }
};

const onHandleOpacityExpand = () => {
  isOpacityExpand.value = false;
  isConfigExpand.value = true;
};

const onHandleAdvancedEditExpand = () => {
  if (isAdvancedEditExpand.value) {
    isAdvancedEditExpand.value = false;
    isExpand.value = true;
  } else {
    isAdvancedEditExpand.value = true;
    isExpand.value = false;
    isConfigExpand.value = false;
    isOpacityExpand.value = false;
  }
};

const onHandleFrameEditExpand = () => {
  if (isFrameEditExpand.value) {
    isFrameEditExpand.value = false;
    isExpand.value = true;
  } else {
    isFrameEditExpand.value = true;
    isExpand.value = false;
  }
};

const handleOpacityDragMove = (info: { value: number }) => {
  const currentItem = selectImageList.value[selectImageIndex.value];
  currentItem.opacity = info.value / 100;
};

const handleReplaceImage = (key: string) => {
  console.log(key, "key");
  uni.chooseMedia({
    count: 1,
    mediaType: ["image"],
    sourceType: ["album"],
    success: async (res) => {
      const promiseList = res.tempFiles.map((item) => {
        return new Promise((resolve) => {
          uni.getImageInfo({
            src: item.tempFilePath,
            success: (imageRes) => {
              resolve({
                id: nanoid(),
                url: item.tempFilePath,
                width: imageRes.width,
                height: imageRes.height,
              });
            },
            fail: (err) => {
              console.error("获取图片信息失败:", err);
              resolve({
                id: nanoid(),
                url: item.tempFilePath,
                width: 0,
                height: 0,
              });
            },
          });
        });
      });
      const imageInfoList = await Promise.all(promiseList);
      const newImageInfo = imageInfoList[0] as IImageInfo;
      const newSelectImageList = [...selectImageList.value]?.map(
        (item, index) => {
          if (index === selectImageIndex.value) {
            return {
              ...item,
              url: newImageInfo.url,
              width: newImageInfo.width,
              height: newImageInfo.height,
            };
          }
          return item;
        }
      );
      selectImageList.value = newSelectImageList as IImageInfo[];
    },
  });
};

const handleRotateImage = (key: string) => {
  const currentItem = selectImageList.value[selectImageIndex.value];
  currentItem.rotate += 90;
};

const handleHorizontalFlipImage = (key: string) => {
  const currentItem = selectImageList.value[selectImageIndex.value];
  currentItem.scaleX = -currentItem.scaleX;
};

const handleVerticalFlipImage = (key: string) => {
  const currentItem = selectImageList.value[selectImageIndex.value];
  currentItem.scaleY = -currentItem.scaleY;
};

const handleOpacityImage = (key: string) => {
  const currentItem = selectImageList.value[selectImageIndex.value];
  opacityValue.value = (currentItem.opacity ?? 1) * 100;
  isOpacityExpand.value = true;
  isConfigExpand.value = false;
};

const handleZoomMagnifyImage = (key: string) => {
  const currentItem = selectImageList.value[selectImageIndex.value];
  currentItem.scale += 0.1;
};

const handleZoomLessenImage = (key: string) => {
  const currentItem = selectImageList.value[selectImageIndex.value];
  currentItem.scale -= 0.1;
};

const handlePuzzleOption = (key: string) => {
  if (key === "1") {
    // 滤镜
  }
  if (key === "2") {
    // 替换
    handleReplaceImage(key);
  }
  if (key === "3") {
    // 编辑
  }
  if (key === "4") {
    // 旋转90°
    handleRotateImage(key);
  }
  if (key === "5") {
    // 水平翻转
    handleHorizontalFlipImage(key);
  }
  if (key === "6") {
    // 垂直翻转
    handleVerticalFlipImage(key);
  }
  if (key === "7") {
    // 透明度
    handleOpacityImage(key);
  }
  if (key === "8") {
    // 放大
    handleZoomMagnifyImage(key);
  }
  if (key === "9") {
    // 缩小
    handleZoomLessenImage(key);
  }
};

const handleAdvancedEditOption = (key: string) => {
  if (key === "1") {
    // 相框
    isFrameEditExpand.value = true;
    isAdvancedEditExpand.value = false;
  }
  if (key === "2") {
    // 文字
  }
};

onMounted(() => {
  selectImageList.value = puzzleStore.getImageList;
});

// 添加绘制圆角矩形的辅助函数
const drawRoundedRect = (
  ctx: UniApp.CanvasContext,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  // 确保圆角半径不超过宽高的一半
  radius = Math.min(radius, width / 2, height / 2);
  
  if (radius <= 0) {
    // 如果没有圆角，直接绘制矩形
    ctx.rect(x, y, width, height);
    return;
  }

  // 绘制圆角矩形路径
  ctx.moveTo(x + radius, y);                              // 从左上角的圆弧右侧开始
  ctx.lineTo(x + width - radius, y);                      // 到右上角圆弧左侧
  ctx.arc(x + width - radius, y + radius, radius, -Math.PI/2, 0); // 绘制右上角圆弧
  ctx.lineTo(x + width, y + height - radius);             // 到右下角圆弧上侧
  ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI/2); // 绘制右下角圆弧
  ctx.lineTo(x + radius, y + height);                     // 到左下角圆弧右侧
  ctx.arc(x + radius, y + height - radius, radius, Math.PI/2, Math.PI); // 绘制左下角圆弧
  ctx.lineTo(x, y + radius);                              // 到左上角圆弧下侧
  ctx.arc(x + radius, y + radius, radius, Math.PI, -Math.PI/2); // 绘制左上角圆弧
  
  // 不需要调用closePath，因为最后一个圆弧会回到起点
};

const handleSavePuzzle = () => {
  // 显示loading
  uni.showLoading({
    title: '正在保存...',
    mask: true
  });

  uni
    .createSelectorQuery()
    .select("#puzzleContainer")
    .boundingClientRect((containerRect: UniApp.NodeInfo) => {
      if (!containerRect) {
        uni.hideLoading(); // 隐藏loading
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
            uni.hideLoading(); // 隐藏loading
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

            // 计算圆角半径（按比例缩放）
            const borderRadius = borderRadiusValue.value * Math.min(scaleX, scaleY);

            // 绘制子元素背景（带圆角）
            ctx.save(); // 保存当前状态，以便后面恢复

            ctx.fillStyle = "#b2b2b2";

            // 绘制圆角矩形并填充
            ctx.beginPath(); // 确保开始一个新路径
            drawRoundedRect(
              ctx,
              canvasLeft,
              canvasTop,
              canvasItemWidth,
              canvasItemHeight,
              borderRadius
            );
            ctx.fill();

            // 如果有图片URL，则绘制图片
            if (item.url) {
              // 计算图片的偏移量（按比例缩放）
              const offsetXScaled = (item.offsetX || 0) * scaleX;
              const offsetYScaled = (item.offsetY || 0) * scaleY;

              // 获取图片的显示模式
              const imageInfo = selectStylePuzzleInfo.value.children[index];
              const imageMode = getImageMode(item, imageInfo);

              // 创建单独的裁剪区域
              ctx.save(); // 再次保存状态，以便之后恢复图片变换前的状态

              // 创建圆角裁剪区域（子元素的圆角矩形区域）
              ctx.beginPath(); // 确保开始一个新的路径
              drawRoundedRect(
                ctx,
                canvasLeft,
                canvasTop,
                canvasItemWidth,
                canvasItemHeight,
                borderRadius
              );
              ctx.clip();

              // 应用透明度
              ctx.globalAlpha = item.opacity !== undefined ? item.opacity : 1;

              // 根据不同的图片显示模式计算绘制参数
              let drawX = canvasLeft + offsetXScaled;
              let drawY = canvasTop + offsetYScaled;
              let drawWidth = canvasItemWidth;
              let drawHeight = canvasItemHeight;

              if (imageMode === "widthFix") {
                // 宽度固定，高度自适应
                drawWidth = canvasItemWidth;
                const aspectRatio = item.height / item.width;
                drawHeight = drawWidth * aspectRatio;
                // 垂直居中
                if (drawHeight < canvasItemHeight) {
                  drawY += (canvasItemHeight - drawHeight) / 2;
                }
              } else if (imageMode === "heightFix") {
                // 高度固定，宽度自适应
                drawHeight = canvasItemHeight;
                const aspectRatio = item.width / item.height;
                drawWidth = drawHeight * aspectRatio;
                // 水平居中
                if (drawWidth < canvasItemWidth) {
                  drawX += (canvasItemWidth - drawWidth) / 2;
                }
              } else if (imageMode === "aspectFill") {
                // 保持纵横比填充整个区域
                const imgRatio = item.width / item.height;
                const boxRatio = canvasItemWidth / canvasItemHeight;

                if (imgRatio > boxRatio) {
                  // 图片较宽，以高度为基准
                  drawHeight = canvasItemHeight;
                  drawWidth = drawHeight * imgRatio;
                  // 水平居中裁剪
                  drawX += (canvasItemWidth - drawWidth) / 2;
                } else {
                  // 图片较高，以宽度为基准
                  drawWidth = canvasItemWidth;
                  drawHeight = drawWidth / imgRatio;
                  // 垂直居中裁剪
                  drawY += (canvasItemHeight - drawHeight) / 2;
                }
              }

              // 旋转和缩放处理
              ctx.save(); // 再次保存状态，只为变换操作

              // 计算变换的中心点：图片在画布上的实际中心
              const centerX = drawX + drawWidth / 2;
              const centerY = drawY + drawHeight / 2;

              // 平移到中心点
              ctx.translate(centerX, centerY);

              // 应用旋转（如果有）
              const rotateValue = item.rotate || 0;
              ctx.rotate((rotateValue * Math.PI) / 180);

              // 应用缩放（如果有）
              const scaleXValue = item.scaleX !== undefined ? item.scaleX : 1;
              const scaleYValue = item.scaleY !== undefined ? item.scaleY : 1;
              const scaleValue = item.scale !== undefined ? item.scale : 1;

              // 应用X轴、Y轴和整体的缩放
              // 注意：整体scale会与x和y方向的缩放相乘
              ctx.scale(scaleXValue * scaleValue, scaleYValue * scaleValue);

              // 将坐标系移回去，使绘制位置相对于变换中心
              ctx.translate(-drawWidth / 2, -drawHeight / 2);

              // 以(0,0)为起点绘制图片，因为已经通过平移调整了坐标系
              ctx.drawImage(item.url, 0, 0, drawWidth, drawHeight);

              // 恢复变换前的状态
              ctx.restore();

              // 恢复裁剪区域前的状态
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
            
            // 恢复最初的状态
            ctx.restore();
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
                    uni.hideLoading(); // 隐藏loading
                    uni.showToast({
                      title: "保存成功",
                      icon: "success",
                    });
                  },
                  fail: (err) => {
                    uni.hideLoading(); // 隐藏loading
                    console.log(err, "保存到相册失败");
                    uni.showToast({
                      title: "保存失败",
                      icon: "none",
                    });
                  },
                });
              },
              fail: (err) => {
                uni.hideLoading(); // 隐藏loading
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
  const publicStyle = {
    transform: `rotate(${item.rotate}deg) scaleX(${item.scaleX}) scaleY(${item.scaleY}) scale(${item.scale})`,
  };
  if (standar === StandardPuzzleNum.WIDTH) {
    return {
      width: "100%!important",
      ...publicStyle,
    };
  }
  if (standar === StandardPuzzleNum.HEIGHT) {
    return {
      height: "100%!important",
      ...publicStyle,
    };
  }
  if (standar === StandardPuzzleNum.EQUAL) {
    return {
      width: "100%",
      height: "100%",
      ...publicStyle,
    };
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
};
</script>
<template>
  <div class="size-full h-[100vh] overflow-hidden bg-[#e4f0f9] relative">
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
          class="size-full grid"
          :style="{
            ...(selectStylePuzzleInfo?.style as any),
            padding: `${frameValue}px`,
            gap: `${innerFrameValue}px`,
          }"
          id="puzzleContainer"
          ref="puzzleContainer"
        >
          <div
            v-for="(item, cIndex) in selectImageList"
            :key="cIndex"
            class="bg-[white] box-border childItem overflow-hidden flex justify-center items-center"
            :id="`childItem_${cIndex}`"
            :style="{
              ...(selectStylePuzzleInfo?.children?.[cIndex] as any),
              borderRadius: `${borderRadiusValue}px`,
            }"
            :class="{
              'outline-[2px] outline-[#396be5]': selectImageIndex === cIndex,
              'border-2 border-[#ff9900] highlight-target':
                highlightTargetIndex === cIndex,
              'dragging-element': isMoving && touchElementIndex === cIndex,
            }"
            @touchstart="handleTouchStart($event, cIndex)"
            @touchmove="handleTouchMove($event, cIndex)"
            @touchend="handleTouchEnd($event, cIndex)"
            @click="handleSelectImage(cIndex)"
          >
            <div
              class="size-full"
              :style="{
                transform: `translate(${item.offsetX}px, ${item.offsetY}px)`,
                opacity: item.opacity,
              }"
            >
              <image
                :src="item.url"
                alt=""
                :mode="
                  getImageMode(item, selectStylePuzzleInfo.children[cIndex])
                "
                :data-width="item.width"
                :data-height="item.height"
                :style="
                  getImageStyle(item, selectStylePuzzleInfo.children[cIndex])
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑图片弹窗 -->
    <div
      class="w-full bg-[#fff] absolute bottom-0 left-0 rounded-t-[24rpx] flex flex-col"
      :style="{
        transition: 'height 0.3s ease-in-out',
        transformOrigin: 'bottom',
        height: isExpand ? '30vh' : '100rpx',
      }"
    >
      <div
        class="absolute top-[-80rpx] right-[20rpx] size-[50rpx] flex items-center justify-center rounded-[50%] bg-[#fff]"
        :class="{ 'rotate-180': !isExpand }"
        @click="onHandleExpand"
      >
        <wd-icon
          name="arrow-down"
          size="22px"
          custom-style="transform: translateY(2px);"
        ></wd-icon>
      </div>
      <div
        class="absolute top-[-80rpx] left-[20rpx] h-[50rpx] px-[16rpx] flex gap-[6rpx] items-center justify-center rounded-[25rpx] bg-[#fff]"
        @click="onHandleAdvancedEditExpand"
      >
        <image
          src="https://img.picui.cn/free/2025/05/21/682db2dceb5d6.png"
          class="size-[24rpx]"
        />
        <div class="text-[24rpx]">高级编辑</div>
      </div>
      <div
        class="w-full h-[100rpx] px-[32rpx] py-[18rpx] border-b border-[#f2f2f2] overflow-hidden"
        :style="{
          height: isExpand ? '100rpx' : '0',
          padding: isExpand ? '18rpx 32rpx' : '0',
          borderBottom: isExpand ? '1px solid #f2f2f2' : 'none',
          transition: 'all 0.1s ease-in-out',
        }"
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
        :style="{
          height: isExpand ? 'auto' : '0',
          padding: isExpand ? '12rpx' : '0',
          transition: 'all 0.2s ease-in-out',
        }"
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
    <!-- 编辑图片弹窗 -->
    <div
      class="absolute w-full bottom-0 left-0 rounded-t-[24rpx] bg-[#fff]"
      :style="{
        height: isConfigExpand ? '250rpx' : '0',
        transition: 'height 0.3s ease-in-out',
      }"
    >
      <div
        class="absolute top-[12rpx] right-[12rpx] size-[50rpx] flex flex-col z-[2]"
        :class="{ 'rotate-180': !isConfigExpand }"
        @click="onHandleConfigExpand"
      >
        <wd-icon
          name="arrow-down"
          size="22px"
          custom-style="transform: translateY(2px);"
        ></wd-icon>
      </div>
      <div class="w-full h-[80rpx] flex justify-center items-center">
        编辑图片
      </div>
      <div class="flex-1 px-[16rpx] mt-[6rpx]">
        <scroll-view scroll-x="true" class="whitespace-nowrap">
          <div
            class="size-[100rpx] mr-[12rpx]"
            v-for="item in PUZZLE_OPTIONS_LIST"
            :key="item.key"
            :style="{
              display: item.hide ? 'none' : 'inline-block',
            }"
            @click="handlePuzzleOption(item.key)"
          >
            <div
              class="size-full flex flex-col items-center justify-center gap-[6rpx]"
            >
              <image
                :src="item.icon"
                class="size-[48rpx]"
                :style="{
                  transform: `scale(${item.scale ?? 1})`,
                }"
              />
              <div class="text-[24rpx]">{{ item.label }}</div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <!-- 透明度弹窗 -->
    <div
      class="absolute w-full bottom-0 left-0 rounded-t-[24rpx] bg-[#fff]"
      :style="{
        height: isOpacityExpand ? '250rpx' : '0',
        transition: 'height 0.3s ease-in-out',
      }"
    >
      <div
        class="absolute top-[12rpx] right-[12rpx] size-[50rpx] flex flex-col z-[2]"
        :class="{ 'rotate-180': !isOpacityExpand }"
        @click="onHandleOpacityExpand"
      >
        <wd-icon
          name="arrow-down"
          size="22px"
          custom-style="transform: translateY(2px);"
        ></wd-icon>
      </div>
      <div class="w-full h-[80rpx] flex justify-center items-center">
        透明度
      </div>
      <div class="px-[32rpx]">
        <wd-slider v-model="opacityValue" @dragmove="handleOpacityDragMove" />
      </div>
    </div>
    <!-- 高级编辑弹窗 -->
    <div
      class="absolute w-full bottom-0 left-0 rounded-t-[24rpx] bg-[#fff]"
      :style="{
        height: isAdvancedEditExpand ? '250rpx' : '0',
        transition: 'height 0.3s ease-in-out',
      }"
    >
      <div
        class="absolute top-[12rpx] right-[12rpx] size-[50rpx] flex flex-col z-[2]"
        :class="{ 'rotate-180': !isAdvancedEditExpand }"
        @click="onHandleAdvancedEditExpand"
      >
        <wd-icon
          name="arrow-down"
          size="22px"
          custom-style="transform: translateY(2px);"
        ></wd-icon>
      </div>
      <div class="w-full h-[80rpx] flex justify-center items-center">
        高级编辑
      </div>
      <div class="px-[32rpx] mt-[18rpx]">
        <scroll-view scroll-x="true" class="whitespace-nowrap">
          <div
            class="size-[100rpx] mr-[12rpx] inline-block"
            v-for="item in PUZZLE_ADVANCED_EDIT_OPTIONS_LIST"
            :key="item.key"
            @click="handleAdvancedEditOption(item.key)"
          >
            <div
              class="size-full flex flex-col items-center justify-center gap-[6rpx]"
            >
              <image :src="item.icon" class="size-[48rpx]" />
              <div class="text-[24rpx]">{{ item.label }}</div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <!-- 相框弹窗 -->
    <div
      class="absolute w-full bottom-0 left-0 rounded-t-[24rpx] bg-[#fff]"
      :style="{
        height: isFrameEditExpand ? '400rpx' : '0',
        transition: 'height 0.3s ease-in-out',
      }"
    >
      <div
        class="absolute top-[12rpx] right-[12rpx] size-[50rpx] flex flex-col z-[2]"
        :class="{ 'rotate-180': !isFrameEditExpand }"
        @click="onHandleFrameEditExpand"
      >
        <wd-icon
          name="arrow-down"
          size="22px"
          custom-style="transform: translateY(2px);"
        ></wd-icon>
      </div>
      <div class="w-full h-[80rpx] flex justify-center items-center">
        相框编辑
      </div>
      <div class="px-[32rpx] mt-[18rpx] flex flex-col gap-[16rpx]">
        <div class="flex items-center justify-between gap-[46rpx]">
          <div class="text-[24rpx]">外框</div>
          <wd-slider
            v-model="frameValue"
            :hide-min-max="true"
            :max="100"
            :min="0"
            custom-class="flex-1 !p-0 frameSlider"
          />
        </div>
        <div class="flex items-center justify-between gap-[46rpx]">
          <div class="text-[24rpx]">内框</div>
          <wd-slider
            v-model="innerFrameValue"
            :hide-min-max="true"
            :max="100"
            :min="0"
            custom-class="flex-1 !p-0 frameSlider"
          />
        </div>
        <div class="flex items-center justify-between gap-[46rpx]">
          <div class="text-[24rpx]">圆角</div>
          <wd-slider
            v-model="borderRadiusValue"
            :hide-min-max="true"
            :max="100"
            :min="0"
            custom-class="flex-1 !p-0 frameSlider"
          />
        </div>
      </div>
    </div>
    <canvas
      canvas-id="puzzleCanvas"
      style="width: 4096px; height: 4096px"
      :style="{
        marginTop: '100vh',
      }"
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

:deep(.frameSlider) {
  .wd-slider__button-wrapper {
    .wd-slider__button {
      width: 28rpx !important;
      height: 28rpx !important;
    }
    .wd-slider__label {
      left: -8rpx !important;
      bottom: 40rpx !important;
    }
  }
}
</style>

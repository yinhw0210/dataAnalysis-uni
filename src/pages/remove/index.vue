<route lang="json5" type="home">
{
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, reactive, nextTick } from "vue";
import { useRemoveStore } from "@/store/modules/remove";
import { onLoad } from "@dcloudio/uni-app";
import { base64ToTempFilePath } from "@/utils";
import removeService from "@/services/removeService";
const removeStore = useRemoveStore();

const originalInfo = ref({
  url: "",
  width: 0,
  height: 0,
});

// 用于存储当前图片的base64数据
const currentImageBase64 = ref("");

onLoad((options) => {
  if(removeStore.imageInfo){
    originalInfo.value = removeStore.imageInfo;
  }
});

const imageInfo = computed(() => {
  return originalInfo.value
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

const brushSize = ref(1);

// 是否正在加载图片
const isLoading = ref(true);

// 撤销和重做相关状态
const historyStack = ref<
  Array<{
    points: Array<{ x: number; y: number; size: number }>;
    brushPointsCount: number;
  }>
>([]);
const redoStack = ref<
  Array<{
    points: Array<{ x: number; y: number; size: number }>;
    brushPointsCount: number;
  }>
>([]);
const currentStroke = ref<Array<{ x: number; y: number; size: number }>>([]);
const canUndo = computed(() => historyStack.value.length > 0);
const canRedo = computed(() => redoStack.value.length > 0);

// Canvas相关
const canvasId = "mainCanvas";
const maskCanvasId = "maskCanvas";
const canvasState = reactive({
  ctx: null as any,
  maskCtx: null as any,
  isDrawing: false,
  originalImageWidth: 0,
  originalImageHeight: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  scaleRatio: 1, // 用于记录图片缩放比例
  imageLocalPath: "", // 用于存储图片本地路径
  brushPoints: [] as Array<{ x: number; y: number; size: number }>, // 存储所有涂抹点
  lastPoint: null as { x: number; y: number } | null, // 上一个涂抹点的位置
});

// 减少重绘次数的性能优化变量
const drawTimeout = ref<any>(null);
const drawBatchPoints = ref<Array<{ x: number; y: number; size: number }>>([]);
const maskDrawTimeout = ref<any>(null);
const maskBatchPoints = ref<Array<{ x: number; y: number; size: number }>>([]);

// 初始化Canvas
const initCanvas = () => {
  if (!imageInfo.value?.url) {
    console.error("图片URL为空");
    return;
  }

  isLoading.value = true;

  // 获取设备信息，用于计算尺寸
  const systemInfo = uni.getSystemInfoSync();
  const screenWidth = systemInfo.windowWidth;

  // 直接使用imageInfo中的宽高信息
  const originalWidth = imageInfo.value.width || 0;
  const originalHeight = imageInfo.value.height || 0;

  // 判断URL是否为网络地址
  const isHttpUrl =
    imageInfo.value.url.startsWith("http://") ||
    imageInfo.value.url.startsWith("https://");

  // 如果已经是本地文件路径，直接使用
  if (!isHttpUrl) {
    canvasState.imageLocalPath = imageInfo.value.url;
    console.log("使用本地图片路径:", canvasState.imageLocalPath);

    // 将本地文件转换为base64
    convertLocalFileToBase64(canvasState.imageLocalPath);

    // 处理尺寸计算和Canvas初始化
    processImageAndInitCanvas(originalWidth, originalHeight, screenWidth);
  } else {
    // 网络图片需要下载
    console.log("下载网络图片:", imageInfo.value.url);
    uni.downloadFile({
      url: imageInfo.value.url,
      success: (downloadRes) => {
        if (downloadRes.statusCode === 200) {
          canvasState.imageLocalPath = downloadRes.tempFilePath;
          console.log("图片下载成功:", downloadRes.tempFilePath);

          // 将下载的文件转换为base64
          convertLocalFileToBase64(downloadRes.tempFilePath);

          // 处理尺寸计算和Canvas初始化
          processImageAndInitCanvas(originalWidth, originalHeight, screenWidth);
        } else {
          console.error("下载图片失败，状态码:", downloadRes.statusCode);
          isLoading.value = false;
        }
      },
      fail: (err) => {
        console.error("下载图片失败:", err);
        isLoading.value = false;
      },
    });
  }
};

// 将本地文件转换为base64
const convertLocalFileToBase64 = (filePath) => {
  uni.getFileSystemManager().readFile({
    filePath: filePath,
    encoding: "base64",
    success: function(res) {
      currentImageBase64.value = "data:image/jpeg;base64," + res.data;
      console.log("图片转换为base64成功");
    },
    fail: function(err) {
      console.error("转换base64失败:", err);
      uni.showToast({
        title: "图片处理失败",
        icon: "none"
      });
    }
  });
};

// 处理图片尺寸并初始化Canvas
const processImageAndInitCanvas = (
  originalWidth: number,
  originalHeight: number,
  screenWidth: number
) => {
  if (originalWidth > 0 && originalHeight > 0) {
    // 使用已知的尺寸
    setupCanvasWithDimensions(originalWidth, originalHeight, screenWidth);
  } else {
    // 需要获取图片尺寸
    uni.getImageInfo({
      src: canvasState.imageLocalPath,
      success: (res) => {
        console.log("获取图片信息成功:", res);
        setupCanvasWithDimensions(res.width, res.height, screenWidth);
      },
      fail: (err) => {
        console.error("获取图片信息失败:", err);
        isLoading.value = false;
      },
    });
  }
};

// 根据尺寸设置Canvas并初始化
const setupCanvasWithDimensions = (
  imgWidth: number,
  imgHeight: number,
  screenWidth: number
) => {
  // 设置原始尺寸
  canvasState.originalImageWidth = imgWidth;
  canvasState.originalImageHeight = imgHeight;

  // 计算显示尺寸
  const displayWidth = screenWidth - 48; // 考虑margin
  const displayHeight = displayWidth * (imgHeight / imgWidth);

  canvasState.canvasWidth = displayWidth;
  canvasState.canvasHeight = displayHeight;

  // 计算缩放比例
  canvasState.scaleRatio = imgWidth / displayWidth;

  console.log("图片尺寸:", imgWidth, imgHeight);
  console.log("显示尺寸:", displayWidth, displayHeight);
  console.log("缩放比例:", canvasState.scaleRatio);

  // 初始化Canvas
  nextTick(() => {
    initMainCanvas(canvasState.imageLocalPath);
    initMaskCanvas();
    isLoading.value = false;
  });
};

// 初始化主Canvas
const initMainCanvas = (imagePath: string) => {
  const ctx = uni.createCanvasContext(canvasId);
  canvasState.ctx = ctx;

  if (!ctx) {
    console.error("无法创建主Canvas上下文");
    return;
  }

  console.log("开始绘制主Canvas");

  // 设置更高质量的线条渲染
  ctx.setLineCap("round");
  ctx.setLineJoin("round");

  ctx.drawImage(
    imagePath,
    0,
    0,
    canvasState.canvasWidth,
    canvasState.canvasHeight
  );
  ctx.draw();
};

// 初始化蒙版Canvas
const initMaskCanvas = () => {
  const maskCtx = uni.createCanvasContext(maskCanvasId);
  canvasState.maskCtx = maskCtx;

  if (!maskCtx) {
    console.error("无法创建蒙版Canvas上下文");
    return;
  }

  console.log(
    "开始绘制蒙版Canvas, 尺寸:",
    canvasState.originalImageWidth,
    canvasState.originalImageHeight
  );

  // 设置更高质量的线条渲染
  maskCtx.setLineCap("round");
  maskCtx.setLineJoin("round");
  maskCtx.lineWidth = 3;

  // 填充黑色背景
  maskCtx.setFillStyle("#000000");
  maskCtx.fillRect(
    0,
    0,
    canvasState.originalImageWidth,
    canvasState.originalImageHeight
  );
  maskCtx.draw();
};

// 开始绘制
const startDrawing = (event: any) => {
  canvasState.isDrawing = true;

  // 清除任何现有的批处理超时
  if (drawTimeout.value) {
    clearTimeout(drawTimeout.value);
  }

  // 获取起始点
  const touchPos = getTouchPosition(event);

  // 设置为上一个点
  canvasState.lastPoint = touchPos;

  // 开始新的笔画，清空当前笔画记录
  currentStroke.value = [];

  // 开始绘制
  drawSingle(touchPos.x, touchPos.y);
};

// 结束绘制
const stopDrawing = () => {
  canvasState.isDrawing = false;
  canvasState.lastPoint = null; // 清空上一点位置

  // 确保任何批处理绘制操作都被执行
  if (drawTimeout.value) {
    clearTimeout(drawTimeout.value);
    batchDraw();
  }

  if (maskDrawTimeout.value) {
    clearTimeout(maskDrawTimeout.value);
    batchMaskDraw();
  }

  // 如果当前笔画存在且不为空，将其添加到历史栈
  if (currentStroke.value.length > 0) {
    historyStack.value.push({
      points: [...currentStroke.value],
      brushPointsCount: canvasState.brushPoints.length,
    });
    // 新的操作后清空重做栈
    redoStack.value = [];
  }
};

// 获取正确的触摸坐标
const getTouchPosition = (event: any) => {
  if (!event.touches || !event.touches[0]) return { x: 0, y: 0 };

  // 获取触摸点信息
  const touch = event.touches[0];

  // 获取准确的触摸坐标
  const x = touch.x || touch.pageX;
  const y = touch.y || touch.pageY;

  return { x, y };
};

// 主绘制函数
const draw = (event: any) => {
  if (!canvasState.isDrawing || !canvasState.ctx || !canvasState.maskCtx)
    return;

  // 获取当前触摸点坐标
  const touchPos = getTouchPosition(event);
  const x = touchPos.x;
  const y = touchPos.y;

  // 如果没有上一个点（首次触摸），仅绘制当前点
  if (!canvasState.lastPoint) {
    drawSingle(x, y);
  } else {
    // 有上一个点，则绘制从上一点到当前点的线条
    drawLine(canvasState.lastPoint.x, canvasState.lastPoint.y, x, y);
  }

  // 更新上一个点的位置
  canvasState.lastPoint = { x, y };
};

// 绘制单个点
const drawSingle = (x: number, y: number) => {
  // 增加画笔大小，确保足够的覆盖面积
  const brushWidth = brushSize.value * 10; 

  // 添加到批处理队列
  drawBatchPoints.value.push({ x, y, size: brushWidth });

  // 计算蒙版坐标 - 将屏幕坐标转换为原始图像坐标
  const maskX = x * canvasState.scaleRatio;
  const maskY = y * canvasState.scaleRatio;
  // 确保蒙版上的画笔大小合适
  const maskBrushWidth = Math.max(brushWidth * canvasState.scaleRatio, 10);

  // 添加到蒙版批处理队列
  maskBatchPoints.value.push({ x: maskX, y: maskY, size: maskBrushWidth });

  // 存储涂抹点用于导出
  const pointData = {
    x: maskX,
    y: maskY,
    size: maskBrushWidth,
  };
  canvasState.brushPoints.push(pointData);

  // 将点添加到当前笔画
  currentStroke.value.push(pointData);

  // 设置批处理绘制定时器
  if (!drawTimeout.value) {
    drawTimeout.value = setTimeout(batchDraw, 5); 
  }

  if (!maskDrawTimeout.value) {
    maskDrawTimeout.value = setTimeout(batchMaskDraw, 5); 
  }
};

// 批处理绘制显示canvas
const batchDraw = () => {
  if (!canvasState.ctx || drawBatchPoints.value.length === 0) {
    drawTimeout.value = null;
    return;
  }

  const ctx = canvasState.ctx;
  ctx.setFillStyle("rgba(255, 0, 0, 0.5)");

  // 绘制所有点
  drawBatchPoints.value.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // 一次性绘制
  ctx.draw(true);

  // 清空批处理队列
  drawBatchPoints.value = [];
  drawTimeout.value = null;
};

// 批处理绘制蒙版canvas
const batchMaskDraw = () => {
  if (!canvasState.maskCtx || maskBatchPoints.value.length === 0) {
    maskDrawTimeout.value = null;
    return;
  }

  const maskCtx = canvasState.maskCtx;
  maskCtx.setFillStyle("#FFFFFF");
  maskCtx.lineWidth = 3;

  // 绘制所有点
  maskBatchPoints.value.forEach((point) => {
    maskCtx.beginPath();
    maskCtx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    maskCtx.fill();
  });

  // 一次性绘制
  maskCtx.draw(true);

  // 清空批处理队列
  maskBatchPoints.value = [];
  maskDrawTimeout.value = null;
};

// 绘制线条（实现连续涂抹效果）
const drawLine = (lastX: number, lastY: number, x: number, y: number) => {
  const distance = calculateDistance(lastX, lastY, x, y);

  // 无论距离多小，都保证至少绘制一个点
  if (distance < 1) {
    drawSingle(x, y);
    return;
  }

  // 增加采样密度，确保连续性
  // 根据距离动态调整步数，距离越大步数越多
  const steps = Math.max(Math.ceil(distance * 2), 5);

  // 计算每一步的增量
  const xStep = (x - lastX) / steps;
  const yStep = (y - lastY) / steps;

  // 绘制从上一点到当前点之间的多个点，形成连续线条
  for (let i = 0; i <= steps; i++) {
    const currentX = lastX + xStep * i;
    const currentY = lastY + yStep * i;
    drawSingle(currentX, currentY);
  }
};

// 计算两点间距离
const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// 撤销上一步操作
const undo = () => {
  if (historyStack.value.length === 0) return;

  // 从历史栈中移除最后一次操作
  const lastStroke = historyStack.value.pop();

  if (lastStroke) {
    // 添加到重做栈
    redoStack.value.push({
      points: [...lastStroke.points],
      brushPointsCount: canvasState.brushPoints.length,
    });

    // 回退到上一个操作结束时的状态
    // 即删除上一次操作添加的所有点
    const previousCount =
      lastStroke.brushPointsCount - lastStroke.points.length;
    canvasState.brushPoints = canvasState.brushPoints.slice(0, previousCount);

    // 重绘画布
    redrawFromScratch();
  }
};

// 重做上一步撤销的操作
const redo = () => {
  if (redoStack.value.length === 0) return;

  // 从重做栈中取出最后一个操作
  const strokeToRedo = redoStack.value.pop();

  if (strokeToRedo) {
    // 添加回历史栈
    historyStack.value.push({
      points: [...strokeToRedo.points],
      brushPointsCount:
        canvasState.brushPoints.length + strokeToRedo.points.length,
    });

    // 将点添加回所有涂抹点
    canvasState.brushPoints = [
      ...canvasState.brushPoints,
      ...strokeToRedo.points,
    ];

    // 重绘画布
    redrawFromScratch();
  }
};

// 从头重新绘制所有内容
const redrawFromScratch = () => {
  // 重新绘制主Canvas（先清除，然后重新绘制图片）
  if (canvasState.ctx && canvasState.imageLocalPath) {
    const ctx = canvasState.ctx;
    ctx.clearRect(0, 0, canvasState.canvasWidth, canvasState.canvasHeight);
    ctx.drawImage(
      canvasState.imageLocalPath,
      0,
      0,
      canvasState.canvasWidth,
      canvasState.canvasHeight
    );

    // 重新绘制所有涂抹点
    ctx.setFillStyle("rgba(255, 0, 0, 0.5)");

    // 转换坐标系统从蒙版尺寸到显示尺寸
    canvasState.brushPoints.forEach((point) => {
      const displayX = point.x / canvasState.scaleRatio;
      const displayY = point.y / canvasState.scaleRatio;
      const displaySize = point.size / canvasState.scaleRatio;

      ctx.beginPath();
      ctx.arc(displayX, displayY, displaySize, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.draw();
  }

  // 重绘蒙版Canvas
  redrawMaskCanvas();
};

// 重新绘制整个蒙版
const redrawMaskCanvas = () => {
  if (!canvasState.maskCtx) return;

  const maskCtx = canvasState.maskCtx;

  // 清空画布并填充黑色背景
  maskCtx.clearRect(
    0,
    0,
    canvasState.originalImageWidth,
    canvasState.originalImageHeight
  );
  maskCtx.setFillStyle("#000000");
  maskCtx.fillRect(
    0,
    0,
    canvasState.originalImageWidth,
    canvasState.originalImageHeight
  );

  // 如果没有涂抹点，直接返回
  if (canvasState.brushPoints.length === 0) {
    maskCtx.draw();
    return Promise.resolve();
  }

  // 设置白色填充
  maskCtx.setFillStyle("#FFFFFF");
  maskCtx.lineWidth = 3;

  // 改用连线方式绘制，确保连续性
  return new Promise<void>((resolve) => {
    // 首先绘制所有点
    canvasState.brushPoints.forEach((point) => {
      maskCtx.beginPath();
      // 确保最小尺寸
      const pointSize = Math.max(point.size, 10);
      maskCtx.arc(point.x, point.y, pointSize, 0, Math.PI * 2);
      maskCtx.fill();
    });

    // 完成绘制
    maskCtx.draw(false, () => {
      console.log("蒙版重绘完成");
      resolve();
    });
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

// 调取接口获取解析后的图片
const handleRemove = async (maskBase64: string) => {
  uni.showLoading({
    title: "生成中...",
  });
  console.log(maskBase64,'11111');
  const result = await removeService.create({
    image_base64: currentImageBase64.value,
    mask_base64: maskBase64,
  });
  console.log(result,'22222');
  
  // 处理解析结果
  if (result) {
    // 更新当前图片的base64数据
    currentImageBase64.value = result.image_base64;
    
    // 将base64转为临时文件路径用于绘制
    const tempFilePath = await base64ToTempFilePath(result.image_base64);
    
    // 更新本地图片路径
    canvasState.imageLocalPath = tempFilePath;
    
    // 重新绘制画布
    initMainCanvas(tempFilePath);
    
    // 清空涂抹点和历史
    canvasState.brushPoints = [];
    historyStack.value = [];
    redoStack.value = [];
    
    uni.showToast({
      title: "解析成功",
      icon: "success",
    });
  }
  uni.hideLoading();
};

// 保存图片到相册
const saveImageToAlbum = async () => {
  if (!currentImageBase64.value) {
    uni.showToast({
      title: "没有可保存的图片",
      icon: "none"
    });
    return;
  }
  
  uni.showLoading({
    title: "保存中..."
  });
  handleSaveBase64(currentImageBase64.value);
};

// 导出原图
const exportOriginalImage = () => {
  saveImageToAlbum();
};

// 导出涂抹轨迹图片
const exportMaskImage = async () => {
  // 防止没有涂抹点的情况
  if (canvasState.brushPoints.length === 0) {
    console.log("没有涂抹轨迹");
    uni.showToast({
      title: "请先涂抹图片",
      icon: "none",
    });
    return;
  }

  // 显示加载提示
  uni.showLoading({
    title: "解析中...",
  });

  try {
    // 确保所有批处理绘制任务都已完成
    if (drawTimeout.value) {
      clearTimeout(drawTimeout.value);
      batchDraw();
    }

    if (maskDrawTimeout.value) {
      clearTimeout(maskDrawTimeout.value);
      batchMaskDraw();
    }

    // 等待100ms确保异步绘制完成
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 再次重新绘制整个蒙版，确保完整性
    await redrawMaskCanvas();

    // 等待100ms确保重绘完成
    await new Promise(resolve => setTimeout(resolve, 100));

    // 导出蒙版图片
    uni.canvasToTempFilePath({
      canvasId: maskCanvasId,
      fileType: "png",
      width: canvasState.originalImageWidth,
      height: canvasState.originalImageHeight,
      destWidth: canvasState.originalImageWidth,
      destHeight: canvasState.originalImageHeight,
      success: function (res) {
        console.log("涂抹轨迹图片导出成功:", res.tempFilePath);

        // 读取临时文件并转换为base64
        uni.getFileSystemManager().readFile({
          filePath: res.tempFilePath,
          encoding: "base64",
          success: function (readRes) {
            console.log("涂抹轨迹图片base64生成成功");
            const maskBase64 = "data:image/png;base64," + readRes.data;
            
            // 可以在这里预览生成的蒙版，帮助调试
            console.log("生成的蒙版大小:", 
              canvasState.originalImageWidth + "x" + canvasState.originalImageHeight,
              "涂抹点数量:", canvasState.brushPoints.length);
              
            handleRemove(maskBase64);
          },
          fail: function (err) {
            console.error("读取文件失败:", err);
            uni.hideLoading();
            uni.showToast({
              title: "读取文件失败",
              icon: "none",
            });
          },
        });
      },
      fail: function (err) {
        console.error("导出蒙版图片失败:", err);
        uni.hideLoading();
        uni.showToast({
          title: "导出失败",
          icon: "none",
        });
      },
    });
  } catch (error) {
    console.error("导出过程出错:", error);
    uni.hideLoading();
    uni.showToast({
      title: "导出过程出错",
      icon: "none",
    });
  }
};

// 清理资源函数，防止内存泄漏
const cleanupResources = () => {
  // 清除任何定时器
  if (drawTimeout.value) {
    clearTimeout(drawTimeout.value);
    drawTimeout.value = null;
  }

  if (maskDrawTimeout.value) {
    clearTimeout(maskDrawTimeout.value);
    maskDrawTimeout.value = null;
  }

  // 清空批处理队列
  drawBatchPoints.value = [];
  maskBatchPoints.value = [];
};

// 监听组件挂载
onMounted(() => {
  console.log("组件已挂载，开始初始化...");
  setTimeout(() => {
    initCanvas();
  }, 500);
});

// 在页面卸载时清理资源
onUnmounted(() => {
  cleanupResources();
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
      智能消除
    </div>
    <div
      class="flex flex-col overflow-hidden pb-[72rpx]"
      :style="{
        height: contentHeight,
      }"
    >
      <div class="flex-1 flex justify-center items-center">
        <div
          class="size-full m-[24rpx] flex justify-center items-center relative"
        >
          <!-- 加载提示 -->
          <div
            v-if="isLoading"
            class="absolute inset-0 flex items-center justify-center"
          >
            正在加载图片...
          </div>

          <!-- 提示信息 -->
          <div
            class="absolute top-0 left-0 p-2 text-xs opacity-60"
            v-if="!isLoading"
          >
            涂抹区域将显示为红色
          </div>

          <!-- 可见的绘制Canvas -->
          <canvas
            canvas-id="mainCanvas"
            class="w-full"
            @touchstart="startDrawing"
            @touchmove="draw"
            @touchend="stopDrawing"
            @touchcancel="stopDrawing"
            :style="{
              width: canvasState.canvasWidth + 'px',
              height: canvasState.canvasHeight + 'px',
              visibility: isLoading ? 'hidden' : 'visible',
            }"
            disable-scroll
          ></canvas>

          <!-- 隐藏的掩码Canvas（用于导出） -->
          <canvas
            canvas-id="maskCanvas"
            class="absolute opacity-0"
            :style="{
              left: '-9999px',
              width: canvasState.originalImageWidth + 'px',
              height: canvasState.originalImageHeight + 'px',
            }"
          ></canvas>
        </div>
      </div>
      <div
        class="h-[200rpx] flex flex-col py-[24rpx] gap-[28rpx] relative shadow-[0_-10rpx_10rpx_rgba(0,0,0,0.05)] rounded-t-[24rpx]"
      >
        <div class="grid grid-cols-2 gap-[24rpx] mb-[24rpx] absolute top-[-68rpx] left-[6rpx]">
          <div class="size-[56rpx] flex justify-center items-center border p-[6rpx] rounded-full border-gray-200" @click="undo" :class="{ 'opacity-50': !canUndo , 'pointer-events-none': !canUndo }">
            <img src="https://cdn.picui.cn/vip/2025/06/22/68580f1feab63.png" alt="" class="size-full">
          </div>
          <div class="size-[56rpx] flex justify-center items-center border p-[6rpx] rounded-full border-gray-200" @click="redo" :class="{ 'opacity-50': !canRedo , 'pointer-events-none': !canRedo }">
            <img src="https://cdn.picui.cn/vip/2025/06/22/68580f1feae0c.png" alt="" class="size-full">
          </div>
        </div>
        <div class="flex items-center gap-[24rpx]">
          <div class="px-[32rpx] font-bold">画笔大小</div>
          <div class="px-[20rpx] flex-1">
            <wd-slider v-model="brushSize" hide-min-max hide-label />
          </div>
        </div>
        <div class="w-full">
          <div class="grid grid-cols-2 gap-[24rpx] px-[24rpx]">
            <wd-button @click="exportOriginalImage">下载</wd-button>
            <wd-button @click="exportMaskImage">解析</wd-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

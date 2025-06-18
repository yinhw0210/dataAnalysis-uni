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
const removeStore = useRemoveStore();

const imageInfo = computed(() => {
  return removeStore.imageInfo;
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

// Canvas相关
const canvasId = 'mainCanvas';
const maskCanvasId = 'maskCanvas';
const canvasState = reactive({
  ctx: null as any,
  maskCtx: null as any,
  isDrawing: false,
  originalImageWidth: 0,
  originalImageHeight: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  scaleRatio: 1, // 用于记录图片缩放比例
  imageLocalPath: '', // 用于存储图片本地路径
  brushPoints: [] as Array<{x: number, y: number, size: number}>, // 存储所有涂抹点
  lastPoint: null as {x: number, y: number} | null, // 上一个涂抹点的位置
});

// 减少重绘次数的性能优化变量
const drawTimeout = ref<any>(null);
const drawBatchPoints = ref<Array<{x: number, y: number, size: number}>>([]);
const maskDrawTimeout = ref<any>(null);
const maskBatchPoints = ref<Array<{x: number, y: number, size: number}>>([]);

// 初始化Canvas
const initCanvas = () => {
  if (!imageInfo.value?.url) {
    console.error('图片URL为空');
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
  const isHttpUrl = imageInfo.value.url.startsWith('http://') || imageInfo.value.url.startsWith('https://');
  
  console.log('图片URL类型:', isHttpUrl ? '网络地址' : '本地路径');
  
  // 如果已经是本地文件路径，直接使用
  if (!isHttpUrl) {
    canvasState.imageLocalPath = imageInfo.value.url;
    console.log('使用本地图片路径:', canvasState.imageLocalPath);
    
    // 处理尺寸计算和Canvas初始化
    processImageAndInitCanvas(originalWidth, originalHeight, screenWidth);
  } else {
    // 网络图片需要下载
    console.log('下载网络图片:', imageInfo.value.url);
    uni.downloadFile({
      url: imageInfo.value.url,
      success: (downloadRes) => {
        if (downloadRes.statusCode === 200) {
          canvasState.imageLocalPath = downloadRes.tempFilePath;
          console.log('图片下载成功:', downloadRes.tempFilePath);
          
          // 处理尺寸计算和Canvas初始化
          processImageAndInitCanvas(originalWidth, originalHeight, screenWidth);
        } else {
          console.error('下载图片失败，状态码:', downloadRes.statusCode);
          isLoading.value = false;
        }
      },
      fail: (err) => {
        console.error('下载图片失败:', err);
        isLoading.value = false;
      }
    });
  }
};

// 处理图片尺寸并初始化Canvas
const processImageAndInitCanvas = (originalWidth: number, originalHeight: number, screenWidth: number) => {
  if (originalWidth > 0 && originalHeight > 0) {
    // 使用已知的尺寸
    setupCanvasWithDimensions(originalWidth, originalHeight, screenWidth);
  } else {
    // 需要获取图片尺寸
    uni.getImageInfo({
      src: canvasState.imageLocalPath,
      success: (res) => {
        console.log('获取图片信息成功:', res);
        setupCanvasWithDimensions(res.width, res.height, screenWidth);
      },
      fail: (err) => {
        console.error('获取图片信息失败:', err);
        isLoading.value = false;
      }
    });
  }
};

// 根据尺寸设置Canvas并初始化
const setupCanvasWithDimensions = (imgWidth: number, imgHeight: number, screenWidth: number) => {
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
  
  console.log('图片尺寸:', imgWidth, imgHeight);
  console.log('显示尺寸:', displayWidth, displayHeight);
  console.log('缩放比例:', canvasState.scaleRatio);
  
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
    console.error('无法创建主Canvas上下文');
    return;
  }
  
  console.log('开始绘制主Canvas');
  
  // 设置更高质量的线条渲染
  ctx.setLineCap('round');
  ctx.setLineJoin('round');
  
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
    console.error('无法创建蒙版Canvas上下文');
    return;
  }
  
  console.log('开始绘制蒙版Canvas, 尺寸:', canvasState.originalImageWidth, canvasState.originalImageHeight);
  
  // 设置更高质量的线条渲染
  maskCtx.setLineCap('round');
  maskCtx.setLineJoin('round');
  
  // 填充黑色背景
  maskCtx.setFillStyle('#000000');
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
  if (!canvasState.isDrawing || !canvasState.ctx || !canvasState.maskCtx) return;
  
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
  const brushWidth = brushSize.value * 5; // 画笔大小
  
  // 添加到批处理队列
  drawBatchPoints.value.push({ x, y, size: brushWidth });
  
  // 计算蒙版坐标
  const maskX = x * canvasState.scaleRatio;
  const maskY = y * canvasState.scaleRatio;
  const maskBrushWidth = brushWidth * canvasState.scaleRatio;
  
  // 添加到蒙版批处理队列
  maskBatchPoints.value.push({ x: maskX, y: maskY, size: maskBrushWidth });
  
  // 存储涂抹点用于导出
  canvasState.brushPoints.push({
    x: maskX,
    y: maskY,
    size: maskBrushWidth
  });
  
  // 设置批处理绘制定时器
  if (!drawTimeout.value) {
    drawTimeout.value = setTimeout(batchDraw, 10); // 10ms批处理一次
  }
  
  if (!maskDrawTimeout.value) {
    maskDrawTimeout.value = setTimeout(batchMaskDraw, 20); // 20ms批处理一次
  }
};

// 批处理绘制显示canvas
const batchDraw = () => {
  if (!canvasState.ctx || drawBatchPoints.value.length === 0) {
    drawTimeout.value = null;
    return;
  }
  
  const ctx = canvasState.ctx;
  ctx.setFillStyle('rgba(255, 0, 0, 0.5)');
  
  // 绘制所有点
  drawBatchPoints.value.forEach(point => {
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
  maskCtx.setFillStyle('#FFFFFF');
  
  // 绘制所有点
  maskBatchPoints.value.forEach(point => {
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
  
  if (distance < 2) {
    // 如果距离很小，只画当前点
    drawSingle(x, y);
    return;
  }
  
  // 计算步数，距离越大，点越密集
  const steps = Math.ceil(distance / 2);
  
  // 计算每一步的增量
  const xStep = (x - lastX) / steps;
  const yStep = (y - lastY) / steps;
  
  // 绘制从上一点到当前点之间的多个点，形成连续线条
  for (let i = 0; i < steps; i++) {
    const currentX = lastX + xStep * i;
    const currentY = lastY + yStep * i;
    drawSingle(currentX, currentY);
  }
  
  // 最后再画一个终点
  drawSingle(x, y);
};

// 计算两点间距离
const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// 重新绘制整个蒙版
const redrawMaskCanvas = () => {
  if (!canvasState.maskCtx) return;
  
  const maskCtx = canvasState.maskCtx;
  
  // 优化性能：如果没有涂抹点，直接返回
  if (canvasState.brushPoints.length === 0) {
    return Promise.resolve();
  }
  
  // 清空画布并填充黑色背景
  maskCtx.clearRect(0, 0, canvasState.originalImageWidth, canvasState.originalImageHeight);
  maskCtx.setFillStyle('#000000');
  maskCtx.fillRect(0, 0, canvasState.originalImageWidth, canvasState.originalImageHeight);
  
  // 设置白色填充
  maskCtx.setFillStyle('#FFFFFF');
  
  // 分批处理涂抹点，每批处理100个点
  const batchSize = 100;
  const totalPoints = canvasState.brushPoints.length;
  
  return new Promise<void>((resolve) => {
    const drawBatch = (startIndex: number) => {
      const endIndex = Math.min(startIndex + batchSize, totalPoints);
      
      // 处理当前批次
      for (let i = startIndex; i < endIndex; i++) {
        const point = canvasState.brushPoints[i];
        maskCtx.beginPath();
        maskCtx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        maskCtx.fill();
      }
      
      // 是否有更多批次
      if (endIndex < totalPoints) {
        // 绘制当前批次然后继续
        maskCtx.draw(true, () => {
          setTimeout(() => {
            drawBatch(endIndex);
          }, 0);
        });
      } else {
        // 最后一个批次，完成绘制
        maskCtx.draw(false, () => {
          console.log('蒙版重绘完成');
          resolve();
        });
      }
    };
    
    // 开始第一批
    drawBatch(0);
  });
};

// 导出原图
const exportOriginalImage = () => {
  if (canvasState.imageLocalPath) {
    console.log('原图路径:', canvasState.imageLocalPath);
    uni.showToast({
      title: '已打印原图路径',
      icon: 'none'
    });
  } else if (imageInfo.value?.url) {
    console.log('原图URL:', imageInfo.value.url);
    uni.showToast({
      title: '已打印原图URL',
      icon: 'none'
    });
  }
};

// 导出涂抹轨迹图片
const exportMaskImage = async () => {
  // 防止没有涂抹点的情况
  if (canvasState.brushPoints.length === 0) {
    console.log('没有涂抹轨迹');
    uni.showToast({
      title: '请先涂抹图片',
      icon: 'none'
    });
    return;
  }
  
  // 显示加载提示
  uni.showLoading({
    title: '导出中...'
  });
  
  try {
    // 先重新绘制整个蒙版
    await redrawMaskCanvas();
    
    // 导出蒙版图片
    uni.canvasToTempFilePath({
      canvasId: maskCanvasId,
      fileType: 'png',
      width: canvasState.originalImageWidth,
      height: canvasState.originalImageHeight,
      destWidth: canvasState.originalImageWidth,
      destHeight: canvasState.originalImageHeight,
      success: function(res) {
        console.log('涂抹轨迹图片导出成功:', res.tempFilePath);
        
        // 读取临时文件并转换为base64
        uni.getFileSystemManager().readFile({
          filePath: res.tempFilePath,
          encoding: 'base64',
          success: function(readRes) {
            console.log('涂抹轨迹图片base64生成成功');
            console.log('data:image/png;base64,' + readRes.data);
            
            uni.hideLoading();
            uni.showToast({
              title: '导出成功',
              icon: 'success'
            });
          },
          fail: function(err) {
            console.error('读取文件失败:', err);
            uni.hideLoading();
            uni.showToast({
              title: '读取文件失败',
              icon: 'none'
            });
          }
        });
      },
      fail: function(err) {
        console.error('导出蒙版图片失败:', err);
        uni.hideLoading();
        uni.showToast({
          title: '导出失败',
          icon: 'none'
        });
      }
    });
  } catch (error) {
    console.error('导出过程出错:', error);
    uni.hideLoading();
    uni.showToast({
      title: '导出过程出错',
      icon: 'none'
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
  console.log('组件已挂载，开始初始化...');
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
        <div class="size-full m-[24rpx] flex justify-center items-center relative">
          <!-- 加载提示 -->
          <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
            正在加载图片...
          </div>
          
          <!-- 提示信息 -->
          <div class="absolute top-0 left-0 p-2 text-xs opacity-60" v-if="!isLoading">
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
              visibility: isLoading ? 'hidden' : 'visible'
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
              height: canvasState.originalImageHeight + 'px'
            }"
          ></canvas>
        </div>
      </div>
      <div class="h-[200rpx] flex flex-col py-[24rpx] gap-[28rpx]">
        <div class="flex flex-col gap-[24rpx]">
          <div>画笔大小</div>
          <div>
            <wd-slider v-model="brushSize" :min="1" :max="10" :step="1" />
          </div>
        </div>
        <div class="w-full">
          <div class="grid grid-cols-2 gap-[24rpx] px-[24rpx]">
            <wd-button @click="exportOriginalImage">导出原图</wd-button>
            <wd-button @click="exportMaskImage">导出涂抹轨迹图片</wd-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

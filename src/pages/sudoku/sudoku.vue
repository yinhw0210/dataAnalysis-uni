<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { SudokuStateType, useSudokuStore } from "@/store/modules/sudoku";
import { SUDOKU_INFO } from "@/constant/sudoku";
import { SudokuNumEnum } from "@/enum";
import Boundary from "@/components/Tool/Boundary/index.vue";

const sudokuStore = useSudokuStore();

// 选中的图片列表
const sudokuInfo = ref<SudokuStateType["sudokuInfo"]>();

// 选中类型key
const sudokuTypeKey = ref<SudokuNumEnum>(SudokuNumEnum.SIX);

// 选中的信息
const sudokuKeyInfo = computed(() => {
  return SUDOKU_INFO.find((item) => item.key === sudokuTypeKey.value);
});

const mode = computed(() => {
  // 根据图片大小判断
  if (sudokuInfo.value?.width > sudokuInfo.value?.height) {
    return "widthFix";
  } else {
    return "heightFix";
  }
});

const onHandleSudokuType = (key: SudokuNumEnum) => {
  sudokuTypeKey.value = key;
};

const handleSavePuzzle = () => {
  if (!sudokuInfo.value) {
    uni.showToast({
      title: '没有图片信息',
      icon: 'none'
    });
    return;
  }

  // 获取当前选择的布局信息
  const currentLayout = sudokuKeyInfo.value;
  if (!currentLayout) {
    uni.showToast({
      title: '布局信息获取失败',
      icon: 'none'
    });
    return;
  }

  // 直接开始处理图片分割，不再检查canvas
  handleImageCutting(currentLayout);
};

// 处理图片分割
const handleImageCutting = (layout) => {
  // 显示加载
  uni.showLoading({
    title: '图片分割中...',
    mask: true
  });
  
  // 获取图片信息
  uni.getImageInfo({
    src: sudokuInfo.value.url,
    success: (imgInfo) => {
      const { width: imgWidth, height: imgHeight } = imgInfo;
      
      // 根据布局类型的不同，计算每个分片的大小和位置
      let rows = 1;
      let cols = 1;
      
      if (layout.key === SudokuNumEnum.ONE) {
        // 一行两列
        cols = 2;
      } else if (layout.key === SudokuNumEnum.TWO) {
        // 两行一列
        rows = 2;
      } else if (layout.key === SudokuNumEnum.THREE) {
        // 三行一列
        rows = 3;
      } else if (layout.key === SudokuNumEnum.FOUR) {
        // 两行两列
        rows = 2;
        cols = 2;
      } else if (layout.key === SudokuNumEnum.FIVE) {
        // 三行两列
        rows = 3;
        cols = 2;
      } else if (layout.key === SudokuNumEnum.SIX) {
        // 三行三列
        rows = 3;
        cols = 3;
      }
      
      // 使用传统Canvas方式切割图片
      cutImagesWithCanvas(imgWidth, imgHeight, rows, cols);
    },
    fail: (err) => {
      console.error('获取图片信息失败:', err);
      uni.hideLoading();
      uni.showToast({
        title: '获取图片信息失败',
        icon: 'none'
      });
    }
  });
};

// 使用传统Canvas方式切割图片
const cutImagesWithCanvas = (imgWidth, imgHeight, rows, cols) => {
  const totalBlocks = rows * cols;
  console.log(`准备切割图片: ${rows}行 × ${cols}列, 共${totalBlocks}个分块, 图片尺寸: ${imgWidth}x${imgHeight}`);
  
  // 每个分块的尺寸
  const blockWidth = Math.floor(imgWidth / cols);
  const blockHeight = Math.floor(imgHeight / rows);
  
  // 存储分割后的图片路径
  const tempFilePaths = [];
  let processedCount = 0;
  
  // 一次处理一个分块
  function processBlock(index) {
    if (index >= totalBlocks) {
      // 所有分块都处理完成
      const validPaths = tempFilePaths.filter(p => p);
      console.log(`分割完成，有效图片：${validPaths.length}/${totalBlocks}`);
      
      if (validPaths.length > 0) {
        // 保存图片到相册
        saveImagesToAlbum(validPaths);
      } else {
        uni.hideLoading();
        uni.showToast({
          title: '图片分割失败',
          icon: 'none'
        });
      }
      return;
    }
    
    // 计算当前分块的行列
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // 显示进度
    uni.showLoading({
      title: `分割中 ${index+1}/${totalBlocks}`,
      mask: true
    });
    
    console.log(`处理第${index+1}个分块，位置:(${row},${col})`);
    
    // 创建画布上下文
    const canvasId = 'sudokuCanvas';
    const ctx = uni.createCanvasContext(canvasId);
    
    // 清空画布
    ctx.clearRect(0, 0, blockWidth, blockHeight);
    
    // 计算源图片上对应的区域
    const sourceX = col * blockWidth;
    const sourceY = row * blockHeight;
    
    // 绘制源图片指定区域到画布
    ctx.drawImage(
      sudokuInfo.value.url,
      sourceX, sourceY, blockWidth, blockHeight, // 源图片裁剪区域
      0, 0, blockWidth, blockHeight              // 目标区域
    );
    
    // 执行绘制
    ctx.draw(false, () => {
      // 等待绘制完成，确保有足够时间
      setTimeout(() => {
        // 将画布内容导出为临时文件
        uni.canvasToTempFilePath({
          canvasId: canvasId,
          x: 0,
          y: 0,
          width: blockWidth,
          height: blockHeight,
          destWidth: blockWidth,
          destHeight: blockHeight,
          success: (res) => {
            console.log(`分块${index+1}导出成功: ${res.tempFilePath}`);
            tempFilePaths[index] = res.tempFilePath;
            processedCount++;
            
            // 继续处理下一个分块
            processBlock(index + 1);
          },
          fail: (err) => {
            console.error(`分块${index+1}导出失败:`, err);
            processedCount++;
            
            // 继续处理下一个分块
            processBlock(index + 1);
          }
        });
      }, 300); // 给绘制多一点时间
    });
  }
  
  // 开始处理第一个分块
  processBlock(0);
  
  // 设置超时保护
  setTimeout(() => {
    if (processedCount < totalBlocks) {
      console.log(`处理超时，已处理: ${processedCount}/${totalBlocks}`);
      const validPaths = tempFilePaths.filter(p => p);
      if (validPaths.length > 0) {
        saveImagesToAlbum(validPaths);
      }
    }
  }, 60000); // 60秒超时
};

// 保存图片到相册
const saveImagesToAlbum = (tempFilePaths) => {
  console.log(`准备保存 ${tempFilePaths.length} 张图片到相册`);
  let savedCount = 0;
  let failCount = 0;
  
  // 串行保存图片，避免并发请求过多
  const saveNext = (index) => {
    if (index >= tempFilePaths.length) {
      // 全部保存完成
      uni.hideLoading();
      uni.showToast({
        title: `成功保存${savedCount}张图片`,
        icon: 'success'
      });
      return;
    }
    
    const path = tempFilePaths[index];
    uni.saveImageToPhotosAlbum({
      filePath: path,
      success: () => {
        console.log(`图片 ${index} 保存成功`);
        savedCount++;
        // 更新进度提示
        uni.showLoading({
          title: `保存中 ${index+1}/${tempFilePaths.length}`,
          mask: true
        });
        // 保存下一张
        saveNext(index + 1);
      },
      fail: (err) => {
        console.error(`图片 ${index} 保存失败:`, err);
        failCount++;
        // 继续保存下一张
        saveNext(index + 1);
      }
    });
  };
  
  // 开始保存第一张
  saveNext(0);
  
  // 设置保存超时保护
  setTimeout(() => {
    if (savedCount + failCount < tempFilePaths.length) {
      console.log(`保存超时，已保存: ${savedCount}，失败: ${failCount}`);
      uni.hideLoading();
      if (savedCount > 0) {
        uni.showToast({
          title: `已保存${savedCount}张图片`,
          icon: 'success'
        });
      } else {
        uni.showToast({
          title: '保存超时，请重试',
          icon: 'none'
        });
      }
    }
  }, 30000); // 30秒超时
};

onMounted(() => {
  sudokuInfo.value = sudokuStore.getSudokuInfo;
  console.log(sudokuInfo.value);
});
</script>
<template>
  <div
    class="size-full h-[100vh] overflow-hidden bg-[#e4f0f9] relative flex flex-col"
  >
    <div class="h-[70vh] w-full flex justify-center items-center">
      <div
        class="w-[90vw] h-[90vw] bg-white flex justify-center items-center relative nodes"
      >
        <image :src="sudokuInfo?.url" class="size-full" :mode="mode" />
        <Boundary :publicKey="sudokuTypeKey" />
      </div>
    </div>
    <div class="h-[30vh] w-full rounded-t-[24rpx] bg-[#fff]">
      <div class="h-[calc(100%-100rpx)] w-full flex justify-center items-center flex-col p-[16rpx]">
        <div class="overflow-x-auto flex gap-[16rpx]">
          <div
            class="w-[100rpx] h-[100rpx] p-[10rpx] gap-[10rpx] grid border border-[#c8c8c8] rounded-[6rpx]"
            :class="{
              '!border-[#396be5]': sudokuTypeKey === item.key,
            }"
            v-for="item in SUDOKU_INFO"
            :key="item.key"
            :style="item.style"
            @click="onHandleSudokuType(item.key)"
          >
            <div
              v-for="i in item.num"
              :key="i"
              class="bg-[#c8c8c8]"
              :class="{
                '!bg-[#396be5]': sudokuTypeKey === item.key,
              }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="w-full h-[100rpx] border-t border-[#f2f2f2] flex items-center justify-around px-[32rpx]"
      >
        <div
          class="w-[200rpx] h-[60rpx] rounded-2xl text-[#396be5] bg-[#d7e1fa] flex items-center justify-center"
        >
          更换图片
        </div>
        <div
          class="w-[200rpx] h-[60rpx] rounded-2xl text-[#fff] bg-[#396be5] flex items-center justify-center"
          @click="handleSavePuzzle"
        >
          保存拼图
        </div>
      </div>
    </div>
    
    <!-- 传统Canvas，用于图片分割 -->
    <canvas
      id="sudokuCanvas"
      canvas-id="sudokuCanvas"
      style="position: absolute; left: -9999px; width: 1024px; height: 1024px;"
    ></canvas>
  </div>
</template>

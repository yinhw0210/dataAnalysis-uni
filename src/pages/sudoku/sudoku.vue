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

// 原图裁切模式（默认开启）
const originalCutMode = ref<boolean>(true);

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

// 切换原图裁切模式
const toggleCutMode = () => {
  originalCutMode.value = !originalCutMode.value;
};

// 更换图片
const handleReplaceImage = () => {
  uni.chooseMedia({
    count: 1,
    mediaType: ["image"],
    sourceType: ["album"],
    success: (res) => {
      if (res.tempFiles && res.tempFiles.length > 0) {
        uni.getImageInfo({
          src: res.tempFiles[0].tempFilePath,
          success: (imageInfo) => {
            // 更新图片信息
            const newImageInfo = {
              id: sudokuInfo.value?.id || Date.now().toString(),
              url: res.tempFiles[0].tempFilePath,
              width: imageInfo.width,
              height: imageInfo.height,
              offsetX: 0,
              offsetY: 0,
              rotate: 0,
              scaleX: 1,
              scaleY: 1,
              opacity: 1,
              scale: 1,
              advancedConfig: {
                frame: 0,
                innerFrame: 0,
                borderRadius: 0,
              },
            };

            // 更新到store
            sudokuStore.setSudokuInfo(newImageInfo);
            sudokuInfo.value = newImageInfo;

            uni.showToast({
              title: "图片更换成功",
              icon: "success",
            });
          },
          fail: (err) => {
            console.error("获取图片信息失败:", err);
            uni.showToast({
              title: "获取图片信息失败",
              icon: "none",
            });
          },
        });
      }
    },
    fail: (err) => {
      console.error("选择图片失败:", err);
    },
  });
};

const handleSavePuzzle = () => {
  if (!sudokuInfo.value) {
    uni.showToast({
      title: "没有图片信息",
      icon: "none",
    });
    return;
  }

  // 获取当前选择的布局信息
  const currentLayout = sudokuKeyInfo.value;
  if (!currentLayout) {
    uni.showToast({
      title: "布局信息获取失败",
      icon: "none",
    });
    return;
  }

  // 直接开始处理图片分割，不再检查canvas
  if (originalCutMode.value) {
    // 原图裁切模式
    handleImageCutting(currentLayout);
  } else {
    // 显示区域裁切模式
    handleViewCutting(currentLayout);
  }
};

// 处理原图裁切模式的图片分割
const handleImageCutting = (layout) => {
  // 显示加载
  uni.showLoading({
    title: "图片分割中...",
    mask: true,
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
      console.error("获取图片信息失败:", err);
      uni.hideLoading();
      uni.showToast({
        title: "获取图片信息失败",
        icon: "none",
      });
    },
  });
};

// 处理显示区域裁切模式的图片分割
const handleViewCutting = (layout) => {
  // 显示加载
  uni.showLoading({
    title: "图片分割中...",
    mask: true,
  });

  // 确保有图片信息
  if (!sudokuInfo.value || !sudokuInfo.value.url) {
    uni.hideLoading();
    uni.showToast({
      title: "图片信息不存在",
      icon: "none",
    });
    return;
  }

  // 先获取容器信息
  const query = uni.createSelectorQuery();

  // 查询容器节点
  query.select(".nodes").boundingClientRect();

  // 查询图片节点
  query.select(".nodes image").boundingClientRect();

  // 执行所有查询并处理结果
  query.exec((res) => {
    console.log("查询结果:", res);

    // 检查是否有查询结果
    if (!res || !res.length || res.length < 2) {
      console.error("节点查询失败:", res);
      uni.hideLoading();
      uni.showToast({
        title: "节点查询失败",
        icon: "none",
      });
      return;
    }

    const containerRect = res[0];
    const imageRect = res[1];

    // 检查容器信息
    if (!containerRect) {
      console.error("容器节点未找到");
      uni.hideLoading();
      uni.showToast({
        title: "容器信息获取失败",
        icon: "none",
      });
      return;
    }

    // 检查图片信息
    if (!imageRect) {
      console.error("图片节点未找到");

      // 使用备选方案：基于容器尺寸和图片比例估算图片位置
      console.log("使用备选方案处理图片...");

      // 获取图片信息
      uni.getImageInfo({
        src: sudokuInfo.value.url,
        success: (imgInfo) => {
          const { width: originalWidth, height: originalHeight } = imgInfo;

          // 计算图片在容器中的显示尺寸和位置
          let displayWidth, displayHeight, imageLeft, imageTop;

          if (mode.value === "widthFix") {
            // 宽度适应，高度自适应
            displayWidth = containerRect.width;
            displayHeight = (originalHeight / originalWidth) * displayWidth;
            imageLeft = 0;
            imageTop = (containerRect.height - displayHeight) / 2;
          } else {
            // 高度适应，宽度自适应
            displayHeight = containerRect.height;
            displayWidth = (originalWidth / originalHeight) * displayHeight;
            imageLeft = (containerRect.width - displayWidth) / 2;
            imageTop = 0;
          }

          console.log("估算图片位置尺寸:", {
            width: displayWidth,
            height: displayHeight,
            left: imageLeft,
            top: imageTop,
          });

          // 获取布局信息
          let rows = 1;
          let cols = 1;

          if (layout.key === SudokuNumEnum.ONE) {
            cols = 2;
          } else if (layout.key === SudokuNumEnum.TWO) {
            rows = 2;
          } else if (layout.key === SudokuNumEnum.THREE) {
            rows = 3;
          } else if (layout.key === SudokuNumEnum.FOUR) {
            rows = 2;
            cols = 2;
          } else if (layout.key === SudokuNumEnum.FIVE) {
            rows = 3;
            cols = 2;
          } else if (layout.key === SudokuNumEnum.SIX) {
            rows = 3;
            cols = 3;
          }

          // 使用显示区域尺寸切割图片，传入估算的图片信息
          cutViewWithCanvas(
            containerRect.width,
            containerRect.height,
            rows,
            cols,
            {
              url: sudokuInfo.value.url,
              left: imageLeft,
              top: imageTop,
              width: displayWidth,
              height: displayHeight,
              mode: mode.value,
              originalWidth,
              originalHeight,
            }
          );
        },
        fail: (err) => {
          console.error("获取图片信息失败:", err);
          uni.hideLoading();
          uni.showToast({
            title: "获取图片信息失败",
            icon: "none",
          });
        },
      });

      return;
    }

    // 计算图片在容器中的相对位置
    const imageLeft = imageRect.left - containerRect.left;
    const imageTop = imageRect.top - containerRect.top;
    const imageWidth = imageRect.width;
    const imageHeight = imageRect.height;

    console.log("容器尺寸:", containerRect.width, containerRect.height);
    console.log("图片尺寸:", imageWidth, imageHeight);
    console.log("图片位置:", imageLeft, imageTop);

    // 获取布局信息
    let rows = 1;
    let cols = 1;

    if (layout.key === SudokuNumEnum.ONE) {
      cols = 2;
    } else if (layout.key === SudokuNumEnum.TWO) {
      rows = 2;
    } else if (layout.key === SudokuNumEnum.THREE) {
      rows = 3;
    } else if (layout.key === SudokuNumEnum.FOUR) {
      rows = 2;
      cols = 2;
    } else if (layout.key === SudokuNumEnum.FIVE) {
      rows = 3;
      cols = 2;
    } else if (layout.key === SudokuNumEnum.SIX) {
      rows = 3;
      cols = 3;
    }

    // 确保图片信息正确再进行处理
    uni.getImageInfo({
      src: sudokuInfo.value.url,
      success: (imgInfo) => {
        // 使用显示区域尺寸切割图片，传入容器和图片信息
        cutViewWithCanvas(
          containerRect.width,
          containerRect.height,
          rows,
          cols,
          {
            url: sudokuInfo.value.url,
            left: imageLeft,
            top: imageTop,
            width: imageWidth,
            height: imageHeight,
            mode: mode.value,
            originalWidth: imgInfo.width,
            originalHeight: imgInfo.height,
          }
        );
      },
      fail: (err) => {
        console.error("获取原图信息失败:", err);
        // 即使获取原图信息失败，也继续使用当前可见尺寸
        cutViewWithCanvas(
          containerRect.width,
          containerRect.height,
          rows,
          cols,
          {
            url: sudokuInfo.value.url,
            left: imageLeft,
            top: imageTop,
            width: imageWidth,
            height: imageHeight,
            mode: mode.value,
          }
        );
      },
    });
  });
};

// 使用显示区域尺寸切割图片
const cutViewWithCanvas = (viewWidth, viewHeight, rows, cols, imageInfo) => {
  const totalBlocks = rows * cols;
  console.log(
    `准备切割显示区域: ${rows}行 × ${cols}列, 共${totalBlocks}个分块, 显示区域尺寸: ${viewWidth}x${viewHeight}`
  );
  console.log("图片信息:", imageInfo);

  // 每个分块的视图尺寸
  const blockWidth = Math.floor(viewWidth / cols);
  const blockHeight = Math.floor(viewHeight / rows);

  // 使用固定高分辨率（4K）
  const outputWidth = 4096;
  const outputHeight = 4096;

  // 计算高分辨率输出的每个分块尺寸
  const highResBlockWidth = Math.floor(outputWidth / cols);
  const highResBlockHeight = Math.floor(outputHeight / rows);

  // 存储分割后的图片路径
  const tempFilePaths = [];
  let processedCount = 0;

  // 预加载图片，确保图片资源可用
  uni.getImageInfo({
    src: imageInfo.url,
    success: (imgInfo) => {
      console.log("预加载图片成功:", imgInfo);

      // 开始处理分块
      processBlocks(imgInfo.path);
    },
    fail: (err) => {
      console.error("预加载图片失败:", err);
      uni.hideLoading();
      uni.showToast({
        title: "图片加载失败",
        icon: "none",
      });
    },
  });

  // 处理所有分块
  function processBlocks(imgPath) {
    // 按顺序处理每个分块
    processBlockAtIndex(0);

    // 处理指定索引的分块
    function processBlockAtIndex(index) {
      if (index >= totalBlocks) {
        // 所有分块处理完成
        const validPaths = tempFilePaths.filter((p) => p);
        console.log(`分割完成，有效图片：${validPaths.length}/${totalBlocks}`);

        if (validPaths.length > 0) {
          // 保存图片到相册
          saveImagesToAlbum(validPaths);
        } else {
          uni.hideLoading();
          uni.showToast({
            title: "图片分割失败",
            icon: "none",
          });
        }
        return;
      }

      // 计算当前分块的行列
      const row = Math.floor(index / cols);
      const col = index % cols;

      // 显示进度
      uni.showLoading({
        title: `分割中 ${index + 1}/${totalBlocks}`,
        mask: true,
      });

      console.log(`处理第${index + 1}个分块，位置:(${row},${col})`);

      // 计算当前分块在视图中的位置
      const blockLeft = col * blockWidth;
      const blockTop = row * blockHeight;

      try {
        // 创建新的画布上下文
        const canvasId = "viewCanvas";
        const ctx = uni.createCanvasContext(canvasId);

        // 先绘制白色背景（与页面背景相同）
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, highResBlockWidth, highResBlockHeight);

        // 计算高分辨率的缩放比例
        const scaleX = highResBlockWidth / blockWidth;
        const scaleY = highResBlockHeight / blockHeight;

        // 计算图片相对于当前分块的位置
        // 需要将图片位置减去分块位置，得到相对偏移
        const relativeImageLeft = imageInfo.left - blockLeft;
        const relativeImageTop = imageInfo.top - blockTop;

        // 计算高分辨率下的图片位置和尺寸
        const highResImageLeft = Math.round(relativeImageLeft * scaleX);
        const highResImageTop = Math.round(relativeImageTop * scaleY);
        const highResImageWidth = Math.round(imageInfo.width * scaleX);
        const highResImageHeight = Math.round(imageInfo.height * scaleY);

        console.log(
          `分块${
            index + 1
          }相对位置: 图片相对位置(${relativeImageLeft},${relativeImageTop}), 高分辨率位置(${highResImageLeft},${highResImageTop})`
        );

        // 绘制图片到相对位置
        ctx.drawImage(
          imgPath,
          0,
          0,
          imageInfo.originalWidth,
          imageInfo.originalHeight, // 原图完整区域
          highResImageLeft,
          highResImageTop,
          highResImageWidth,
          highResImageHeight // 高分辨率相对位置
        );

        // 执行绘制
        ctx.draw(false, () => {
          // 等待绘制完成
          setTimeout(() => {
            try {
              // 将绘制的内容导出为临时文件
              uni.canvasToTempFilePath({
                canvasId: canvasId,
                x: 0,
                y: 0,
                width: highResBlockWidth,
                height: highResBlockHeight,
                destWidth: highResBlockWidth,
                destHeight: highResBlockHeight,
                quality: 1,
                success: (res) => {
                  console.log(`分块${index + 1}导出成功: ${res.tempFilePath}`);
                  tempFilePaths[index] = res.tempFilePath;
                  processedCount++;

                  // 继续处理下一个分块
                  processBlockAtIndex(index + 1);
                },
                fail: (err) => {
                  console.error(`分块${index + 1}导出失败:`, err);
                  processedCount++;
                  processBlockAtIndex(index + 1);
                },
              });
            } catch (err) {
              console.error(`导出分块${index + 1}时出错:`, err);
              processedCount++;
              processBlockAtIndex(index + 1);
            }
          }, 1000); // 等待1秒确保绘制完成
        });
      } catch (err) {
        console.error(`处理分块${index + 1}时出错:`, err);
        processedCount++;
        processBlockAtIndex(index + 1);
      }
    }
  }

  // 设置超时保护
  setTimeout(() => {
    if (processedCount < totalBlocks) {
      console.log(`处理超时，已处理: ${processedCount}/${totalBlocks}`);
      const validPaths = tempFilePaths.filter((p) => p);
      if (validPaths.length > 0) {
        saveImagesToAlbum(validPaths);
      } else {
        uni.hideLoading();
        uni.showToast({
          title: "处理超时，请重试",
          icon: "none",
        });
      }
    }
  }, 60000); // 60秒超时
};

// 使用传统Canvas方式切割图片
const cutImagesWithCanvas = (imgWidth, imgHeight, rows, cols) => {
  const totalBlocks = rows * cols;
  console.log(
    `准备切割图片: ${rows}行 × ${cols}列, 共${totalBlocks}个分块, 图片尺寸: ${imgWidth}x${imgHeight}`
  );

  // 每个分块的尺寸
  const blockWidth = Math.floor(imgWidth / cols);
  const blockHeight = Math.floor(imgHeight / rows);

  // 高分辨率输出 - 保持原图比例的4K输出
  // 如果图片本身已经是高分辨率，则保持不变
  const maxOutputSize = 4096;
  const outputScale = Math.min(
    maxOutputSize / Math.max(blockWidth, blockHeight),
    4
  ); // 最大放大4倍
  const highResBlockWidth = Math.floor(blockWidth * outputScale);
  const highResBlockHeight = Math.floor(blockHeight * outputScale);

  console.log(
    `原图分块尺寸: ${blockWidth}x${blockHeight}, 输出分块尺寸: ${highResBlockWidth}x${highResBlockHeight}, 缩放比例: ${outputScale}`
  );

  // 存储分割后的图片路径
  const tempFilePaths = [];
  let processedCount = 0;

  // 预加载图片，确保图片资源可用
  uni.getImageInfo({
    src: sudokuInfo.value.url,
    success: (imgInfo) => {
      console.log("原图模式图片预加载成功:", imgInfo);
      // 开始处理分块
      processBlock(0, imgInfo.path);
    },
    fail: (err) => {
      console.error("原图模式图片预加载失败:", err);
      uni.hideLoading();
      uni.showToast({
        title: "图片加载失败",
        icon: "none",
      });
    },
  });

  // 一次处理一个分块
  function processBlock(index, imgPath) {
    if (index >= totalBlocks) {
      // 所有分块都处理完成
      const validPaths = tempFilePaths.filter((p) => p);
      console.log(`分割完成，有效图片：${validPaths.length}/${totalBlocks}`);

      if (validPaths.length > 0) {
        // 保存图片到相册
        saveImagesToAlbum(validPaths);
      } else {
        uni.hideLoading();
        uni.showToast({
          title: "图片分割失败",
          icon: "none",
        });
      }
      return;
    }

    // 计算当前分块的行列
    const row = Math.floor(index / cols);
    const col = index % cols;

    // 显示进度
    uni.showLoading({
      title: `分割中 ${index + 1}/${totalBlocks}`,
      mask: true,
    });

    console.log(`处理第${index + 1}个分块，位置:(${row},${col})`);

    // 创建画布上下文
    const canvasId = "sudokuCanvas";
    const ctx = uni.createCanvasContext(canvasId);

    // 先设置白色背景
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, highResBlockWidth, highResBlockHeight);

    // 计算源图片上对应的区域
    const sourceX = col * blockWidth;
    const sourceY = row * blockHeight;

    try {
      console.log(
        `绘制区域: 源区域(${sourceX},${sourceY},${blockWidth},${blockHeight}) -> 目标区域(0,0,${highResBlockWidth},${highResBlockHeight})`
      );

      // 绘制源图片指定区域到画布，放大到高分辨率
      ctx.drawImage(
        imgPath, // 使用预加载的图片路径
        sourceX,
        sourceY,
        blockWidth,
        blockHeight, // 源图片裁剪区域
        0,
        0,
        highResBlockWidth,
        highResBlockHeight // 目标区域（高分辨率）
      );

      // 执行绘制
      ctx.draw(false, () => {
        // 等待绘制完成，确保有足够时间
        setTimeout(() => {
          try {
            // 将画布内容导出为临时文件
            uni.canvasToTempFilePath({
              canvasId: canvasId,
              x: 0,
              y: 0,
              width: highResBlockWidth,
              height: highResBlockHeight,
              destWidth: highResBlockWidth,
              destHeight: highResBlockHeight,
              quality: 1,
              success: (res) => {
                console.log(`分块${index + 1}导出成功: ${res.tempFilePath}`);
                tempFilePaths[index] = res.tempFilePath;
                processedCount++;

                // 继续处理下一个分块
                processBlock(index + 1, imgPath);
              },
              fail: (err) => {
                console.error(`分块${index + 1}导出失败:`, err);
                processedCount++;

                // 继续处理下一个分块
                processBlock(index + 1, imgPath);
              },
            });
          } catch (err) {
            console.error(`导出原图分块${index + 1}时出错:`, err);
            processedCount++;
            processBlock(index + 1, imgPath);
          }
        }, 1000); // 增加等待时间到1秒，确保绘制完成
      });
    } catch (err) {
      console.error(`绘制原图分块${index + 1}时出错:`, err);
      processedCount++;
      processBlock(index + 1, imgPath);
    }
  }

  // 设置超时保护
  setTimeout(() => {
    if (processedCount < totalBlocks) {
      console.log(`处理超时，已处理: ${processedCount}/${totalBlocks}`);
      const validPaths = tempFilePaths.filter((p) => p);
      if (validPaths.length > 0) {
        saveImagesToAlbum(validPaths);
      } else {
        uni.hideLoading();
        uni.showToast({
          title: "处理超时，请重试",
          icon: "none",
        });
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
        icon: "success",
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
          title: `保存中 ${index + 1}/${tempFilePaths.length}`,
          mask: true,
        });
        // 保存下一张
        saveNext(index + 1);
      },
      fail: (err) => {
        console.error(`图片 ${index} 保存失败:`, err);
        failCount++;
        // 继续保存下一张
        saveNext(index + 1);
      },
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
          icon: "success",
        });
      } else {
        uni.showToast({
          title: "保存超时，请重试",
          icon: "none",
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
      <div
        class="h-[calc(100%-100rpx)] w-full flex justify-center flex-col p-[16rpx]"
      >
        <!-- 原图裁切开关 -->
        <div class="flex items-center mb-[4rpx] w-full">
          <div class="">原图裁切：</div>
          <wd-switch v-model="originalCutMode" size="small" />
        </div>
        <div class="text-[#999] text-[24rpx] mb-[16rpx]">
          原图裁切是根据图片的实际尺寸进行裁切。
        </div>
        <!-- 拼图布局选择 -->
        <div class="overflow-x-auto flex gap-[16rpx] mb-[16rpx]">
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
          @click="handleReplaceImage"
        >
          更换图片
        </div>
        <div
          class="w-[200rpx] h-[60rpx] rounded-2xl text-[#fff] bg-[#396be5] flex items-center justify-center"
          @click="handleSavePuzzle"
        >
          保存切图
        </div>
      </div>
    </div>

    <!-- 传统Canvas，用于图片分割 -->
    <canvas
      id="sudokuCanvas"
      canvas-id="sudokuCanvas"
      style="position: absolute; left: -9999px; width: 4096px; height: 4096px"
    ></canvas>

    <!-- 用于显示区域分割的Canvas -->
    <canvas
      id="viewCanvas"
      canvas-id="viewCanvas"
      style="position: absolute; left: -9999px; width: 4096px; height: 4096px"
    ></canvas>
  </div>
</template>

<route lang="json5" type="page">
{
  style: {
    navigationStyle: "custom",
  },
}
</route>
<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";

const statusBarHeight = computed(() => {
  return uni.getSystemInfoSync().statusBarHeight ?? 0;
});

const navBarHeight = computed(() => {
  const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
  return (
    menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight.value) * 2
  );
});

// 鸡蛋类型
const eggTypes = [
  { key: "medium", label: "中号蛋", size: "50-60g", emoji: "🥚" },
  { key: "large", label: "大号蛋", size: "60-70g", emoji: "🥚" },
  { key: "local", label: "土鸡蛋", size: "40-50g", emoji: "🐔" },
  { key: "duck", label: "鸭蛋", size: "70-80g", emoji: "🦆" },
];

// 熟度选项
const doneLevels = [
  { key: "runny", label: "流心溏心", desc: "蛋黄完全流动", emoji: "🟡" },
  { key: "soft", label: "半流心", desc: "外层微凝内层流心", emoji: "🟠" },
  { key: "medium", label: "软嫩全熟", desc: "蛋黄凝固不沙", emoji: "🟤" },
  { key: "hard", label: "紧实全熟", desc: "蛋黄沙糯有嚼劲", emoji: "⚫" },
];

// 煮蛋时间表（秒）
const cookingTimes: Record<string, Record<string, number>> = {
  medium: { runny: 360, soft: 450, medium: 570, hard: 720 },
  large: { runny: 420, soft: 510, medium: 630, hard: 810 },
  local: { runny: 300, soft: 390, medium: 510, hard: 540 },
  duck: { runny: 630, soft: 810, medium: 960, hard: 1020 },
};

const selectedEggType = ref("medium");
const selectedDoneLevel = ref("soft");
const isFromFridge = ref(false);
const isRunning = ref(false);
const isPaused = ref(false);
const remainingTime = ref(0);
let timerInterval: number | null = null;

const totalTime = computed(() => {
  let time = cookingTimes[selectedEggType.value][selectedDoneLevel.value];
  if (isFromFridge.value) time += 60;
  return time;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60);
  const seconds = remainingTime.value % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const progress = computed(() => {
  if (totalTime.value === 0) return 0;
  return ((totalTime.value - remainingTime.value) / totalTime.value) * 100;
});

const handleBack = () => {
  uni.navigateBack();
};

const startTimer = () => {
  if (isRunning.value && !isPaused.value) return;
  
  if (!isPaused.value) {
    remainingTime.value = totalTime.value;
  }
  
  isRunning.value = true;
  isPaused.value = false;
  
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      stopTimer();
      onTimerComplete();
    }
  }, 1000) as unknown as number;
};

const pauseTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isPaused.value = true;
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isRunning.value = false;
  isPaused.value = false;
  remainingTime.value = 0;
};

const onTimerComplete = () => {
  // 震动提醒
  uni.vibrateShort({});
  
  // 弹窗提醒
  uni.showModal({
    title: "🥚 鸡蛋煮好啦！",
    content: "快把鸡蛋捞出来放入冰水中冷却3-5分钟，这样更容易剥壳哦~",
    showCancel: false,
    confirmText: "知道了",
  });
};

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});
</script>
<template>
  <div class="egg-container" :style="{ paddingTop: `${statusBarHeight}px` }">
    <!-- 导航栏 -->
    <div
      class="flex items-center px-[24rpx]"
      :style="{ height: `${navBarHeight}px` }"
    >
      <div class="w-[60rpx] flex items-center" @click="handleBack">
        <wd-icon name="arrow-left" size="20px" color="#333"></wd-icon>
      </div>
      <div class="flex-1 text-center text-[34rpx] font-bold text-[#333]">煮蛋计时器</div>
      <div class="w-[60rpx]"></div>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 px-[24rpx] overflow-y-auto pb-[40rpx]">
      <!-- 计时器显示 -->
      <div class="timer-card mt-[24rpx]">
        <div class="text-[120rpx] font-bold text-center" style="font-family: monospace; color: #333">
          {{ formattedTime }}
        </div>
        <div class="progress-bar mt-[24rpx]">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="text-center text-[26rpx] text-[#999] mt-[16rpx]">
          {{ isRunning ? (isPaused ? '已暂停' : '煮蛋中...') : `预计 ${Math.floor(totalTime / 60)} 分钟` }}
        </div>
      </div>

      <!-- 选择鸡蛋类型 -->
      <div class="section-title">🥚 选择鸡蛋类型</div>
      <div class="grid grid-cols-4 gap-[16rpx]">
        <div
          v-for="egg in eggTypes"
          :key="egg.key"
          class="option-card"
          :class="{ active: selectedEggType === egg.key, disabled: isRunning }"
          @click="!isRunning && (selectedEggType = egg.key)"
        >
          <span class="text-[40rpx]">{{ egg.emoji }}</span>
          <div class="text-[24rpx] font-medium mt-[8rpx]">{{ egg.label }}</div>
          <div class="text-[20rpx] text-[#999]">{{ egg.size }}</div>
        </div>
      </div>

      <!-- 选择熟度 -->
      <div class="section-title">🍳 选择熟度</div>
      <div class="grid grid-cols-2 gap-[16rpx]">
        <div
          v-for="level in doneLevels"
          :key="level.key"
          class="done-card"
          :class="{ active: selectedDoneLevel === level.key, disabled: isRunning }"
          @click="!isRunning && (selectedDoneLevel = level.key)"
        >
          <span class="text-[32rpx] mr-[12rpx]">{{ level.emoji }}</span>
          <div class="flex-1">
            <div class="text-[28rpx] font-medium">{{ level.label }}</div>
            <div class="text-[22rpx] text-[#999]">{{ level.desc }}</div>
          </div>
        </div>
      </div>

      <!-- 冷藏蛋选项 -->
      <div class="fridge-option" :class="{ disabled: isRunning }">
        <div class="flex items-center">
          <span class="text-[32rpx] mr-[12rpx]">❄️</span>
          <div>
            <div class="text-[28rpx] font-medium">冷藏蛋</div>
            <div class="text-[22rpx] text-[#999]">从冰箱取出需多煮1分钟</div>
          </div>
        </div>
        <wd-switch v-model="isFromFridge" :disabled="isRunning" />
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-[24rpx] mt-[40rpx]">
        <div
          v-if="!isRunning"
          class="flex-1 h-[96rpx] rounded-[24rpx] flex items-center justify-center text-white text-[32rpx] font-bold active:scale-95 transition-all"
          style="background: linear-gradient(135deg, #ff9a56 0%, #ff6b35 100%)"
          @click="startTimer"
        >
          🔥 开始煮蛋
        </div>
        <template v-else>
          <div
            class="flex-1 h-[96rpx] rounded-[24rpx] flex items-center justify-center text-white text-[32rpx] font-bold active:scale-95 transition-all"
            :style="{ background: isPaused ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }"
            @click="isPaused ? startTimer() : pauseTimer()"
          >
            {{ isPaused ? '▶️ 继续' : '⏸️ 暂停' }}
          </div>
          <div
            class="w-[160rpx] h-[96rpx] rounded-[24rpx] flex items-center justify-center bg-[#f5f5f5] text-[#666] text-[32rpx] font-bold active:scale-95 transition-all"
            @click="stopTimer"
          >
            ⏹️ 停止
          </div>
        </template>
      </div>

      <!-- 小贴士 -->
      <div class="tips-card mt-[40rpx]">
        <div class="text-[28rpx] font-bold mb-[16rpx]">💡 煮蛋小贴士</div>
        <div class="tip-item">• 冷水下锅，水开后转中小火保持微沸</div>
        <div class="tip-item">• 煮前在蛋的钝端扎1个小孔防止裂壳</div>
        <div class="tip-item">• 煮好后立即放入冰水浸泡3-5分钟</div>
        <div class="tip-item">• 剥壳时从气室（钝端）开始剥更轻松</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.egg-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #fff8f0 0%, #fff 30%);
  display: flex;
  flex-direction: column;
}

.timer-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 107, 53, 0.1);
}

.progress-bar {
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff9a56 0%, #ff6b35 100%);
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin: 32rpx 0 16rpx;
}

.option-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx 12rpx;
  text-align: center;
  border: 2rpx solid #f0f0f0;
  transition: all 0.2s;

  &.active {
    border-color: #ff6b35;
    background: #fff8f5;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.done-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  border: 2rpx solid #f0f0f0;
  transition: all 0.2s;

  &.active {
    border-color: #ff6b35;
    background: #fff8f5;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.fridge-option {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-top: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 2rpx solid #f0f0f0;

  &.disabled {
    opacity: 0.5;
  }
}

.tips-card {
  background: #fffbf5;
  border-radius: 20rpx;
  padding: 24rpx;
  border: 2rpx solid #ffe4d4;
}

.tip-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.8;
}
</style>

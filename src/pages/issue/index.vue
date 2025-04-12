<script setup lang="ts">
import { ref } from "vue";

const value = ref<string[]>([]);

const copyGitHub = () => {
  uni.setClipboardData({
    data: "https://github.com/yinhw0210",
  });
};
</script>
<template>
  <div class="size-full py-[32rpx]">
    <wd-collapse v-model="value">
      <wd-collapse-item title="为什么链接解析不成功？" name="item1">
        <p>1、此视频已被隐藏或下架、无法解析</p>
        <p>2、链接必须是新的，不然解析会失败</p>
        <p>3、目前仅支持三个主流视频平台，其他平台正在开发中。</p>
        <p>
          4、由于快手的网站有重定向，如果解析失败，请重试几次，如果还是不行，请反馈给我们，谢谢！
        </p>
      </wd-collapse-item>
      <wd-collapse-item title="文件下载失败是为什么？" name="item2">
        <p>1、文件下载失败，请检查链接是否有效</p>
        <p>2、由于微信内置浏览器的限制，无法下载文件，请使用其他浏览器下载</p>
        <p>
          3、外置浏览器如果还是下载失败，请尝试使用浏览器内置的长按保存功能。
        </p>
      </wd-collapse-item>
      <wd-collapse-item title="是否开源" name="item3">
        <p class="flex">
          1、 是的，本项目已完全开源，遵循 MIT
          开源协议。您可以在GitHub查看源代码。
        </p>
        <p>
          2、前端采用 React + TypeScript + TailwindCSS 开发，后端采用 Python +
          FastAPI 开发。
        </p>
      </wd-collapse-item>
    </wd-collapse>
    <div class="flex justify-center mt-[32rpx]">
      <wd-button type="primary" @click="copyGitHub">复制GitHub地址</wd-button>
    </div>
  </div>
</template>

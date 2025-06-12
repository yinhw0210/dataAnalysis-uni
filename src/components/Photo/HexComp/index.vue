<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const color = computed(() => {
  // 去除#
  return props.modelValue.replace("#", "");
});

const handleChange = (valueInFo: { value: string }) => {
  // 拼接#
  emit("update:modelValue", `#${valueInFo.value}`);
};
</script>
<template>
  <div
    class="border border-solid border-[#006CF8] rounded-[16rpx] p-[16rpx] mt-[24rpx] mx-[24rpx]"
  >
    <wd-input :model-value="color" :maxlength="6" placeholder="请输入颜色" no-border @input="handleChange">
      <template #prefix>
        <div>#</div>
      </template>
    </wd-input>
  </div>
</template>

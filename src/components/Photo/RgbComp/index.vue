<script setup lang="ts">
import { rgbStringToArray } from "@/utils";
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const rgbArray = computed(() => {
  return rgbStringToArray(props.modelValue);
});

const Rvalue = computed(() => {
  return rgbArray.value[0];
});

const Gvalue = computed(() => {
  return rgbArray.value[1];
});

const Bvalue = computed(() => {
  return rgbArray.value[2];
});

const handleRChange = (valueInFo: { value: string }) => {
  emit("update:modelValue", `rgb(${valueInFo.value},${Gvalue.value},${Bvalue.value})`);
};

const handleGChange = (valueInFo: { value: string }) => {
  emit("update:modelValue", `rgb(${Rvalue.value},${valueInFo.value},${Bvalue.value})`);
};

const handleBChange = (valueInFo: { value: string }) => {
  emit("update:modelValue", `rgb(${Rvalue.value},${Gvalue.value},${valueInFo.value})`);
};

</script>
<template>
  <div class="mt-[24rpx] mx-[24rpx] grid grid-cols-3 gap-[24rpx]">
    <div class="border border-solid border-[#006CF8] rounded-[16rpx] p-[16rpx]">
      <wd-input
        :model-value="Rvalue"
        :maxlength="3"
        placeholder="请输入颜色"
        no-border
        @input="handleRChange"
        inputmode="numeric"
      >
        <template #prefix>
          <div>R</div>
        </template>
      </wd-input>
    </div>
    <div class="border border-solid border-[#006CF8] rounded-[16rpx] p-[16rpx]">
      <wd-input
        :model-value="Gvalue"
        :maxlength="3"
        placeholder="请输入颜色"
        no-border
        @input="handleGChange"
        inputmode="numeric"
      >
        <template #prefix>
          <div>G</div>
        </template>
      </wd-input>
    </div>
    <div class="border border-solid border-[#006CF8] rounded-[16rpx] p-[16rpx]">
      <wd-input
        :model-value="Bvalue"
        :maxlength="3"
        placeholder="请输入颜色"
        no-border
        @input="handleBChange"
        inputmode="numeric"
      >
        <template #prefix>
          <div>B</div>
        </template>
      </wd-input>
    </div>
  </div>
</template>

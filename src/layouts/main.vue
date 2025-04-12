<script setup lang="ts">
import Tabbar from "@/components/Tabbar/index.vue";
</script>
<template>
  <wd-config-provider>
    <div class="layout-container">
      <div class="layout-content">
        <slot></slot>
      </div>
      <Tabbar />
    </div>    
  </wd-config-provider>
</template>
<style lang="scss" scoped>
.layout-container {
  width: 100vw;
  height: 100vh;
  .layout-content {
    width: 100%;
    height: 100%;
  }
}
</style>

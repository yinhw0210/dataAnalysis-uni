# dataAnalysis-uni
抖音去水印，快手去水印，小红书去水印，快速、高质量地移除视频水印或图片水印

# 可拖拽网格组件 (DraggableGrid)

这是一个基于uniapp框架开发的微信小程序可拖拽网格组件，支持元素拖拽并在重叠度超过30%时交换位置。

## 特点

- 基于grid布局而非movable-area
- 支持自定义列数和间距
- 拖拽时自动计算元素重叠度
- 当重叠度超过30%时自动交换位置
- 完全自定义项目内容（通过插槽）

## 使用方法

### 导入组件

```vue
<script>
import DraggableGrid from '@/components/DraggableGrid.vue';

export default {
  components: {
    DraggableGrid
  }
}
</script>
```

### 基本用法

```vue
<template>
  <view class="container">
    <draggable-grid 
      :items="gridItems" 
      :columns="3" 
      :gap="10"
      @items-reordered="onItemsReordered"
    >
      <template v-slot="{ item }">
        <view class="grid-item-content">{{ item.text }}</view>
      </template>
    </draggable-grid>
  </view>
</template>

<script>
export default {
  data() {
    return {
      gridItems: [
        { id: 1, text: '项目1' },
        { id: 2, text: '项目2' },
        { id: 3, text: '项目3' },
        // ...更多项目
      ]
    };
  },
  methods: {
    onItemsReordered(newItems) {
      // 更新数据源
      this.gridItems = newItems;
      console.log('Items have been reordered:', newItems);
    }
  }
}
</script>
```

## 属性说明

| 属性名   | 类型   | 默认值 | 说明           |
|---------|--------|-------|---------------|
| items   | Array  | []    | 网格数据项      |
| columns | Number | 3     | 每行显示的列数   |
| gap     | Number | 10    | 网格元素间距(px) |

## 事件

| 事件名          | 参数           | 说明                 |
|----------------|---------------|---------------------|
| items-reordered | Array (新的数据项顺序) | 当项目位置发生变化时触发 |

## 实现原理

1. 通过 `uni.createSelectorQuery()` 获取每个元素的位置和尺寸信息
2. 在拖动过程中实时计算拖动元素与其他元素的重叠面积
3. 计算重叠面积占拖动元素总面积的百分比
4. 当重叠百分比超过30%且手指松开时，交换两个元素的位置

## 注意事项

1. 确保每个数据项都有唯一的id属性，用于Vue的key绑定
2. 组件内部会深拷贝传入的items数组，避免直接修改props
3. 使用items-reordered事件来获取重新排序后的数据

import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  // 你也可以定义 pages 字段，它具有最高的优先级。
  pages: [],
  globalStyle: {
    // 导航栏字体颜色
    navigationBarTextStyle: 'black',
    // 导航栏背景色
    navigationBarBackgroundColor: '#fff',
    // 导航栏背景底色
    backgroundColor: '#f5f5f5'
  },
  tabBar: {
    custom: true,
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
      },
      {
        pagePath: 'pages/tool/index',
        text: '工具',
      },
      {
        pagePath: 'pages/user/index',
        text: '我的',
      }
    ],
    color: '#999',
    selectedColor: '#000',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)': 'z-paging/components/z-paging$1/z-paging$1.vue'
    }
  }
})
# 快速开始

引导您如何在项目中使用`omap`

### Vue版本

当前支持的 Vue 版本`^3.0.0`

### 1. 安装

进入你的项目文件夹，使用 PNPM 安装`omap`

```shell
# npm
npm install -S ol-vue-tsx

# yarn
yarn  add -S ol-vue-tsx

# pnpm
pnpm add -S ol-vue-tsx
```

### 2. 引入插件和配置

在`src/main.ts`文件中写入以下内容

```ts
// 全局注册
import omap from 'ol-vue-tsx'

createApp(App).use(omap, { tk: '天地图tk' }).mount('#app')
```

```ts
// 全局注册部分组件
import { OPoint } from 'ol-vue-tsx'

createApp(App).use(OPoint).mount('#app')
```

### 使用

在`src/App.vue`文件的`<template>`中增加以下内容

```vue
<template>
  <!-- 使用 地图 组件 -->
  <o-map height="400px" :center="[120.261466, 30.337523]" :zoom="8" />
</template>
```

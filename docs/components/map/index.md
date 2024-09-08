# map 地图

地图初始化为地图默认天地图影像图层
目前坐标系只支持WGS84

## 基础用法

默认为天地图影像图层

<demo src="./src/base.vue" title="基础用法" ></demo>

## 使用其他图层并开启瓦片裁剪

使用杭州市地形json
<demo src="./src/LayeRvec.vue" title="天地图公交图" ></demo>

## 使用其他图层 需要安装 pnpm add jsrsasign 生成token

<demo src="./src/LayeZjvmap.vue" title="RSS 浙江省影像图" ></demo>

## api

| 参数       | 说明             | 类型     | 可选值                                             | 默认值    |
| ---------- | ---------------- | -------- | -------------------------------------------------- | --------- |
| size       | 尺寸             | string   | large / small / mini                               | default   |
| type       | 类型             | string   | primary / success / warning / info / danger / text | primary   |
| loading    | 加载中           | boolean  | —                                                  | false     |
| width      | 容器宽度         | string   | -                                                  | 100%      |
| height     | 容器高度         | string   | -                                                  | 100%      |
| minZoom    | 最小缩放         | Number   | —                                                  | 1         |
| maxZoom    | 最大缩放         | Number   | —                                                  | 18        |
| zoom       | 初始化缩放层级   | Number   | —                                                  | 10        |
| center     | 初始化中心经纬度 | number[] | —                                                  | 杭州坐标  |
| projection | 初始化中心经纬度 | string   | EPSG:4326                                          | EPSG:4326 |
| options    | 其他相关配置     | Object   | -                                                  | {}        |
| tk         | 天地图k          | string   | -                                                  |           |

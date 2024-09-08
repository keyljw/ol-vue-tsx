# 样式说明

地图样式style参数通过传入Objet对象 解析后转化成Style实例

### 样式api 请参考

https://openlayers.vip/apidoc/module-ol_style_Style-Style.html

### 传入给组件的style

```ts
// 传入给组件的style
// 也可使用 ref 和 reactive
let style = {
  name: 'Style',
  image: {
    name: 'Icon',
    src: voide,
    scale: 1
  },
  text: {
    name: 'Text',
    font: 'bold  13px D-DIN',
    textAlign: 'center',
    textBaseline: 'middle',
    offsetY: -46,
    fill: {
      name: 'Fill',
      color: '#FE726B'
    },
    text: '默认名称' // 默认名称
  }
}
```

### 转换后的style

```ts

// 如果为 ref和reactive对象 改变其中某个属性 样式会从新生成
  let style = new Style({
    image: new Icon({
      src: voide,
      scale: 1,
    }),
    text: new Text({
      font: 'bold  13px D-DIN',
      textAlign: 'center',
      textBaseline: 'middle',
      offsetY: -46,
      fill: new Fill({
      color: '#FE726B',
      }),
      text: '默认名称',
    }),
  }
```

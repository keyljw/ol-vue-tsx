<template>
  <o-map :center="[120.261466, 29.337523]" height="500px">
    <o-select>
      <o-select-item type="pointerMove" :checkStyle="checkStyle" />
      <o-select-item type="singleClick" @select="onSelectPoint" />
      <o-layer :ol-style="stylePoint">
        <o-point
          v-for="(item, index) in points"
          :key="item"
          :id="index"
          :position="item.position"
          :data="item"
        >
        </o-point>
      </o-layer>
      <o-popup
        v-model="checkPoint.position"
        width="250px"
        :title="checkPoint?.text"
        :offset="[0, -30]"
      >
        {{ checkPoint }}
      </o-popup>
    </o-select>
  </o-map>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import voide from '@docs/assets/images/voide.svg'
import type { Feature } from 'ol'
import type Point from 'ol/geom/Point'
let points = ref(createMarkers(200))
let checkPoint = ref<Record<string, string | number[]>>({})

const onSelectPoint = (selData: any) => {
  let { selected } = selData
  if (selected.length) {
    let feature = selected[0]
    checkPoint.value = feature.get('data')
  } else {
    checkPoint.value = {}
  }
}

let checkStyle = (feature: Feature<Point>) => style(feature, 2, 15)
let stylePoint = (feature: Feature<Point>) => style(feature)
let style = (feature: Feature<Point>, scale = 1, fontSize = 13) => {
  let { text } = feature.get('data')
  return {
    icon: { src: voide, scale },
    text: {
      font: `bold  ${fontSize}px D-DIN`,
      textAlign: 'center',
      textBaseline: 'middle',
      offsetY: -46,
      fill: {
        color: '#FE726B'
      },
      text: text
    }
  }
}
function createMarkers(count: number) {
  const markers: any = []
  const center = [120.25664, 29.153607]
  for (let i = 0; i < count; i++) {
    markers.push({
      position: center.map((n) => n + Math.random() - Math.random()),
      text: i + '张三'
    })
  }
  return markers
}
</script>

<style lang="scss" scoped>
.point-popup {
  width: 300px;
  height: 250px;
  overflow: auto;
}
</style>

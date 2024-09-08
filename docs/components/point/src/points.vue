<template>
  <o-map height="400px">
    <o-layer :ol-style="style" @singleclick="onSingleClick" @pointermove="onPointermove">
      <o-point
        v-for="(item, index) in points"
        :key="item"
        :id="index"
        :position="item.position"
        :data="item"
      >
      </o-point>
    </o-layer>
    <o-popup v-model="position" width="250px" :title="checkPoint?.text" :offset="[0, -30]">
      {{ checkPoint }}
    </o-popup>
  </o-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import voide from '@docs/assets/images/voide.svg'
import type Feature from 'ol/Feature'
import type { Point } from 'ol/geom'

let pointId = ref()
let position = ref([])
let checkPoint = ref<Record<string, string>>({})

let style = (feature: Feature<Point>) => {
  let { text } = feature.get('data')
  let id = feature.getId()
  return {
    icon: { src: voide, scale: pointId.value === id ? 2 : 1 },
    text: {
      font: `bold  ${pointId.value === id ? '15px' : '13px'} D-DIN`,
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

let points = ref(createMarkers(50))
function onSingleClick({ feature, data }: Record<string, any>) {
  if (feature) {
    position.value = data.position
    checkPoint.value = data
  } else {
    position.value = []
  }
}

let onPointermove = ({ id, feature }: Record<string, any>) => {
  pointId.value = id ?? undefined
  feature?.changed()
}

// 生成随机点
function createMarkers(count: number) {
  const markers = []
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

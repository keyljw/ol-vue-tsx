<template>
  <o-map ref="map" height="400px" :center="[120.45653, 29.2536]" :zoom="5">
    <o-control :types="type" :typeObject="newFun" />
  </o-map>
</template>

<script setup lang="ts">
import { createStringXY } from 'ol/coordinate'
const type = 'Zoom,FullScreen,MousePosition,ScaleLine'
//拾取坐标方法
const MousePositionFun = {
  coordinateFormat: createStringXY(6),
  projection: 'EPSG:4326'
}
const newFun = { MousePosition: MousePositionFun, Zoom: { test: 111 } }
</script>

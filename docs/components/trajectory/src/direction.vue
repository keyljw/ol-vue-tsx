<template>
  <o-map style="margin-top: 10px" height="400px" :center="[113.310186, 23.267921]" :zoom="9">
    <o-trajectory
      :coordinates="coordinates"
      :olStyle="style"
      :tStyle="tStyle"
      :play="true"
      :loop="true"
      showDir
      :arrowWidth="6"
      :speed="400"
    ></o-trajectory>
    <o-point
      :position="[112.810186, 23.267921]"
      :olStyle="{
        icon: { src: start, scale: 0.5, displacement: [0, 20] }
      }"
    />
    <o-point
      :position="[113.164495, 23.009742]"
      :olStyle="{
        icon: { src: end, scale: 0.5, displacement: [0, 20] }
      }"
    />
  </o-map>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import car from '@docs/assets/images/car.png'
import end from '@docs/assets/images/end.png'
import start from '@docs/assets/images/start.png'
let coordinates = ref([
  [112.810186, 23.267921],
  [113.577856, 23.277534],
  [113.164495, 23.009742]
])
const img = document.createElement('img')
img.src = car
let style = reactive({ stroke: { color: 'rgba(53, 213, 207, 1)', width: 10 } })
let tStyle = (_feature: any, _resolution: number, rotation = 0) => ({
  icon: { img, scale: 0.35, displacement: [0, 0], rotation: -rotation }
})
</script>

<style lang="scss" scoped></style>
方向

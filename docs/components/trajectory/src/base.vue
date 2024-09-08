<template>
  <el-button @click="state = !state">{{ state ? '暂停' : '开始' }}</el-button>

  <o-map style="margin-top: 10px" height="400px" :center="[113.310186, 23.267921]" :zoom="9">
    <o-trajectory
      :coordinates="coordinates"
      :olStyle="style"
      :play="state"
      :loop="true"
      :speed="400"
    ></o-trajectory>
  </o-map>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
let state = ref(true)
let coordinates = ref([
  [112.810186, 23.267921],
  [113.577856, 23.277534],
  [113.164495, 23.009742]
])
let style = reactive({ stroke: { color: '#409eff', width: 5 } })
</script>

<style lang="scss" scoped></style>
方向

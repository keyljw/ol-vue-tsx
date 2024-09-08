<template>
  <o-map height="400px" :center="[113.310186, 23.267921]" :zoom="9">
    <o-line :coordinates="coordinates" :olStyle="style"></o-line>
  </o-map>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
let coordinates = ref([
  [112.810186, 23.267921],
  [113.577856, 23.277534],
  [113.164495, 23.009742]
])
let style = reactive({ stroke: { color: '#409eff', width: 5 } })
</script>

<style lang="scss" scoped></style>

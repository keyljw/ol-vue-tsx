<template>
  <o-map height="400px" zoom="7">
    <o-heatmap :data="points" />
  </o-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let points = ref(createMarkers(50))

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

<template>
  <o-map height="400px">
    <o-cluster
      :olStyle="stylePoint"
      :cluster-style="clusterStyle"
      :data="points"
      :props="{
        distance: 100,
        id: 'id'
      }"
      ref="cluster"
      :fit="{ duration: 400, padding: [50, 200, 50, 200] }"
      @singleclick="onSingleclick"
    >
    </o-cluster>
  </o-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import voide from '@docs/assets/images/voide.svg'
import voideCluster from '@docs/assets/images/voideCluster.png'
import { ElMessage } from 'element-plus'
import type { Feature } from 'ol'

let points = ref(createMarkers(10000))
let pointId = ref()
let cluster = ref()
let onSingleclick = ({ features, layer }: any) => {
  if (features?.length === 1) {
    let [feature] = features
    pointId.value = feature.getId()
    ElMessage.success('点击了图标')
  } else if (features?.length > 1) {
    pointId.value = -1
    ElMessage.success('点击了聚合点')
  } else {
    pointId.value = -1
    ElMessage.success('离开了图层')
  }
  layer?.changed()
}

function createMarkers(count: number, istext = true) {
  const markers: any = []
  const center = [120.25664, 29.153607]
  for (let i = 0; i < count; i++) {
    markers.push({
      id: i + 1,
      position: center.map((n) => n + Math.random() - Math.random()),
      text: istext ? i + '张三' : undefined
    })
  }
  return markers
}

let stylePoint = (feature: Feature) => {
  let data = feature.get('data')
  return {
    icon: {
      src: voide,
      scale: pointId.value === data.id ? 2 : 1
    },
    text: {
      font: 'bold  13px D-DIN',
      textAlign: 'center',
      textBaseline: 'middle',
      offsetY: -46,
      fill: {
        color: '#FE726B'
      },
      text: data.text // 默认名称
    }
  }
}
let clusterStyle = (features: Feature[]) => {
  let count = features.length
  return {
    icon: {
      src: voideCluster,
      scale: 1
    },
    text: {
      font: 'bold  16px D-DIN',
      textAlign: 'center',
      textBaseline: 'middle',
      offsetY: -16,
      fill: {
        name: 'Fill',
        color: 'rgba(6, 228, 242, 1)'
      },
      text: count + '' // 默认名称
    }
  }
}
</script>

<style lang="scss" scoped></style>

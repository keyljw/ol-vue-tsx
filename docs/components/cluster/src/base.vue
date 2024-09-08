<template>
  <o-map height="400px">
    <o-cluster
      :olStyle="stylePoint"
      :cluster-style="clusterStyle"
      :data="points"
      :props="{
        distance: 100
      }"
      ref="cluster"
      :fit="{ duration: 400, padding: [50, 200, 50, 200] }"
      @singleclick="onSingleclick"
    >
    </o-cluster>
  </o-map>
</template>

<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue'
import voide from '@docs/assets/images/voide.svg'
import voideCluster from '@docs/assets/images/voideCluster.png'
import { ElMessage } from 'element-plus'
let points = ref(createMarkers(10000))
let onSingleclick = ({ features }: any) => {
  if (features?.length === 1) {
    ElMessage.success('点击了图标')
  } else if (features?.length > 1) {
    ElMessage.success('点击了聚合点')
  } else {
    ElMessage.success('离开了图层')
  }
}
function createMarkers(count: number, istext = true) {
  const markers: any = []
  const center = [120.25664, 29.153607]
  for (let i = 0; i < count; i++) {
    markers.push({
      position: center.map((n) => n + Math.random() - Math.random()),
      text: istext ? i + '张三' : undefined
    })
  }
  return markers
}

// 点位1 style
let stylePoint = reactive({
  icon: {
    src: voide,
    scale: 1
  },
  text: {
    font: 'bold  13px D-DIN',
    textAlign: 'center',
    textBaseline: 'middle',
    offsetY: -46,
    fill: {
      color: '#FE726B'
    },
    text: '默认名称' // 默认名称
  }
})
let clusterStyle = reactive({
  icon: {
    src: voideCluster,
    scale: 1
  },
  text: {
    font: 'bold  10px D-DIN',
    textAlign: 'center',
    textBaseline: 'middle',
    offsetY: -16,
    fill: {
      name: 'Fill',
      color: 'rgba(6, 228, 242, 1)'
    },
    text: '聚合点' // 默认名称
  }
})
</script>

<style lang="scss" scoped></style>

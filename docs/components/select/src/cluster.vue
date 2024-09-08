<template>
  <o-map :center="[120.261466, 29.337523]" height="500px">
    <o-select>
      <o-select-item type="pointerMove" :checkStyle="checkStyle" />
      <o-select-item type="singleClick" @select="onSelectPoint" />
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
      >
      </o-cluster>
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
import { reactive, ref, toRaw } from 'vue'
import voide from '@docs/assets/images/voide.svg'
import voideCluster from '@docs/assets/images/voideCluster.png'
import type { Feature } from 'ol'
let points = ref(createMarkers(200))
let checkPoint = ref<Record<string, string | number[]>>({})

const onSelectPoint = (selData: any) => {
  let { selected } = selData
  if (selected.length) {
    checkPoint.value = selected[0].get('features')[0].get('data')
  } else {
    checkPoint.value = {}
  }
}

let style = (feature: Feature, scale = 1) => {
  let data = feature.get('data')
  return {
    icon: {
      src: voide,
      scale
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
let style2 = (feature: Feature, scale = 1) => {
  let data = feature.get('data')
  return {
    icon: {
      src: voide,
      scale
    },
    text: {
      font: 'bold  13px D-DIN',
      textAlign: 'center',
      textBaseline: 'middle',
      offsetY: -46,
      fill: {
        color: '#FE726B'
      },
      text: data?.text // 默认名称
    }
  }
}
let checkStyle = (feature: Feature) => style2(feature, 2)
let stylePoint = (feature: Feature) => style(feature)

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

function createMarkers(count: number) {
  const markers: any = []
  const center = [120.25664, 29.153607]
  for (let i = 0; i < count; i++) {
    markers.push({
      id: i + 1,
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

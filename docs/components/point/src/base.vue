<template>
  <o-map height="400px" :center="[120.261466, 30.337523]" :zoom="10">
    <o-point
      :id="point.id"
      :position="point.position"
      :data="point"
      :olStyle="stylePoint"
      @pointermove="onPointermove"
      @singleclick="onClick"
    >
    </o-point>
  </o-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import voide from '@docs/assets/images/voide.svg'
let point = ref({ id: 1, position: [120.25664, 30.253607], text: '测试点' })
let onPointermove = ({ id }: Record<string, any>) => {
  stylePoint.value.icon.scale = id ? 2 : 1
}
let onClick = ({ feature }: Record<string, any>) => {
  if (feature) {
    ElMessage.success('点击了图层')
  } else {
    ElMessage.error('离开了')
  }
}

// 点位1 style
let stylePoint = ref({
  icon: { src: voide, scale: 1 },
  text: {
    font: 'bold  13px D-DIN',
    textAlign: 'center',
    textBaseline: 'middle',
    offsetY: -46,
    fill: {
      color: '#FE726B'
    },
    text: '划入图标变大' // 默认名称
  }
})
</script>

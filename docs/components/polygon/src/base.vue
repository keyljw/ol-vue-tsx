<template>
  <o-map v-loading="loading" height="400px" :center="[112.810186, 23.267921]" :zoom="9">
    <o-polygon
      :coordinates="coordinates"
      :ol-style="olStyle"
      @singleclick="onClick"
      @pointermove="onPointermove"
    ></o-polygon>
  </o-map>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { reactive, ref } from 'vue'
let loading = ref(true)
let coordinates = ref()
onMounted(() => {
  setTimeout(() => {
    loading.value = false
    coordinates.value = [
      [
        [111.810186, 23.267921],
        [113.577856, 23.277534],
        [113.164495, 23.009742],
        [112.164495, 22.89742]
      ]
    ]
  }, 1000)
})
let olStyle = reactive({
  fill: { color: 'rgba(255, 255, 255, 0.2)' },
  stroke: { color: '#409eff', width: 5 },
  text: {
    font: 'bold  28px D-DIN',
    textAlign: 'center',
    fill: { color: '#FE726B' },
    text: '默认名称' // 默认名称
  }
})
let onPointermove = ({ feature }: any) => {
  if (feature) {
    olStyle.fill.color = 'red'
  } else {
    olStyle.fill.color = 'rgba(255, 255, 255, 0.2)'
    ElMessage.error('离开了')
  }
}

let onClick = ({ feature }: any) => {
  if (feature) {
    ElMessage.success('点击了图层')
  } else {
    ElMessage.error('离开了')
  }
}
</script>

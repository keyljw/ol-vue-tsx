<template>
  <o-map height="400px" :center="[112.810186, 23.267921]" :zoom="9">
    <o-polygon
      :coordinates="coordinates"
      :ol-style="style"
      @pointermove="onPointermove"
      @singleclick="onClick"
    ></o-polygon>
    <o-html :position="position" positioning="top-right" :offset="[-20, 0]" :autoPan="false">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
      </el-card>
    </o-html>
  </o-map>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

let coordinates = ref([
  [
    [111.810186, 23.267921],
    [113.577856, 23.277534],
    [113.164495, 23.009742],
    [112.164495, 22.89742]
  ]
])

let style = reactive({
  fill: { color: 'rgba(255, 255, 255, 0.2)' },
  stroke: { color: '#409eff', width: 5 },
  text: {
    font: 'bold  28px D-DIN',
    textAlign: 'center',
    fill: { color: '#FE726B' },
    text: '默认名称' // 默认名称
  }
})
let position = ref([])
let onPointermove = ({ layer, event }: any) => {
  if (layer) {
    position.value = event.coordinate
    style.fill.color = 'rgba(255, 255, 255, 0.5)'
    style.stroke.color = 'red'
  } else {
    position.value = []
    style.fill.color = 'rgba(255, 255, 255, 0.2)'
    style.stroke.color = '#409eff'
  }
}

let onClick = ({ layer }: any) => {
  layer && alert('点击了图层')
}
</script>

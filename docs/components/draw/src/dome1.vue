<template>
  <el-button :disabled="type === 1" @click="onDraw">重新绘制</el-button>
  <el-button @click="onRemoveLastPoint" :disabled="isBack">上一步</el-button>
  <el-button :disabled="type === 2" type="primary" @click="onModify">开启编辑</el-button>
  <el-button :disabled="type === 3" type="success" @click="onFinish">完成</el-button>
  <el-button type="success" @click="getFeatures">获取图层</el-button>
  <el-button @click="onClear" type="danger">删除</el-button>
  <div class="warp">
    <o-map :center="position">
      <o-layer>
        <o-polygon :ol-style="olStyle" :coordinates="coordinates"></o-polygon>
        <o-draw
          ref="draw"
          type="Polygon"
          :ol-style="olStyle"
          hand
          @drawstart="drawstart"
          @drawend="drawend"
        ></o-draw>
      </o-layer>
    </o-map>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const position = ref([112.810186, 23.267921])

let coordinates = ref([
  [
    [111.810186, 23.267921],
    [113.577856, 23.277534],
    [113.164495, 23.009742],
    [112.164495, 22.89742]
  ]
])
const type = ref(0)

const isBack = ref(true)

const olStyle = {
  fill: {
    color: 'rgba(255, 255, 255, 0.2)'
  },
  stroke: {
    color: '#409eff',
    width: 5
  },
  circle: {
    radius: 7,
    fill: '#409eff'
  }
}

const draw = ref()
const onDraw = () => {
  type.value = 1
  onClear()
  draw.value.onDraw()
}
const onModify = () => {
  onFinish()
  type.value = 2

  draw.value.onModify()
}
const onFinish = () => {
  type.value = 0
  draw.value.onFinish()
}
const onClear = () => {
  draw.value.onClear()
}
const onRemoveLastPoint = () => {
  draw.value.onRemoveLastPoint()
}
const drawstart = (e: Record<string, any>) => {
  console.log(e)
  ElMessage.success('开始绘制')
  isBack.value = false
}
const drawend = (e: Record<string, any>) => {
  console.log(e)
  ElMessage.warning('绘制结束')
  onFinish()
  isBack.value = true
}
const getFeatures = () => {
  let fs = draw.value.getFeatures()
  if (fs.length) {
    let coordinates = fs[fs.length - 1].getGeometry().getCoordinates()
    ElMessage.success(JSON.stringify(coordinates))
  }
}
</script>
<style scoped lang="scss">
.warp {
  width: 100%;
  height: 400px;
  position: relative;
  margin-top: 20px;
}
.el-select {
  width: 200px;
}
</style>

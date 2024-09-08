<template>
  <el-select v-model="type">
    <el-option v-for="item in typelist" :key="item" :label="item" :value="item"> </el-option>
  </el-select>
  <div class="warp">
    <o-map :center="position">
      <o-draw :type="type" :ol-style="olStyle"></o-draw>
    </o-map>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const typelist = ['Polygon', 'Circle', 'Point', 'LineString']
const type = ref('Polygon')
const position = ref([112.810186, 23.267921])

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

<template>
  <el-form>
    <el-form-item label="起点经纬度:">
      <el-row :gutter="20" style="width: 100%">
        <el-col :span="12"> <el-input-number v-model="form.orig1" style="width: 100%" /></el-col>
        <el-col :span="12"> <el-input-number v-model="form.orig2" style="width: 100%" /></el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="终点经纬度:">
      <el-row :gutter="20" style="width: 100%">
        <el-col :span="12"> <el-input-number v-model="form.dest1" style="width: 100%" /></el-col>
        <el-col :span="12"> <el-input-number v-model="form.dest2" style="width: 100%" /></el-col>
      </el-row>
    </el-form-item>
  </el-form>
  <el-button @click="state = !state">{{ state ? '暂停' : '开始' }}</el-button>
  <el-button type="primary" @click="getData">查询</el-button>
  <o-map style="margin-top: 10px" height="400px" :center="[113.310186, 23.267921]" :zoom="9">
    <o-drive
      ref="driveRef"
      :orig="orig"
      :dest="dest"
      :olStyle="style"
      :tStyle="tStyle"
      :play="state"
      showDir
      :arrowWidth="6"
      :loop="true"
      :speed="50"
    ></o-drive>
  </o-map>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import car from '@docs/assets/images/car.png'
const form = reactive({
  orig1: 112.810186,
  orig2: 23.267921,
  dest1: 113.164495,
  dest2: 23.009742
})

const orig = computed(() => [form.orig1, form.orig2])
const dest = computed(() => [form.dest1, form.dest2])

let state = ref(true)
let style = reactive({ stroke: { color: '#459C50', width: 10 } })
let driveRef = ref()
const img = document.createElement('img')
img.src = car

let tStyle = (_feature: any, _resolution: number, rotation = 0) => ({
  icon: { img, scale: 0.35, displacement: [0, 0], rotation: -rotation }
})
function getData() {
  driveRef.value.getData()
}
onMounted(() => {})
</script>

<style lang="scss" scoped></style>

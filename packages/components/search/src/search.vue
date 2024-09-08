<template>
  <div>
    <!-- <el-autocomplete
      v-model="value"
      :fetch-suggestions="querySearch"
      placeholder="搜索地名"
      ref="layoutMenuAutocompleteRef"
      @select="onHandleSelect"
      clearable
    >
      <template #prefix>
        <el-icon>
          <Edit />
        </el-icon>
      </template>
      <template #default="{ item }">
        <div class="content">
          <el-icon><Location /></el-icon>
          <span>{{ item.name }}</span>
        </div>
      </template>
      <template #append>
        <el-button type="primary" :icon="Search" @click="onSelect" />
      </template>
    </el-autocomplete> -->
    <o-layer :ol-style="olStyle">
      <o-point
        v-for="(item, index) in points"
        :key="item"
        :id="index"
        :position="item.lonlat"
        :data="item"
      >
      </o-point>
    </o-layer>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import { OLayer } from '../../../components/layer/index'
import { OPoint } from '../../../components/point/index'
import { olStyle as style, type OSearchProps } from './search-types'
// import { Search, Location, Edit } from '@element-plus/icons-vue'
// import { getSearch } from '@packages/api/index'
import { useIntMap } from '@vue-omap/hooks'
import { turnNumbers } from '@vue-omap/utils'
import {} from 'ol/extent'
defineOptions({ name: 'OSearch' })
const props = withDefaults(defineProps<OSearchProps>(), {
  olStyle: style,
  options: { queryType: 1, start: 0, count: 100, level: 12, mapBound: '-180,-90,180,90' }
})
const emits = defineEmits(['update:modelValue', 'search', 'select'])
const value = computed<string>({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
const type = ref(1)
const tk = inject<string>('tk')
const points = ref()
const { map } = useIntMap()
const querySearch = (queryString: string, cb: any) => {
  // if (queryString) {
  //   let params = { ...props.options, keyWord: queryString }
  //   getSearch(params, tk).then((data) => {
  //     emits('search', data)
  //     let { resultType, pois, statistics, area } = data
  //     type.value = resultType
  //     switch (resultType) {
  //       case 1:
  //         cb(pois)
  //         break
  //       case 2:
  //         cb(statistics.priorityCitys.map((m: any) => ({ name: m.adminName, ...m })))
  //         break
  //       case 3:
  //         cb([area])
  //         break
  //       default:
  //         break
  //     }
  //   })
  // } else {
  //   cb([])
  // }
}

const onHandleSelect = (data: any) => {
  points.value = [data]
  value.value = data.name
  reset(data.lonlat, 15)
  emits('select', data)
}
const onSelect = () => {
  querySearch(value.value, (data: any) => {
    points.value = data
  })
}

const reset = (center: number[] | string, zoom: number) => {
  let view = map?.value.getView()
  view?.animate({
    center: turnNumbers(center), // 动画结束时的中心点
    zoom, // 动画结束时的缩放级别
    // rotation: Math.PI / 4, // 动画结束时的旋转角度
    duration: 2500 // 动画持续时间（毫秒）
  })
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  align-items: center;
  gap: 5px;
}
:deep(.el-autocomplete) {
  width: 300px;
  .el-input-group__append {
    background-color: var(--el-color-primary);
    box-shadow: none;
    color: #ffff;
  }
}
</style>

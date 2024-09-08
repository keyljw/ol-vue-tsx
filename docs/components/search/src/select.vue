<template>
  <o-map class="map-warp" height="400px" :center="[112.810186, 23.267921]" :zoom="9">
    <o-popup
      v-model="checkPoint.lonlat"
      width="250px"
      :title="checkPoint?.name"
      :offset="[0, -30]"
    />
    <o-select>
      <o-select-item type="singleClick" :checkStyle="checkStyle" @select="onSelectPoint" />
      <o-search
        v-model="value"
        class="map-secrch"
        :ol-style="olStyle"
        @select="onSelect"
      ></o-search>
    </o-select>
  </o-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import locateSelect from '@docs/assets/images/locate-select.svg'
import locate from '@docs/assets/images/locate.svg'
let value = ref('')
const checkStyle = { icon: { src: locateSelect, scale: 1.2 } }
const olStyle = () => {
  return {
    icon: { src: locate, scale: 1.2 }
  }
}
const onSelect = (data: any) => {
  ElMessage.success(data.lonlat)
}
let checkPoint = ref<Record<string, any>>({})
const onSelectPoint = (selData: any) => {
  let { selected } = selData

  if (selected.length) {
    let feature = selected[0]
    checkPoint.value = feature.get('data')
  } else {
    checkPoint.value = {}
  }
}
</script>
<style lang="scss">
.map {
  &-warp {
    position: relative;
  }
  &-secrch {
    position: absolute;
    z-index: 9999;
    top: 20px;
    left: 20px;
  }
}
</style>

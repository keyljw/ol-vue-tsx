<template>
  <o-map class="map-warp" height="400px" :center="[112.810186, 23.267921]" :zoom="9">
    <o-search v-model="value" class="map-secrch" @select="onSelect"></o-search>
  </o-map>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let value = ref('')
const onSelect = (data: any) => {
  ElMessage.success(data.lonlat)
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

<template>
  <o-map height="400px" :center="[84.263059, 40.372978]" :zoom="6.5">
    <OGeoJson :url="geoTest" />
  </o-map>
</template>

<script setup lang="ts">
const geoTest = 'https://geo.datav.aliyun.com/areas_v3/bound/650000.json' //在线geoJson
</script>

<style lang="scss" scoped></style>

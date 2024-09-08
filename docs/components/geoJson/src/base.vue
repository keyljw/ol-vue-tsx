<template>
  <o-map height="400px" :center="[120.261466, 30.337523]" :zoom="6.5">
    <OGeoJson :features="HangZhou" />
  </o-map>
</template>

<script setup lang="ts">
import HangZhou from '@docs/assets/geoJson/HangZhou.json'
</script>

<style lang="scss" scoped></style>

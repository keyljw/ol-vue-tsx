<template>
  <o-map height="400px" :center="[119.261466, 30.037523]" :zoom="9">
    <template #layer><o-layer-vec :clipCoordinates="HangZhouBorder" /></template>
  </o-map>
</template>
<script lang="ts" setup>
import HangZhouBorder from '@docs/assets/geoJson/HangZhouBorder.json'
</script>

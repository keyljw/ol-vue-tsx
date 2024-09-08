<template>
  <o-map :center="[112.810186, 23.267921]" height="400px">
    <o-html :position="position">
      <el-button type="primary">这是一个按钮</el-button>
    </o-html>
  </o-map>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const position = ref([112.810186, 23.267921])
</script>

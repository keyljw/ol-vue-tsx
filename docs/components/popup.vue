<template>
  <o-html v-bind="$attrs" :position="positionVal" positioning="bottom-center">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>
            {{ props.title }}
          </span>
          <el-icon @click="positionVal = undefined">
            <CloseBold />
          </el-icon>
        </div>
      </template>
      <slot></slot>
      <template #footer>
        <slot name="footer"></slot>
      </template>
      <div class="opopup__arrow"></div>
    </el-card>
  </o-html>
</template>

<script setup lang="ts">
import { CloseBold } from '@element-plus/icons-vue'

import { computed } from 'vue'
const props = defineProps<{
  title?: string
  position: number[]
}>()

const emit = defineEmits(['update:position'])
const positionVal = computed<number[] | undefined>({
  get: () => props.position,
  set: (val) => emit('update:position', val)
})
</script>

<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.opopup {
  background: #fff;
  min-width: 100px;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  padding: 12px;
  color: #606266;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  word-break: break-all;
  box-sizing: border-box;
  position: relative;
}

.opopup__arrow {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid var(--el-bg-color-overlay) !important;
}
</style>

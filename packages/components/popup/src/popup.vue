<template>
  <o-html
    v-bind="$attrs"
    :style="{ width: width }"
    :position="positionVal"
    :positioning="positioning"
  >
    <div class="opopup">
      <div class="opopup__arrow"></div>
      <div class="opopup-header">
        <span>
          {{ props.title }}
        </span>
        <div class="opopup-close" @click="positionVal = undefined"></div>
      </div>
      <div class="opopup-content">
        <slot></slot>
      </div>
    </div>
  </o-html>
</template>

<script setup lang="ts">
import OHtml from '../../html/src/ohtml'

defineOptions({
  name: 'OPopup'
})

import { computed } from 'vue'
const props = withDefaults(
  defineProps<{
    title?: string
    modelValue: number[]
    width: string
    positioning?: any
  }>(),
  { positioning: 'bottom-center', width: '100px' }
)

const emit = defineEmits(['update:modelValue'])

const positionVal = computed<number[] | undefined>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<style scoped lang="scss">
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
  .opopup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  &-close {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 24px;
    height: 24px;
    padding: 3px;
    cursor: pointer;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 15px;
      height: 1px;
      background-color: #606266;
    }

    &::after {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }
  &-content {
    padding: 10px 10px 0 10px;
  }
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
  border-top: 15px solid white !important;
}
</style>

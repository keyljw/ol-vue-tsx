import { defineComponent, provide, shallowRef } from 'vue'
export default defineComponent({
  name: 'OSelect',
  setup(_props, { slots }) {
    const selectSet = shallowRef(new Set())
    // 穿着子组件
    provide('selectSet', selectSet)
    return () => slots?.default && slots.default()
  }
})

import { defineComponent, provide, type PropType, toRefs, watch } from 'vue'

import type { OlStyle } from '../../../typings/utils'
import { takeStyle } from '../../../utils/style'
import { useIntMap } from '@vue-omap/hooks'

export default defineComponent({
  props: {
    olStyle: { type: Object as PropType<OlStyle>, required: true }
  },
  name: 'OLayer',
  setup(props, { slots, expose, emit }) {
    const { olStyle } = toRefs(props)
    const { createLayer, onAll, onMapMounted } = useIntMap()
    const { layer, source } = createLayer()
    // 穿着子组件
    provide('olayers', layer)
    onMapMounted(() => onAll(emit))
    const style = olStyle.value ? takeStyle(olStyle.value) : undefined
    layer?.value?.setStyle(style)
    watch(
      () => props.olStyle,
      () => props.olStyle && layer?.value?.setStyle(takeStyle(props.olStyle)),
      { deep: true, immediate: true }
    )
    expose({ layer, source })
    return () => <template>{slots?.default && slots?.default()}</template>
  }
})

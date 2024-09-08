import { defineComponent, provide, type PropType, toRefs } from 'vue'

import type { OlStyle } from '../../../typings/utils'
import { takeStyle } from '../../../utils/style'
import { useIntMap } from '@vue-omap/hooks'

export default defineComponent({
  props: {
    olStyle: { type: Object as PropType<OlStyle>, required: true }
  },
  name: 'OPointGroup',
  setup(props, { slots, expose, emit }) {
    const { olStyle } = toRefs(props)
    const { createLayer, onAll, onMapMounted } = useIntMap()
    const { layer } = createLayer()
    // 穿着子组件
    provide('layer', layer)
    onMapMounted(() => onAll(emit))
    const style = olStyle.value ? takeStyle(olStyle.value) : undefined
    layer?.value?.setStyle((feature: any) => {
      let newStyle: any = undefined
      const text = feature?.get('text')
      if (text) {
        newStyle = olStyle.value ? takeStyle(olStyle.value) : olStyle
        newStyle?.getText().setText(text)
      } else {
        newStyle = style
      }
      return newStyle
    })
    expose({ layer })
    return () => <template>{slots?.default && slots?.default()}</template>
  }
})

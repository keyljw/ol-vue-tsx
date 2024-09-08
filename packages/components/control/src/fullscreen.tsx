import { defineComponent } from 'vue'
import { useGetMap } from '@vue-omap/hooks'

import { FullScreen } from 'ol/control'
export default defineComponent({
  name: 'OControl',
  props: {},
  setup(props, { slots, emit }) {
    const map = useGetMap(() => {
      map?.value.addControl(new FullScreen())
    })
  }
})

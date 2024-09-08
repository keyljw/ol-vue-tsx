import { defineComponent, toRefs } from 'vue'

import { driveProps } from './drive-types'
import { useDrive } from '@vue-omap/hooks'
import OTrajectory from './../../trajectory/index'

export default defineComponent({
  name: 'ODrive',
  props: driveProps,
  setup(props, { expose }) {
    const { orig, dest } = toRefs(props)
    const { getData, coordinates } = useDrive(orig, dest)
    expose({ getData })
    return () => (
      <template>
        <OTrajectory {...props} coordinates={coordinates.value} />
      </template>
    )
  }
})

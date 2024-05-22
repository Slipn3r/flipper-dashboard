import { Notify } from 'quasar'
import { computed } from 'vue'
import { useMainStore } from 'stores/global/main'
const mainStore = useMainStore()
const isNavigationDisabled = computed(() => mainStore.flags.disableNavigation)

const showNotif = ({
  message,
  color,
  textColor = 'white',
  position = 'bottom-right',
  timeout = 0,
  group = true,
  actions = [],
  isStayOpen = false,
  spinner = false,
  caption = null
}) => {
  const proxiedActions = []
  for (const action of actions) {
    proxiedActions.push({
      ...action,
      handler: () => isNavigationDisabled.value ? null : action.handler(),
      disable: isNavigationDisabled
    })
  }

  if (!isStayOpen) {
    if (actions.length === 0) {
      actions.push({ icon: 'close', color: textColor, class: 'q-px-sm' })
    } else {
      actions.push({ label: 'Dismiss', color: textColor })
    }
  }

  return Notify.create({
    message,
    color,
    textColor,
    position,
    timeout,
    group,
    actions: proxiedActions,
    spinner,
    caption
  })
}

export default showNotif

import { Notify, type QNotifyOptions } from 'quasar'
import { computed, unref } from 'vue'
import { FlipperModel } from 'entities/Flipper'

type Options = {
  isStayOpen?: boolean
}

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
  caption = undefined
}: QNotifyOptions & Options) => {
  const flipperStore = FlipperModel.useFlipperStore()
  const isNavigationDisabled = computed(
    () => flipperStore.flags.disableNavigation
  )

  if (!isStayOpen) {
    if (actions.length === 0) {
      actions.push({ icon: 'close', color: textColor, class: 'q-px-sm' })
    } else {
      actions.push({ label: 'Dismiss', color: textColor })
    }
  }

  const proxyActions: QNotifyOptions['actions'] = []
  for (const action of actions) {
    proxyActions.push({
      ...action,
      handler: () =>
        isNavigationDisabled.value ? undefined : action.handler?.(),
      disable: unref(isNavigationDisabled)
    })
  }

  return Notify.create({
    message,
    color,
    textColor,
    position,
    timeout,
    group,
    actions: proxyActions,
    spinner,
    caption
  })
}

export { showNotif }

import { Notify } from 'quasar'

const showNotif = ({
  message,
  color,
  textColor = 'white',
  position = 'bottom-right',
  timeout = 0,
  group = true,
  actions = [],
  spinner = false,
  caption = null
}) => {
  if (actions.length === 0) {
    actions.push({ icon: 'close', color: textColor, class: 'q-px-sm' })
  } else {
    actions.push({ label: 'Dismiss', color: textColor })
  }

  return Notify.create({
    message,
    color,
    textColor,
    position,
    timeout,
    group,
    actions,
    spinner,
    caption
  })
}

export default showNotif

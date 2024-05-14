import { Notify } from 'quasar'

const showNotif = ({ message, color, textColor = 'white', position = 'bottom-right', timeout = 0, group = true, actions = [] }) => {
  if (actions.length === 0) {
    actions.push({ icon: 'close', color: 'white', class: 'q-px-sm' })
  } else {
    actions.push({ label: 'Dismiss', color: 'white' })
  }

  return Notify.create({
    message,
    color,
    textColor,
    position,
    timeout,
    group,
    actions
  })
}

export default showNotif

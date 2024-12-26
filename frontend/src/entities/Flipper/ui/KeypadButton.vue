<template>
  <div
    ref="button"
    class="control cursor-pointer"
    @mousedown="handlePressStart"
    @mouseup="handlePressEnd"
    @mouseleave="handleLeaveMouse"
  >
    <q-icon
      class="control--default"
      :name="icon"
      :size="size"
      color="transparent"
    />
    <q-icon
      class="control--hover"
      :name="iconHover || icon"
      :size="size"
      color="transparent"
    />
    <q-icon
      class="control--active"
      :name="iconActive || icon"
      :size="size"
      color="transparent"
    />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

type Props = {
  icon: string
  iconHover: string
  iconActive: string
  size: string
  keys: string[]
}

const props = defineProps<Props>()
const emit = defineEmits(['onShortPress', 'onLongPress'])

const button = ref<HTMLElement>()

const isPressed = ref(false)
const isLongPress = ref(false)
const timers = ref<NodeJS.Timeout>()

const handlePressStart = () => {
  isPressed.value = true
  isLongPress.value = false
  timers.value = setTimeout(() => {
    isLongPress.value = true
    isPressed.value = false
    emit('onLongPress')
  }, 350)
}

const handlePressEnd = () => {
  clearTimeout(timers.value)
  if (!isLongPress.value) {
    isPressed.value = false
    emit('onShortPress')
  }
}

const handleLeaveMouse = () => {
  if (isPressed.value) {
    handlePressEnd()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  props.keys.forEach((key) => {
    if (event.code === key) {
      if (!timers.value) {
        handlePressStart()

        button.value?.classList.add('active')
      }
    }
  })
}

const handleKeyup = (event: KeyboardEvent) => {
  props.keys.forEach((key) => {
    if (event.code === key) {
      handlePressEnd()

      timers.value = undefined

      button.value?.classList.remove('active')
    }
  })
}

document.addEventListener('keydown', handleKeydown)
document.addEventListener('keyup', handleKeyup)

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('keyup', handleKeyup)
})
</script>

<style lang="scss" scoped>
@import 'styles';
</style>

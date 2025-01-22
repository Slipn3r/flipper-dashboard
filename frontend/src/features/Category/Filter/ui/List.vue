<template>
  <q-list class="row q-col-gutter-sm">
    <div class="col-auto" v-for="category in categories" :key="category.id">
      <CategoryChip
        v-bind="category"
        :isCurrentCategory="
          !categoriesStore.currentCategory ||
          category.id === categoriesStore.currentCategory?.id
        "
        @click="onClick(category)"
      />
    </div>
  </q-list>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import { FlipperModel } from 'entity/Flipper'
const flipperStore = FlipperModel.useFlipperStore()

import { AppsModel } from 'entity/Apps'
const appsStore = AppsModel.useAppsStore()

import { CategoryModel, CategoryChip } from 'entity/Category'
const categoriesStore = CategoryModel.useCategoriesStore()

const emit = defineEmits(['categorySelected'])

const getCategories = async () => {
  if (
    !categoriesStore.categories.length ||
    flipperStore.api !== categoriesStore.lastApi ||
    flipperStore.target !== categoriesStore.lastTarget
  ) {
    await categoriesStore.getCategories({
      api: flipperStore.api,
      target: flipperStore.target
    })
  }
}

const categories = computed(() => [
  {
    name: 'All apps',
    color: 'EBEBEB',
    id: '-1'
  },
  ...categoriesStore.categories
])

onMounted(async () => {
  await getCategories()
})

watch(
  () => flipperStore.flipperReady,
  async () => {
    categoriesStore.categories = []

    await getCategories()

    emit('categorySelected')
  }
)

watch(
  () => appsStore.flags.catalogChannelProduction,
  async () => {
    categoriesStore.categories = []

    await getCategories()

    emit('categorySelected')
  }
)

const onClick = (category: CategoryModel.CategoryData) => {
  categoriesStore.setCurrentCategory(
    category.id !== '-1' ? category : undefined
  )

  if (categoriesStore.currentCategory) {
    router.push({
      name: 'AppsCategory',
      params: { path: categoriesStore.currentCategory.name.toLowerCase() }
    })
  } else {
    router.push({ name: 'Apps' })
  }

  emit('categorySelected')
}
</script>

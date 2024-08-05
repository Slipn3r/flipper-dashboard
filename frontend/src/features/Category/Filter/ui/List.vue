<template>
  <q-list class="row q-col-gutter-sm">
    <div
      class="col-auto"
      v-for="category in categoriesStore.categories"
      :key="category.id"
    >
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

import { CategoryModel, CategoryChip } from 'entities/Category'
const categoriesStore = CategoryModel.useCategoriesStore()

const emit = defineEmits(['categorySelected'])

onMounted(async () => {
  await categoriesStore.getCategories()
})

const onClick = (category: CategoryModel.CategoryData) => {
  categoriesStore.setCurrentCategory(category.id !== '-1' ? category : undefined)

  if (categoriesStore.currentCategory) {
    router.push({ name: 'AppsCategory', params: { path:  categoriesStore.currentCategory.name.toLowerCase()} })
  } else {
    router.push({ name: 'Apps'})
  }

  emit('categorySelected')
}
</script>

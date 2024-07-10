<template>
  <q-list class="row q-col-gutter-sm">
    <div
      class="col-auto"
      v-for="category in store.categories"
      :key="category.id"
    >
      <CategoryChip v-bind="category" @click="onClick(category)" />
    </div>
  </q-list>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { CategoryChip } from 'entities/Category'

import { CategoryModel } from 'entities/Category'
const store = CategoryModel.useCategoriesStore()

onMounted(async () => {
  await store.getCategories()
})

const onClick = (category: CategoryModel.CategoryData) => {
  console.log(category.name)
}
</script>

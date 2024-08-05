import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

import { CategoryParams, CategoryData } from './types'
import { api } from '../api'

export const useCategoriesStore = defineStore('categories', () => {
  const categoriesLoading = ref(true)
  const categories: Ref<CategoryData[]> = ref([])

  const currentCategory = ref<CategoryData | undefined>(undefined)
  const setCurrentCategory = (category?: CategoryData) => {
    currentCategory.value = category
  }

  const route = useRoute()

  const getCategories = async (params: CategoryParams = {}) => {
    categoriesLoading.value = true

    try {
      const data = await api.fetchCategories(params)

      categories.value = [
        {
          name: 'All apps',
          color: 'EBEBEB',
          id: '-1'
        },
        ...data
      ]

      const path = route.params.path
      if (path) {
        const normalize = (string: string) => string.toLowerCase().replaceAll(' ', '-')

        const category = categories.value.find(e => normalize(e.name) === normalize(path as string))
        if (category) {
          setCurrentCategory(category)
        }
      }

      if (!currentCategory.value) {
        setCurrentCategory(undefined)
      }
    } catch (error) {
      console.error(error)
    }

    categoriesLoading.value = false
  }

  return {
    getCategories,
    categoriesLoading,
    categories,
    currentCategory,
    setCurrentCategory
  }
})

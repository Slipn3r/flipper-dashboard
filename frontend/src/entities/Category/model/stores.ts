import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

import { showNotif } from 'shared/lib/utils/useShowNotif'

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

  const lastApi = ref<string>()
  const lastTarget = ref<string>()
  const getCategories = async (params: CategoryParams = {}) => {
    categoriesLoading.value = true

    lastApi.value = params.api
    lastTarget.value = params.target

    if (!params.api) {
      delete params.api
    }

    if (!params.target) {
      delete params.target
    }

    try {
      categories.value = await api.fetchCategories(params)

      const path = route.params.path
      if (path) {
        const normalize = (string: string) =>
          string.toLowerCase().replaceAll(' ', '-')

        const category = categories.value.find(
          (e) => normalize(e.name) === normalize(path as string)
        )
        if (category) {
          setCurrentCategory(category)
        }
      }

      if (!currentCategory.value) {
        setCurrentCategory(undefined)
      }
    } catch (error) {
      showNotif({
        message: 'Unable to load categories.',
        color: 'negative',
        actions: [
          {
            label: 'Reload',
            color: 'white',
            handler: () => {
              getCategories()
            }
          }
        ]
      })
    }

    categoriesLoading.value = false
  }

  return {
    lastApi,
    lastTarget,
    getCategories,
    categoriesLoading,
    categories,
    currentCategory,
    setCurrentCategory
  }
})

import { ref } from 'vue'
import type { Ref } from 'vue'
import { defineStore } from 'pinia'

import { CategoryParams, CategoryData } from './types'
import { api } from '../api'

export const useCategoriesStore = defineStore('categories', () => {
  const categories: Ref<CategoryData[]> = ref([])

  const getCategories = async (params: CategoryParams = {}) => {
    const data = await api.fetchCategories(params)

    categories.value = [
      {
        name: 'All apps',
        color: 'EBEBEB',
        id: '-1'
      },
      ...data
    ]
  }

  return {
    getCategories,
    categories
  }
})

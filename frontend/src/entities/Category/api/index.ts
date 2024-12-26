// import { AxiosPromise } from 'axios'
import { instance } from 'boot/axios'
import { camelCaseDeep } from 'shared/lib/utils/camelCaseDeep'

import type { CategoryParams, CategoryData } from '../model'

const fetchCategories = async (
  params: CategoryParams = { limit: 500 }
): Promise<CategoryData[]> => {
  return await instance.get('/category', { params }).then(({ data }) => {
    return data.map((category: object) => camelCaseDeep(category))
  })
}

export const api = {
  fetchCategories
}

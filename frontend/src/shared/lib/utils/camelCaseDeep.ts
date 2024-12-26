import _ from 'lodash'

export const camelCaseDeep = (object: object) => {
  return Object.fromEntries(
    Object.entries(object).map((e) => {
      if (!!e[1] && typeof e[1] === 'object' && !Array.isArray(e[1])) {
        e[1] = camelCaseDeep(e[1])
      }
      return [_.camelCase(e[0]), e[1]]
    })
  )
}

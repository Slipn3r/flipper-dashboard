// type Primitive = string | number | boolean;
// type AnyObject = { [key: string]: AnyObject | Primitive };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyObject = Record<string, any>;

// const setProperty = (obj: AnyObject, options: AnyObject): AnyObject => {
//   const keys = Object.keys(options)

//   keys.forEach((key) => {
//     const value = options[key]

//     if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
//       if (!obj[key]) {
//         obj[key] = {}
//       }
//       setProperty(obj[key] as AnyObject, options[key] as AnyObject)
//     } else {
//       obj[key] = value
//     }
//   })

//   return obj
// }

function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function setProperty<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target }

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (isObject(sourceValue) && isObject(targetValue)) {
        result[key as keyof T] = setProperty(
          targetValue as object,
          sourceValue as object
        ) as T[keyof T]
      } else if (isObject(sourceValue)) {
        result[key as keyof T] = setProperty(
          {} as object,
          sourceValue as object
        ) as T[keyof T]
      } else {
        result[key as keyof T] = sourceValue as T[keyof T]
      }
    }
  }

  return result as T
}

export default setProperty

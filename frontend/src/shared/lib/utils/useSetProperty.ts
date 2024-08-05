// type Primitive = string | number | boolean;
// type AnyObject = { [key: string]: AnyObject | Primitive };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>;

const setProperty = (obj: AnyObject, options: AnyObject): AnyObject => {
  const keys = Object.keys(options)

  keys.forEach((key) => {
    const value = options[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (!obj[key]) {
        obj[key] = {}
      }
      setProperty(obj[key] as AnyObject, options[key] as AnyObject)
    } else {
      obj[key] = value
    }
  })

  return obj
}

export default setProperty

import _ from "lodash"

export const flattenObject = (
  obj: Record<string, any>,
  parentKey = ""
): Record<string, any> => {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const newKey = parentKey ? `${parentKey}_${key}` : key
    const value = obj[key]

    if (_.isObject(value) && !Array.isArray(value) && value !== null) {
      Object.assign(acc, flattenObject(value, newKey))
    } else if (Array.isArray(value)) {
      if (value.every((item) => _.isObject(item))) {
        acc[newKey] = value
          .map((item) => {
            return `{${Object.entries(item)
              .map(([subKey, subValue]) => `${subKey}: ${subValue}`)
              .join(", ")}}`
          })
          .join(", ")
      } else {
        acc[newKey] = value.join(", ")
      }
    } else {
      acc[newKey] = value
    }

    return acc
  }, {})
}

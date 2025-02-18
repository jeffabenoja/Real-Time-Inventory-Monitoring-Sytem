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
      if (newKey === "details") {
        if (value.length > 0 && _.isObject(value[0])) {
          value.forEach((item, index) => {
            Object.assign(acc, flattenObject(item, `${newKey}_${index}`))
          })
        }
      } else if (value.every((item) => _.isObject(item))) {
        acc[newKey] = value
          .map((item) => flattenObject(item, newKey))
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

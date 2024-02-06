import { mapValues, isPlainObject, isArray } from 'lodash'

const recursiveFunc: any = (map: any) => {
  const deeplyArray = (obj: any, fn: any) => obj.map((x: any) => (isPlainObject(x) ? recursiveFunc(map)(x, fn) : x))

  return (obj: any, fn: any) => {
    if (isArray(obj)) {
      return deeplyArray(obj, fn)
    }

    return map(
      mapValues(obj, (v: any) =>
        // eslint-disable-next-line
        isPlainObject(v) ? recursiveFunc(map)(v, fn) : isArray(v) ? deeplyArray(v, fn) : v
      ),
      fn
    )
  }
}

export default recursiveFunc

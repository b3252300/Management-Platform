/**
 * 类型解释
 * @param value
 * @param options
 * @param v
 * @param l
 * @returns {string|*}
 */
export function paraphrase(value, options = [], v = 'value', l = 'label') {
  if (value === undefined || value === null) return ''
  const newData = options.filter(x => {
    return x[v] == value
  })
  if (newData.length > 0) {
    return newData[0][l]
  }
  return value
}

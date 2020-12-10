/**
 * 配列内のオブジェクトのキーを再帰的にキャメルケースに変換する。
 */
export const mapKeysCamelCase = (data) =>
  _mapKeysDeep(data, (_value, key) => _.upperFirst(_.camelCase(key)))

const _mapKeysDeep = (data, callback) => {
  if (_.isArray(data)) {
    return data.map((innerData) => _mapKeysDeep(innerData, callback))
  } else if (_.isPlainObject(data)) {
    return _.mapValues(_.mapKeys(data, callback), (val) =>
      _mapKeysDeep(val, callback)
    )
  } else {
    return data
  }
}

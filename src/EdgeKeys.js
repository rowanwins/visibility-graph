/**
 * EdgeKeys
 */
export default class EdgeKeys {
  /** @type {EdgeKey[]} */
  keys = []

  /**
   * @param {EdgeKey} edgeKey
   * @return {number}
   */
  findKeyPosition (edgeKey) {
    let lo = 0
    let hi = this.keys.length
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (edgeKey.isLessThanOtherEdgeKey(this.keys[mid])) hi = mid
      else lo = mid + 1
    }
    return lo
  }

  /**
   * @param {EdgeKey} edgeKey
   */
  addKey (edgeKey) {
    const lo = this.findKeyPosition(edgeKey)
    this.keys.splice(lo, 0, edgeKey)
  }
}

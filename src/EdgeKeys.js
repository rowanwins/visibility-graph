export class EdgeKeys {

  constructor () {
    this.keys = []
  }

  findKeyPosition (edgekey) {
    let lo = 0
    let hi = this.keys.length
    // if (edgekey.edge.p1.x === 14.414062499999998 && edgekey.edge.p1.y === 12.897489183755892) console.log('HI', hi)
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)

      if (this.keys[mid].isLessThanOtherEdgeKey(edgekey)) hi = mid
      else lo = mid + 1
    }
    // if (edgekey.edge.p1.x === 14.414062499999998 && edgekey.edge.p1.y === 12.897489183755892) console.log('LO', lo)

    return lo
  }

  addKey (edgekey) {
    let lo = 0
    let hi = this.keys.length
    if (edgekey.edge.p1.x === 14.414062499999998 && edgekey.edge.p1.y === 12.897489183755892) console.log('HI', hi)
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2)
      if (edgekey.edge.p1.x === 14.414062499999998 && edgekey.edge.p1.y === 12.897489183755892) console.log('MID', mid)

      if (this.keys[mid].isLessThanOtherEdgeKey(edgekey)) hi = mid
      else lo = mid + 1
    }
    if (edgekey.edge.p1.x === 14.414062499999998 && edgekey.edge.p1.y === 12.897489183755892) console.log('LO', lo)
    this.keys.splice(lo - 1, 0, edgekey)
  }

  // addKey (edgekey, blah) {
  //   const lo = this.findKeyPosition(edgekey, blah)
  //   this.keys.splice(lo - 1, 0, edgekey)
  // }

}

export default {
  methods: {
    setTrains(arr) {
      if (!arr || arr.length === 0) {
        return
      }
      const newArr = [...new Set(JSON.parse(JSON.stringify(arr)))]
      newArr.sort(function(a, b) {
        return a - b
      })
      const bb = []
      let aa = []
      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i + 1] && newArr[i] + 1 === newArr[i + 1]) {
          aa.push(newArr[i])
          aa.push(newArr[i + 1])
        } else {
          aa.push(newArr[i])
          if (!aa || aa.length === 0) {
            return
          }
          bb.push(aa)
          aa = []
          continue
        }
      }
      let _str = ''
      bb.forEach((D, i) => {
        if (this.getArrMin(D) === this.getArrMax(D)) {
          _str += this.getArrMin(D) + '  '
          return
        }
        _str += this.getArrMin(D) + '-' + this.getArrMax(D) + '  '
      })
      return _str
    },
    getArrMax(arr) {
      return Math.max.apply(null, arr)
    },
    getArrMin(arr) {
      return Math.min.apply(null, arr)
    }
  }
}

import Vue from 'vue'

Vue.filter('setTimeMin', function(value) {
  if (value < 0) return value
  if (!value) return 0
  const a = parseFloat(value / 60).toFixed(10)
  const num = a.substring(0, a.lastIndexOf('.') + 2)
  return num
})

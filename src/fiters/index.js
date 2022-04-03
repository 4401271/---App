import Vue from 'vue'
import moment from 'moment'
// import format from 'date-fns/format'

// 自定义过滤器  不需要引入，或者是暴露，但是要是想要生效，我们需要将其加入依赖图中，只需要在main.js中将其引入即可
Vue.filter('date-format', function (value, formatStr='YYYY-MM-DD HH:mm:ss') {
  return moment(value).format(formatStr)
})

// Vue.filter('date-format2', function (value, formatStr='yyyy-MM-dd kk:mm:ss') {
//   return format(value, formatStr)
// })

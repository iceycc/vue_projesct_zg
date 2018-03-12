import Vue from 'vue'

Vue.filter('template', function (value) {
    return value + 'template';
});

// Vue.filter('my_time',function (value,num) {
//   return value.substring(num)
//   // return "aa" + value
// })

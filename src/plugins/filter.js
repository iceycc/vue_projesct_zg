import Vue from 'vue'

Vue.filter('template', function (value) {
    return value + 'template';
});

// Vue.filter('my_time',function (value,num) {
//   return value.substring(num)
//   // return "aa" + value
// })//
Vue.filter('crtTime',function (value) {
  if (value != null) {
    var date = new Date(val);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'cc11';
  }
})

export default Vue

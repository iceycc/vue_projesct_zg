import Vue from 'vue'
import moment from 'moment'
Vue.filter('template', function (value) {
    return value + 'template';
});

// Vue.filter('my_time',function (value,num) {
//   return value.substring(num)
//   // return "aa" + value
// })//
Vue.filter('crtTime',function () {
  if (val != null) {
    // let data = new Date()
    var date = new Date(val * 1000);
    // return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
    //     + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return moment(date).format("YYYY-MM-DD HH:mm:ss")
    // return date
  }
})

export default Vue

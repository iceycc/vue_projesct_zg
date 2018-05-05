import moment from 'moment'
let crtTime = value => {
  var date = new Date(value * 1000);
  return moment(date).format("YYYY-MM-DD HH:mm:ss")
}
let chu100 = value => {
      return value * 0.01
}
export {
  crtTime,
  chu100
}

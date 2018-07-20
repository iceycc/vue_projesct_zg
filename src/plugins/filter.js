import moment from 'moment'
let crtTime = value => {
  if(!value) return
  var date = new Date(value * 1000);
  return moment(date).format("MM-DD HH:mm:ss")

}
let crtTime1 = value => {
  if(!value) return
  var date = new Date(value * 1000);
  return moment(date).format("YYYY-MM-DD HH:mm:ss")
}
let chu100 = value => {
  let x = value * 0.01
  var f_x = parseFloat(x);
  if (isNaN(f_x)) {
    alert('function:changeTwoDecimal->parameter error');
    return false;
  }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}
let cutStr = (value,num) => {

}
export {
  crtTime,
  crtTime1,
  chu100
}

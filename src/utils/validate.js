
export function checkUserName (rule, value, callback) {
    if (value) {
      if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('用户名不能包含中文名'));
      } else {
        callback();
      }
    }
    callback();
}
export function checkPwd (rule, value, callback) {
    var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,17})$/
    if (value) {
      if (!reg.test(value)) {
        callback(new Error('长度在6-20之间，以字母开头且只能包含字母和数字'));
      } else {
        callback();
      }
    }
    callback();

}

  
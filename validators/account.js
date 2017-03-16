var validator = require('node-validator');

exports.beforeAdd = function(account) {
  if (!account.type || !validator.trim(account.type) === '') {
    return {
      message: '账户类型不能为空',
    }
  }
  if (!account.username || validator.trim(account.username) === '') {
    return {
      message: '账户名不能为空',
    }
  }
  if (!account.password || validator.trim(account.password) === '') {
    return {
      message: '密码不能为空',
    }
  }
}

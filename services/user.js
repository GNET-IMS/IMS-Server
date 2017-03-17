var { response, error } = require('../response');
var gitlab = require('../services/gitlab');
var zentao = require('../services/zentao');
var db = require('../services/db');
var User = require('../models/user');

var createOtherAccount = function(data) {
  console.log(data)
  gitlab.createUser({
    name: data.name,
    username: data.username,
    password: 123456,
    email: data.email,
  }, function (result) {
    if (result) console.log(`[gitlab][success]创建gitlab账号, 请查看你的邮箱`);
  });

  zentao.createUser({
    dept: 1,
    gender: data.sex === '0' ? 'm' : 'f',
    account: data.username,
    realname: data.name,
    password1: 123456,
    password2: 123456,
    verifyPassword: 123456,
  }, function (result, err) {
    if (err) console.log(`[zentao][error]:${err}`)
    else console.log(`[zentao][success]:${result}`)
  });
}

exports.batchCreateOtherAccount = function(data) {
  console.log(data)
  for (let item of data) {
    createOtherAccount(item);
  }
}

exports.createOtherAccount = createOtherAccount;
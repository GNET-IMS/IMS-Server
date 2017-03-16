// Load required packages
var { response, error } = require('../response');
var gitlab = require('../services/gitlab');
var zentao = require('../services/zentao');
var User = require('../models/user');
var moment = require('moment');
var { save, batchSave, remove, update } = require('../services/user');

var save =

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {

  var data = req.body;

  var callback = response(req, res, err, function() {
    gitlab.createUser({
      name: data.name,
      username: data.username,
      password: data.password,
      email: data.email,
    }, function(result) {
      if (result) console.log('创建gitlab账号, 请查看你的邮箱');
    });

    zentao.createUser({
        dept: 1,
        gender: data.sex === '0' ? 'm' : 'f',
        account: data.username,
        realname: data.name,
        password1: data.password,
        password2: data.password,
        verifyPassword: 123456,
      }, function(data, err) {
        if (err) console.log(err)
        else console.log(data)
    });

    return {
      message: '创建职员成功',
    }
  }, function(error) {
    return {
      message: '创建职员失败',
      errorMessage: error
    }
  });

  if (data instanceof Array) {
    batchSave(data, callback);
  } else {
    save(data, callback)
  }
};

exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    response(req, res, err, function() {
      return {
        message: '查询职员列表信息成功',
        data: {
          users
        }
      }
    }, function() {
      return {
        message: '查询职员列表信息失败',
      }
    });
  });
};

exports.getUser = function(req, res) {
  User.find(req.params, function(err, user) {
    response(req, res, err, function() {
      return {
        message: '查询职员信息成功',
        data: {
          user
        }
      }
    }, function() {
      return {
        message: '查询职员信息失败',
      }
    });
  });
};

exports.deleteUser = function(req, res) {
  User.remove(req.params, function(err) {
    response(req, res, err, function() {
      return {
        message: '删除职员信息成功',
      }
    }, function() {
      return {
        message: '删除职员信息失败',
      }
    });
  });
};

exports.updateUser = function(req, res) {
  User.update(req.body, function(err) {
    response(req, res, err, function() {
      return {
        message: '更新职员信息成功',
      }
    }, function() {
      return {
        message: '更新职员信息失败',
      }
    });
  });
};

exports.test = function(req, res) {
  zentao.createUser({
      dept: 1,
      gender: 'f',
      account: 2323,
      realname: 2323,
      password1: 123456,
      password2: 123456,
      verifyPassword: 123456,
    }, function(data, err) {
      if (err) console.log(err);
      console.log(data)
  });
}
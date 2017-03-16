// Load required packages
var Account = require('../models/account');
var validator = require('../validators/account');
var { response, error } = require('../response');
var { getUsers } = require('../services/gitlab');

// Create endpoint /api/accounts for POST
exports.postAccounts = function(req, res) {
  var account = new Account({
    name: req.body.name,
    type: req.body.type,
    username: req.body.username,
    password: req.body.password,
    createDate: new Date().toLocaleString(),
  });
  account.save(function(err) {
    response(req, res, err, function() {
      return {
        status: 201,
        message: '添加账号成功',
      }
    }, function() {
      return {
        status: 500,
        message: '添加账号失败',
      }
    });
  });
};

// Create endpoint /api/accounts for GET
exports.getAccounts = function(req, res) {
  getUsers(function(users) {
    console.log(users, 'gitlab')
  })
  Account.find(function(err, accounts) {
    response(req, res, err, function() {
      return {
        status: 201,
        message: '查询账号信息成功',
        data: {
          accounts
        }
      }
    }, function() {
      return {
        status: 500,
        message: '查询账号信息失败',
      }
    });
  });
};

// Create endpoint /api/accounts for GET
exports.getAccount = function(req, res) {
  Account.find(req.params, function(err, account) {
    response(req, res, err, function() {
      return {
        status: 201,
        message: '查询账号信息成功',
        data: {
          account
        }
      }
    }, function() {
      return {
        status: 500,
        message: '查询账号信息失败',
      }
    });
  });
};

exports.updateAccount = function(req, res) {
  Account.update(req.body, function(err, accounts) {
    response(req, res, err, function() {
      return {
        status: 201,
        message: '修改账号信息成功',
      }
    }, function() {
      return {
        status: 500,
        message: '修改账号信息失败',
      }
    });
  });
};

exports.deleteAccount = function(req, res) {
  Account.remove(req.params.id, function(err, result) {
    response(req, res, err, function() {
      return {
        status: 201,
        message: '删除成功'
      }
    }, function() {
      return {
        status: 500,
        message: '删除失败',
      }
    });
  });
};

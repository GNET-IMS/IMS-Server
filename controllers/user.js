// Load required packages
var { response, error, success } = require('../response');
var gitlab = require('../services/gitlab');
var zentao = require('../services/zentao');
var db = require('../services/db');
var file = require('../services/file');
var User = require('../models/user');
var moment = require('moment');
var encryption = require('../services/encryption');
var userServices = require('../services/user');

// Create endpoint /api/users for POST
exports.postUsers = function (req, res) {
  var data = req.body;
  if (data instanceof Array) {
    batchSave(data, req, res);
  } else {
    var user = new User({
      username: data.username,
      password: `${data.password}`,
      sex: +data.sex || 0,
      email: data.email || '',
      name: data.name,
      birthday: data.birthday || '',
      department: data.department,
      title: data.title || '',
      avatar_url: data.avatar_url || '',
      is_admin: data.is_admin || false,
      created_at: moment().format('YYYY-MM-DD hh:mm:ss'),
    });
    user.save(function (err) {
      response(req, res, err, function () {
        userServices.createOtherAccount(data);
        return {
          message: '创建职员成功',
        }
      }, function (error) {
        return {
          message: '创建职员失败',
          errorMessage: error
        }
      });
    });
  }
};

var batchSave = function (data, req, res) {
  const currentTime = moment().format('YYYY-MM-DD hh:mm:ss');
  const users = data.map(item => {
    item.is_admin = false;
    item.created_at = currentTime;
    item.password = encryption.passwordEncodeSync(item.password);
    return item;
  })
  User.collection.insert(users, function (err, docs) {
    response(req, res, err, function () {
      userServices.batchCreateOtherAccount(users);
      return {
        message: '创建职员成功',
      }
    }, function (error) {
      return {
        message: err.toString(),
        errorMessage: err.toString(),
      }
    });
  })
}

exports.getUsers = function (req, res) {
  const params = req.query.query;
  const json = params && JSON.parse(params) || {};
  const pagination = json.pagination;
  const sorter = json.sorter;
  const filters = json.filters;
  db.pageQuery(pagination, User, '', filters, sorter, function (err, result) {
    response(req, res, err, function () {
      return {
        message: '查询职员列表信息成功',
        data: {
          users: result.results,
          pagination: result.pagination
        }
      }
    }, function () {
      return {
        message: err.toString(),
      }
    });
  })
};

exports.getUser = function (req, res) {
  User.findById(req.params, function (err, user) {
    response(req, res, err, function () {
      return {
        message: '查询职员信息成功',
        data: {
          user
        }
      }
    }, function () {
      return {
        message: err.toString(),
      }
    });
  });
};

exports.deleteUser = function (req, res) {
  User.remove(req.params, function (err) {
    response(req, res, err, function () {
      return {
        message: '删除职员信息成功',
      }
    }, function () {
      return {
        message: err.toString(),
      }
    });
  });
};

exports.updateUser = function (req, res) {
  const data = req.body;
  delete data._id;
  User.findById(req.params, function (err, user) {
    if (err) error(res, { message: err.toString })
    for (key in data) {
      user[key] = data[key];
    }
    user.save(function (err) {
      response(req, res, err, function () {
        return {
          message: '更新职员信息成功',
        }
      }, function () {
        return {
          message: err.toString() 
        }
      });
    })
  })
};

exports.uploadPhoto = function (req, res) {
  file.uploadImage(req, {
    uploadDir: './public/images/photo/'
  }, function(url) {
    const avatar_url = url.split('./public')[1];
    User.update(req.params, {avatar_url}, function(err, docs) {
      if (err) error(res, {message: err.toString()});
      success(res, {
        message: '上传成功',
        data: {
          photo: avatar_url
        }
      })
    })
  }, function(message) {
    error(res, {
      message
    })
  })
}

exports.test = function (req, res) {
  zentao.createUser({
    dept: 1,
    gender: 'f',
    account: 2323,
    realname: 2323,
    password1: 123456,
    password2: 123456,
    verifyPassword: 123456,
  }, function (data, err) {
    if (err) console.log(err);
    console.log(data)
  });
}
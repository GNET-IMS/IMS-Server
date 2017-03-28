// Load required packages
import { response, error, success } from '../response';
import gitlab from '../services/gitlab';
import zentao from '../services/zentao';
import db from '../services/db';
import file from '../services/file';
import User from '../models/user';
import moment from 'moment';
import encryption from '../services/encryption';
import userServices from '../services/user';

// Create endpoint /api/users for POST
const postUsers = (req, res) => {
  let data = req.body;
  if (data instanceof Array) {
    batchSave(data, req, res);
  } else {
    const user = new User({
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
    user.save((err) => {
      response(req, res, err, () => {
        userServices.createOtherAccount(data);
        return {
          message: '创建职员成功',
        }
      }, (error) => {
        return {
          message: '创建职员失败',
          errorMessage: error
        }
      });
    });
  }
};

const batchSave = (data, req, res) => {
  const currentTime = moment().format('YYYY-MM-DD hh:mm:ss');
  const users = data.map(item => {
    item.is_admin = false;
    item.created_at = currentTime;
    item.password = encryption.passwordEncodeSync(item.password);
    return item;
  })
  User.collection.insert(users, (err, docs) => {
    response(req, res, err, () => {
      userServices.batchCreateOtherAccount(users);
      return {
        message: '创建职员成功',
      }
    }, (error) => {
      return {
        message: err.toString(),
        errorMessage: err.toString(),
      }
    });
  })
}

const getUsers = (req, res) => {
  const query = req.query;
  db.pageQuery(query, User, '', (err, result) => {
    response(req, res, err, () => {
      return {
        message: '查询职员列表信息成功',
        data: {
          users: result.results,
          pagination: result.pagination
        }
      }
    }, () => {
      return {
        message: err.toString(),
      }
    });
  })
};

const getUser = (req, res) => {
  User.findById(req.params, (err, user) => {
    response(req, res, err, () => {
      return {
        message: '查询职员信息成功',
        data: {
          user
        }
      }
    }, () => {
      return {
        message: err.toString(),
      }
    });
  });
};

const deleteUser = (req, res) => {
  User.remove(req.params, (err) => {
    response(req, res, err, () => {
      return {
        message: '删除职员信息成功',
      }
    }, () => {
      return {
        message: err.toString(),
      }
    });
  });
};

const updateUser = (req, res) => {
  const data = req.body;
  delete data._id;
  User.findById(req.params, (err, user) => {
    if (err) error(res, { message: err.toString })
    for (key in data) {
      user[key] = data[key];
    }
    user.save ((err) => {
      response(req, res, err, () => {
        return {
          message: '更新职员信息成功',
        }
      }, () => {
        return {
          message: err.toString() 
        }
      });
    })
  })
};

const uploadPhoto = (req, res) => {
  file.uploadImage(req, {
    uploadDir: './public/images/photo/'
  },(url) => {
    const avatar_url = url.split('./public')[1];
    User.update(req.params, {avatar_url},(err, docs) => {
      if (err) error(res, {message: err.toString()});
      success(res, {
        message: '上传成功',
        data: {
          photo: avatar_url
        }
      })
    })
  },(message) => {
    error(res, {
      message
    })
  })
}

export default {
  postUsers,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  uploadPhoto
}
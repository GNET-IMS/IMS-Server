// app/extend/helper.js
const moment = require('moment');
const async = require('async');
const bcrypt = require('bcrypt-nodejs');
const uuid = require('node-uuid');

// this 是 helper 对象，在其中可以调用其他 helper 方法
// this.ctx => context 对象
// this.app => application 对象

module.exports = {
  currentTime() {
    return moment().format('YYYY-MM-DD hh:mm:ss');
  },
  async search(query, Model, populate = '') {
    let pagination = { current: 1, pageSize: 10 };
    let queryParams = {}
    let sorter = { "_id": 'desc' };
    let sorterField;
    let order;

    for (let key in query) {
      if (key === 'current' || key === 'pageSize') {
        pagination[key] = +query[key];
      } else if (key === 'order' || key === 'sorter') {
        if (key === 'sorter') sorterField = query[key];
        if (key === 'order') order = query[key]
      } else {
        if (Model.schema.obj[key].type.schemaName === 'ObjectId') {
          queryParams[key] = query[key];
        } else {
          queryParams[key] = new RegExp(query[key]);
        }
      }
    }

    if (sorterField && order) sorter = { [sorterField]: order };

    const current = pagination.current;
    const pageSize = pagination.pageSize;
    const start = (current - 1) * pageSize;
    for (let i in queryParams) {
      if (!queryParams[i]) delete queryParams[i];
    }
    let result = {
      pagination
    };

    const [count, records] = await Promise.all([
      Model.count(queryParams),
      Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sorter)
    ])

    result.pagination.total = count;
    result.records = records;
    return result;
  },
  hashEncode(password, rounds = 5) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(rounds, (err, salt) => {
        if (err) {
          reject(err);
          return false;
        }
        bcrypt.hash(password, salt, null, function (err, hash) {
          if (err) {
            reject(err);
            return false;
          }
          resolve(hash);
        });
      });
    })
  },
  hashEncodeSync(password, rounds = 5) {
    const salt = bcrypt.genSaltSync(rounds);
    return bcrypt.hashSync(password, salt);
  },
  changeFilename(filename, ext) {
    const _ext = ext ? ext : filename.split('.')[1];
    return `${uuid.v1()}.${_ext}`;
  },
};
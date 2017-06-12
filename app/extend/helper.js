// app/extend/helper.js
const moment = require('moment');
const async = require('async');
const bcrypt = require('bcrypt-nodejs');
const uuid = require('node-uuid');
const { pagination, paginationQuery } = require('../lib/pagination');

module.exports = {
  get currentTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },
  pagination,
  paginationQuery,
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
// app/extend/helper.js
const moment = require('moment');
const uuid = require('node-uuid');


module.exports = Object.assign({
  get currentTime() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  },
  changeFilename(filename, ext) {
    const _ext = ext ? ext : filename.split('.')[1];
    return `${uuid.v1()}.${_ext}`;
  },
}, require('../lib'))


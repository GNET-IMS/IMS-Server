// app/extend/helper.js
const moment = require('moment');
const async = require('async');
const formidable = require('formidable');

module.exports = {
  foo(param) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
  },
  currentTime() {
    return moment().format('YYYY-MM-DD hh:mm:ss');
  },
  search(query, Model, populate = '') {
    const pageQuery = (query, Model, populate, callback) => {
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
          queryParams[key] = new RegExp(query[key]);
        }
      }

      if (sorterField && order) sorter = { [sorterField]: order };

      const current = pagination.current;
      const pageSize = pagination.pageSize;
      const start = (current - 1) * pageSize;
      for (let i in queryParams) {
        if (!queryParams[i]) delete queryParams[i];
      }
      let $page = {
        pagination
      };
      async.parallel({
        count: function (done) {  // 查询数量
          Model.count(queryParams).exec(function (err, count) {
            done(err, count);
          });
        },
        records: function (done) {   // 查询一页的记录
          Model.find(queryParams).skip(start).limit(pageSize).populate(populate).sort(sorter).exec(function (err, doc) {
            done(err, doc);
          });
        }
      }, function (err, results) {
        const count = results.count;
        $page.pagination.total = count;
        $page.results = results.records;
        callback(err, $page);
      });
    }
    return new Promise((resolve, reject) => {
      pageQuery(query, Model, populate, (err, page) => {
        if (err) reject(err);
        else resolve(page);
      });
    })
  },
  uploadImage(req, option) {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();   //创建上传表单
      form.encoding = option.encoding || 'utf-8';        //设置编辑
      form.uploadDir = option.uploadDir || './public/images/photo/';     //设置上传目录
      form.keepExtensions = option.keepExtensions || true;     //保留后缀
      form.maxFieldsSize = option.maxFieldsSize || 2 * 1024 * 1024;   //文件大小
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return false;
        };
        let extName = '';  //后缀名
        switch (files.avatar.type) {
          case 'image/pjpeg':
            extName = 'jpg';
            break;
          case 'image/jpeg':
            extName = 'jpg';
            break;
          case 'image/png':
            extName = 'png';
            break;
          case 'image/x-png':
            extName = 'png';
            break;
          case 'image/gif':
            extName = 'gif';
            break;
          case 'image/bmp':
            extName = 'bmp';
            break;
        }

        if (!extName) {
          reject('图片格式错误');
          return false;
        }

        const avatarName = Math.random() + '.' + extName;
        const newPath = form.uploadDir + avatarName;
        fs.renameSync(files.avatar.path, newPath);
        resolve(newPath);
      });
    })
  }
};
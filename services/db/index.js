var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

exports.pageQuery = function (query, Model, populate = '', callback) {
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

    if (sorterField && order) sorter = { [sorterField]: order};

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
};
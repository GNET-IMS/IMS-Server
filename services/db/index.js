var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

exports.pageQuery = function (pagination={current: 1, pageSize: 10}, Model, populate='', queryParams={}, sorter={"_id": 'desc'}, callback) {
    var current = pagination.current;
    var pageSize = pagination.pageSize;
    var start = (current - 1) * pageSize;
    console.log(queryParams)
    for (var i in queryParams) {
        if (!queryParams[i]) delete queryParams[i];
    }
    var $page = {
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
        var count = results.count;
        $page.pagination.total = count;
        $page.results = results.records;
        callback(err, $page);
    });
};
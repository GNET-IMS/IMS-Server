const query = require('./query');


module.exports = {
    pagination: query.mysql,
    paginationQuery: query.mysqlQuery,
    mongodbPagination: query.mongodb
}
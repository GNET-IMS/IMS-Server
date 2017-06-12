const SqlHandler = require('./SqlHandler');

module.exports = {
  /**
   * mongodb pagination
   * @param {Object} query 
   * @param {Object} Model 
   * @param {String} populate 
   */
  async mongodb(query, Model, populate = '') {
    const getCount = queryParams => Model.count(queryParams)
    const getSlect = ({ queryParams, sorter, pageSize, start }) => Model
      .find(queryParams)
      .skip(start)
      .limit(pageSize)
      .populate(populate)
      .sort(sorter)

    return await _pagination(query, getCount, getSelection);
  },
  /**
   * mysql pagination
   * @param {String} table
   * @param {Object} query 
   * @param {Object} db 
   */
  async mysql(table, query, db) {
    const getCount = queryParams => db.count(table, queryParams)
    const getSelect = ({ queryParams, sorter, pageSize, start }) => db.select(table, {
      where: queryParams,
      orders: sorter.length > 0 ? [sorter] : undefined,
      limit: pageSize,
      offset: start,
    })
    return await _pagination(query, getCount, getSelect);
  },

  /**
   * mysql query pagination
   * @param {String} sql 
   * @param {Array} params 
   * @param {Object} query 
   * @param {Object} db 
   */
  async mysqlQuery(sql, params, query, db) {
    if (!Array.isArray(params)) {
      db = query;
      query = params;
      params = [];
    }
    //查询记录数
    const getCount = queryParams => {
      sqlHandler = new SqlHandler(sql);
      const newSql = sqlHandler
        .setCount()
        .setQueryParams(queryParams)
        .getSql()
      return db.query(newSql, params)
    }

    //查询分页记录
    const getSelect = ({ queryParams, sorter, pageSize, start }) => {
      sqlHandler = new SqlHandler(sql);
      const newSql = sqlHandler
        .setQueryParams(queryParams)
        .setSortParams(sorter)
        .setLimitParams(start, pageSize)
        .getSql()
      return db.query(newSql, params);
    }
    return await _pagination(query, getCount, getSelect);
  },
}

/**
 * 
 * @param {Object} query 
 * @param {Promise} getCount 
 * @param {Promise} getSelect 
 */
const _pagination = async (query, getCount, getSelect) => {
  let pagination = { current: 1, pageSize: 10 };
  let queryParams = {}
  let sorter = [];
  let sorterField;
  let order;

  for (let key in query) {
    if (key === 'current' || key === 'pageSize') {
      pagination[key] = +query[key];
    } else if (key === 'order' || key === 'sorter') {
      if (key === 'sorter') sorterField = query[key];
      if (key === 'order') order = query[key]
    } else {
      if (!query[key]) continue;
      queryParams[key] = query[key];
    }
  }

  if (sorterField && order) sorter = [sorterField, order];

  const current = pagination.current;
  const pageSize = pagination.pageSize;
  const start = (current - 1) * pageSize;
  let result = {
    pagination
  };
  const [count, records] = await Promise.all([
    getCount(queryParams),
    getSelect({
      queryParams,
      sorter,
      pageSize,
      start
    })
  ])
  result.pagination.total = Array.isArray(count) ? 
    count.reduce((pre, cur) => ({ count: pre.count + cur.count }), { count: 0 }).count
    : count
  result.records = records;
  return result;
}
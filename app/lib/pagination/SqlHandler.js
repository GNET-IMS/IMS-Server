module.exports = class SqlHandler {
	constructor(sql) {
		this.sql = sql;
	}

	setCount() {
		const sql = this.sql;
		this.sql = `select count(1) count ${sql.substring(sql.indexOf('from'))} `;
		return this;
	}

	setQueryParams(queryParams) {
		const sql = this.sql;
		let preSql = this.sql;
		let extSql = '';
		if (preSql.indexOf('group by') != -1) {
			preSql = sql.substring(0, sql.indexOf('group by'));
			extSql = sql.substring(sql.indexOf('group by'));
		}
		if (preSql.indexOf('where') == -1) {
			preSql += ' where 1 = 1 ';
		}
		for (let key in queryParams) {
			preSql += `and ${key} = ${queryParams[key]} `;
		}
		this.sql = `${preSql} ${extSql} `;
		return this;
	}

	setSortParams(sorter) {
		const sql = this.sql;
		if (sorter.length == 2) {
			this.sql = sql + `order by ${sorter[0]} ${sorter[1]} `;
		}
		return this;
	}

	setLimitParams(start, pageSize) {
		const sql = this.sql;
		this.sql = sql + `limit ${start}, ${pageSize}`;
		return this;
	}

	getSql() {
		return this.sql;
	}
}
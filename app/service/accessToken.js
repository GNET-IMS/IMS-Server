'use strict';

const jwt = require('jsonwebtoken');

module.exports = app => {
	class AccessToken extends app.Service {
		async create(token, expiration, userId, clientId, scope) {
			const id = jwt.decode(token).jti;
			accessToken = new this.ctx.model.accessToken({
				value: id,
				userId,
				clientId,
				scope,
				expiration,
			})
			const result = await accessToken.save();
			return result;
		}
		async find(token) {
			const id = jwt.decode(token).jti;
			const accessToken = await this.ctx.model.accessToken.findOne({ value: id });
			return accessToken;
		}
		async findAll() {
			const users = await this.ctx.model.user.find({});
			return users;
		}
		async remove(token) {
			const id = jwt.decode(token).jti;
			const doc = await this.ctx.model.accessToken.remove({ value: id });
			if (doc.result.ok) return true
		}
	}
	return AccessToken;
};
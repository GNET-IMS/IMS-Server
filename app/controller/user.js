const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');

// 定义创建接口的请求参数规则
const createRule = {
	username: 'string',
	sex: { type: 'number', required: false },
	email: { type: 'string', required: false },
	name: 'string',
	birthday: { type: 'string', required: false },
	department: 'string',
	title: { type: 'string', required: false },
	avatar_url: { type: 'string', required: false },
	is_admin: { type: 'boolean', required: false },
}

module.exports = app => {
	class UserController extends app.Controller {
		async index() {
			const { ctx, service } = this;
			const result = await service.user.search(ctx.query);
			ctx.body = {
				pagination: result.pagination,
				users: result.records
			};
			ctx.status = 201;
		}
		async show() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const user = await service.user.findById(id);
			ctx.body = {
				user
			};
			ctx.status = 200;
		}
		async create() {
			const { ctx, service } = this;
			const data = ctx.request.body;
			const target = data.target;
			if (Array.isArray(target)) {
				await this.batchCreate();
				return false;
			} else {
				// 校验参数
				ctx.validate(Object.assign(createRule, {
					password: { type: 'string' },
				}), target);
				const user = await service.user.create(target);
				service.user.createGitlabAndZentao(user, data.creator);
				ctx.body = {
					user
				};
				ctx.status = 201;
			}
		}
		async batchCreate() {
			const { ctx, service } = this;
			const data = ctx.request.body;
			const target = data.target;
			target.forEach(item => {
				ctx.validate({
					name: 'string',
					username: 'string',
					password: 'string',
					department: 'string',
				}, item)
			})
			const result = await service.user.batchCreate(target);
			ctx.body = {
				result
			}
			ctx.status = 201;
		}
		async update() {
			const { ctx, service } = this;
			let rule = createRule;
			if (ctx.request.body.password) {
				rule = Object.assign(createRule, {
					password: { type: 'string' },
				})
			}
			ctx.validate(rule);
			let user = ctx.request.body;
			user.id = ctx.params.id;
			const id = await service.user.update(ctx.request.body);
			ctx.body = {
				id
			};
			ctx.status = 200;
		}
		async destroy() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const result = await service.user.deleteById(id);
			ctx.body = {
				result
			};
			ctx.status = 200;
		}
		async uploadPhoto() {
			const { ctx, service } = this;
			const stream = await ctx.getFileStream();
			const filename = ctx.helper.changeFilename(stream.filename);
			const name = path.resolve(`app/public/images/${filename}`);
			try {
				const writerStream = fs.createWriteStream(name);
				stream.pipe(writerStream);
			} catch (err) {
				await sendToWormhole(stream);
				throw err;
			}
			const user = await service.user.update({
				id: ctx.params.id,
				avatar_url: `/public/images/${filename}`
			})

			ctx.body = {
				user
			};
			ctx.status = 200;
		}
		async getByToken() {
			const { ctx, service } = this;
			const access_token = ctx.access_token;
			const resp = await ctx.curl(`http://localhost:3000/api/user`, {
				headers: {
					Authorization: `bearer ${access_token}`
				},
				dataType: 'json'
			})
			if (resp.status === 200) {
				ctx.body = {
					user: resp.data.user
				};
			}
			ctx.status = resp.status;
		}
		async getUnreadMessageNum() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const unreadNum = await service.notice.getUnreadNum(id);
			ctx.body = {
				unreadNum
			};
			ctx.status = 200;
		}
		async pullAnnouncements() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const result = await service.user.pullAnnouncements(id);
			ctx.body = {
				pull_num: result
			};
			ctx.status = 200;
		}
		async getAnnouncements() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const result = await service.user.getAnnouncements(id);
			ctx.body = {
				pagination: result.pagination,
				announcements: result.records
			}
			ctx.status = 200;
		}
	}
	return UserController;
}

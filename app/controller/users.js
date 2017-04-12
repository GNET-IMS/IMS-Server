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
	class UsersController extends app.Controller {
		async index() {
			const { ctx, service } = this;
			const result = await service.user.search(ctx.query);
			ctx.body = {
				pagination: result.pagination,
				users: result.results
			};
			ctx.status = 201;
		}
		async show() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const user = await service.user.find(id);
			ctx.body = {
				user
			};
			ctx.status = 200;
		}
		async create() {
			const { ctx, service } = this;
			// 校验参数
			ctx.validate(Object.assign(createRule, {
				password: { type: 'string' },
			}));
			const user = await service.user.create(ctx.request.body);
			const gitlab = await service.gitlab.create(user);
			const zentao = await service.zentao.create(user);
			ctx.body = {
				user
			};
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
			user._id = ctx.params.id;
			const id = await service.user.update(ctx.request.body);
			ctx.body = {
				id
			};
			ctx.status = 200;
		}
		async destroy() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			await service.user.remove(id);
			ctx.status = 200;
		}
		async uploadPhoto() {
			const { ctx, service } = this;
			const url = await ctx.helper.uploadImage(ctx.req, {
				uploadDir: './public/images/photo/',
			});
			const avatar_url = url.split('./public')[1];
			console.log(url, '123')
			const id = await service.update({_id: ctx.params.id, avatar_url})
			console.log(id);
			ctx.body = {
				id
			};
			ctx.status = 200;
		}
	}
	return UsersController;
}
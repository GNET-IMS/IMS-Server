module.exports = app => {
	class MessagesController extends app.Controller {
		async index() {
			const { ctx, service } = this;
			const result = await service.message.search(ctx.query);
			ctx.body = {
				pagination: result.pagination,
				messages: result.results
			};
			ctx.status = 201;
		}
		async show() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const message = await service.message.find(id);
			ctx.body = {
				message
			};
			ctx.status = 200;
		}
		async destroy() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const result = await service.message.remove(id);
			ctx.body = {
				result
			};
			ctx.status = 200;
		}
		async read() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const message = await service.message.read(id);
			ctx.body = {
				message
			};
			ctx.status = 200;
		}
	}
	return MessagesController;
}
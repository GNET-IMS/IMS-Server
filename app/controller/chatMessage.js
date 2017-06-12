module.exports = app => {
	class ChatMessageController extends app.Controller {
		async index() {
			const { ctx, service } = this;
			const result = await service.chatMessage.search(ctx.query);
			ctx.body = {
				pagination: result.pagination,
				chat_messages: result.records
			};
			ctx.status = 201;
		}
        async create() {
            const { ctx, service } = this;
            const chatMessage = await service.chatMessage.create(ctx.request.body);
            ctx.body = {
                chat_message: chat_message
            }
            ctx.status = 201;
        }
		async show() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const chatMessage = await service.chatMessage.find(id);
			ctx.body = {
				chat_message
			};
			ctx.status = 200;
		}
		async destroy() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const result = await service.chatMessage.remove(id);
			ctx.body = {
				result
			};
			ctx.status = 200;
		}
		async read() {
			
		}
	}
	return ChatMessageController;
}
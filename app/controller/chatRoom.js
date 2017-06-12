module.exports = app => {
	class ChatRoomController extends app.Controller {
		async index() {
			const { ctx, service } = this;
			const result = await service.chatRoom.search(ctx.query);
			ctx.body = {
				pagination: result.pagination,
				chat_rooms: result.records
			};
			ctx.status = 201;
		}
        async create() {
            const { ctx, service } = this;
            const chatRoom = await service.chatRoom.create(ctx.request.body);
            ctx.body = {
                chat_room: chatRoom
            }
            ctx.status = 200;
        }
		async show() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const chatRoom = await service.chatRoom.find(id);
			ctx.body = {
				chat_room: chatRoom
			};
			ctx.status = 200;
		}
		async destroy() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const result = await service.chatRoom.remove(id);
			ctx.body = {
				result
			};
			ctx.status = 200;
		}
	}
	return ChatRoomController;
}
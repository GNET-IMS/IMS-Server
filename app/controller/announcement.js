const createRule = {
	content:  { type: 'string', required: true },
	sender_id: { type: 'number', required: true },
}

module.exports = app => {
	class AnnouncementsController extends app.Controller {
		async index() {
			const { ctx, service } = this;
			const result = await service.announcement.search(ctx.query);
			ctx.body = {
				pagination: result.pagination,
				announcements: result.records
			};
			ctx.status = 201;
		}
		async show() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const announcement = await service.announcement.find(id);
			ctx.body = {
				announcement
			};
			ctx.status = 200;
		}
		async destroy() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const result = await service.announcement.remove(id);
			ctx.body = {
				result
			};
			ctx.status = 200;
		}
		async update() {
			const { ctx, service } = this;
			const { id } = ctx.params;
			const result = await service.announcement.update(id);
			ctx.body = {
				result
			};
			ctx.status = 200;
		}
		async create() {
			const { ctx, service } = this;
			ctx.validate(createRule);
			console.log(ctx.request.body)
			const announcement = await service.announcement.create(ctx.request.body);
			ctx.announcement({
				message: '有新的公告'
			}, announcement.sender_id, announcement.receiver_ids);
			ctx.body = {
				announcement
			};
			ctx.status = 200;
		}
	}
	return AnnouncementsController;
}
module.exports = app => {
    const table = 'sys_announcement';
    class AnnouncementService extends app.Service {
        async create(content, senderId, receiverIds) {
            const date = this.ctx.helper.currentTime;
            const target = {
                content,
                receiver_ids: `,${receiverIds.join(',')},`,
                sender_id: senderId,
                create_date: date,
                modify_date: date
            };
            const result = await app.mysql.insert(table, target);
            return Object.assign(target, {
                id: result.insertId
            });
        }

        async search() {
            const result = await this.ctx.helper.pagination(table, app.mysql)
            return result;
        }

        async find(id) {
            const result = await app.mysql.get(table, { id });
            return result;
        }

        async update(target) {
            const result = await app.mysql.update(table, target);
            return result.effectedRows === 1;
        }
    }
    return AnnouncementService;
}
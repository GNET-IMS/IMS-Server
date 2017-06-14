module.exports = app => {
    const table = 'sys_announcement';
    class AnnouncementService extends app.Service {
        async create(target) {
            const date = this.ctx.helper.currentTime;
            const announcement = {
                content: target.content,
                receiver_ids: target.receiver_ids ? `,${target.receiver_ids.join(',')},` : null,
                sender_id: target.sender_id,
                create_date: date,
                modify_date: date
            };
            const result = await app.mysql.insert(table, announcement);
            return Object.assign(announcement, {
                id: result.insertId,
                receive_ids: target.receiver_ids
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

        async remove(id) {
            const result = await app.mysql.delete(table, { id });
            return result.affectedRows === 1;
        }
    }
    return AnnouncementService;
}
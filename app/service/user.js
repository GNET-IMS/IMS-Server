module.exports = app => {
  const table = 'sys_user';
  class User extends app.Service {
    async create(target) {
      const date = this.ctx.helper.currentTime;
      target.password = this.ctx.helper.hashEncodeSync(target.password);
      const result = await app.mysql.insert(table, Object.assign({
        is_admin: false,
        avatar_url: '/images/chh1.jpg',
        create_date: date,
        modify_date: date,
      }, target))
      return result;
    }
    async batchCreate(targets) {
      const { ctx } = this;
      const { helper } = ctx;
      const date = helper.currentTime;
      const result = await app.mysql.insert(table, targets.map(item => Object.assign({
        is_admin: false,
        password: helper.hashEncodeSync(item.password),
        create_date: date,
        modify_date: data,
      }, item)));
      return result;
    }
    async findById(id) {
      return await app.mysql.get(table, { id });
    }
    async deleteById(id) {
      const result = await app.mysql.delete(table, { id });
      return result.affectedRows === 1;
    }
    async update(target) {
      const result = await app.mysql.update(table, target);
      return result.affectedRows === 1;
    }
    async search(query) {
      return await this.ctx.helper.pagination(table, query, app.mysql);
    }
    async createGitlabAndZentao(user, to) {
      const { ctx } = this;
      const { service } = ctx;
      const [gitlab, zentao] = await Promise.all([
        service.gitlab.create(user, to),
        service.zentao.create(user, to)
      ])
      ctx.message({
        type: gitlab.type === 'success' && zentao.type === 'success' ? 'success' : 'error',
        title: `${gitlab} ${zentao}`,
        descrition: `[gitlab] ${gitlab.descrition}
                     [zentao] ${zentao, descrition}`
      })
    }
    async removeAnnouncement(user_id, announcement_id) {
      const result = await app.mysql.update('sys_user_announcement', { is_deleted: true }, {
        where: { user_id, announcement_id },
        columns: ['is_deleted']
      })
      return result.effectedRows === 1;
    }
    async getAnnouncements(id, query) {
      const result = await this.ctx.helper.paginationQuery(`
        select announcement.id, announcement.create_date, is_read, content,
        sender_id, sender.name sender_name, sender.avatar_url sender_avatar
        from sys_user_announcement user_announcement
        left join sys_announcement announcement on user_announcement.announcement_id = announcement.id
        left join sys_user sender on announcement.sender_id = sender.id
        where user_announcement.user_id = ? and is_deleted = false
      `, [id], query, app.mysql)
      return result;
    }
    async pullAnnouncements(id) {
      const currentTime = this.ctx.helper.currentTime;
      const date = await this._getLatestAnnouncementDate(id);
      const announcements = await this._getNewAnnouncements(date, id);
      if (!announcements || announcements.length < 1) return 0;
      const result = await app.mysql.insert('sys_user_announcement', announcements.map(item => {
        return {
          create_date: currentTime,
          modify_date: currentTime,
          user_id: id,
          announcement_id: item.id,
          is_read: false,
          is_deleted: false,
        }
      }))
      return result.affectedRows;
    }
    async _getLatestAnnouncementDate(id) {
      const result = await app.mysql.query(`
                select max(user_announcement.create_date) date from sys_user_announcement user_announcement
                left join sys_announcement announcement on user_announcement.announcement_id = announcement.id
                where user_announcement.user_id = ?
            `, [id]);
      return result.length > 0 ? result[0].date : null;
    }
    async _getNewAnnouncements(date, id) {
      let result;
      if (date) {
        result = await app.mysql.query(`
                    select id, create_date from sys_announcement
                    where create_date > ? and (receiver_ids like '%,${id},%' or receiver_ids is null or receiver_ids = '0')
                `, [date]);
      } else {
        result = await app.mysql.query(`
                    select id, create_date from sys_announcement 
                    where receiver_ids like '%,${id},%' or receiver_ids is null or receiver_ids = '0'
                `)
      }
      return result;
    }
  }
  return User;
};

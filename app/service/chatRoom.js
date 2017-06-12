module.exports = app => {
  const table = 'sys_chat_room';
  class ChatRoom extends app.Service {
    async create(target) {
      target.member_ids = target.member_ids.sort((a, b) => a - b);
      let chatRoom;
      chatRoom = await this.findByMemberIds(target.member_ids);
      if (chatRoom) {
        return chatRoom;
      }
      const date = this.ctx.helper.currentTime;
      chatRoom = Object.assign({
        create_date: date,
        modify_date: date
      }, target);
      const result = await app.mysql.insert(table, chatRoom);
      return Object.assign({
        id: result.insertId,
      }, chatRoom)
    }
    async update(target) {
      const result = await app.mysql.update(table, target);
      return result.affectedRows === 1;
    }
    async remove(id) {
      const result = await app.mysql.delete(table, { id });
      return result.affectedRows === 1;
    }
    async findByMemberIds(memberIds) {
      const chatRoom = await app.mysql.get(table, {
        member_ids: memberIds
      });
      return chatRoom;
    }
    async search(query) {
      return await this.ctx.helper.paginationQuery(`
        select rooms.*, content newest_content, sender_id from
        (select room.id, first_member_id, second_member_id, max(message.create_date) newest_date,
        first_member.name first_member_name, first_member.avatar_url first_member_avatar,
        second_member.name second_member_name, second_member.avatar_url second_member_avatar, count(is_read) unread_num
        from sys_chat_room room 
        left join sys_chat_message message on room.id = message.chat_room_id
        left join sys_user first_member on room.first_member_id = first_member.id
        left join sys_user second_member on room.second_member_id = second_member.id
        where is_read = 0
        group by room.id) rooms 
        left join sys_chat_message newest_message on newest_date = newest_message.create_date
      `, Object.assign( query, {
        sorter: 'newest_date',
        order: 'desc'
      }), app.mysql);
    }
  }
  return ChatRoom;
};
const url = 'http://10.32.49.121/api/v3';
const private_token = 'cooHFnypxf57Bpqhm5XJ';

const options = {
    headers: {
        'PRIVATE-TOKEN': private_token
    },
    dataType: 'json'
}

module.exports = app => {
    class Gitlab extends app.Service {
        async create(user, creator) {
            let message;
            try {
                const resp = await this.ctx.curl(`${url}/users`, Object.assign({
                    method: 'POST',
                    data: user
                }, options))
                if (resp.status !== 200) {
                    message = {
                        type: 'error',
                        title: 'gitlab',
                        content: 'gitlab账号添加失败',
                        to: creator
                    }
                }
            } catch (e) {
                message = {
                    type: 'error',
                    title: 'gitlab',
                    content: 'gitlab账号添加失败, gitlab请求超时',
                    to: creator
                }
            }

            if (!message) {
                message = {
                    type: 'success',
                    title: 'gitlab',
                    content: `用户：${user.username}的gitlab账号创建成功， 默认账号为当前账号，密码为：123456`,
                    to: creator
                }
            }
            await this.service.notice.createReminder(message.content, message.to);
            return message;
        }
        index() {
            this.ctx.curl(`${url}/users`, Object.assign({
                method: 'GET'
            }, options))
            return result;
        }
    }
    return Gitlab;
}

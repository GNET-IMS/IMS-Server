const url = 'http://115.29.166.64/zentao';
let session = '';

module.exports = app => {
    class Zentao extends app.Service {
        async getSession() {
            const result = await app.curl(url + '/api-getsessionid.json', {
                dataType: 'json'
            })
            const data = result.data.data;
            const json = JSON.parse(data);
            session = `${json.sessionName}=${json.sessionID}`;
            return session;
        }
        async login() {
            const result = await app.curl(`${url}/user-login.json`, {
                method: 'POST',
                data: {
                    account: 'admin',
                    password: '123456'
                },
                headers: {
                    'Cookie': session
                },
                dataType: 'json'
            })
            const data = result.data;
            if (data.status !== 'success') {
                throw new Error(`[zentao error] ${data.reason}`);
            }
            return data.user;
        }
        async init() {
            const session = await this.getSession();
            const user = await this.login();
        }
        async create(user) {
            await this.init();
            const result = await app.curl(`${url}/user-create-1.json`, {
                method: 'POST',
                data: {
                    dept: 1,
                    gender: user.sex === '0' ? 'm' : 'f',
                    account: user.username,
                    realname: user.name,
                    password1: 123456,
                    password2: 123456,
                    verifyPassword: 123456,
                },
                headers: {
                    'Cookie': session
                },
                dataType: 'string'
            })
            const dataStr = result.data.toString();
            console.log(dataStr)
            if (dataStr.indexOf('parent.location=') >= 0) {
                return true;
            } else if (dataStr.indexOf('self.location=') >= 0) {
                throw new Error('[zentao error] session验证失败');
            } else {
                const errorMessage = dataStr.split('alert(\'')[1].split('\\n\')')[0];
                throw new Error(errorMessage);
            }
        }
    }
    return Zentao;
}
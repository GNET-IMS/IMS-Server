module.exports = app => {
    return function* () {
        const message = this.args[0];
        const { service } = this;
        yield this.service.socket.createOrUpdate({
            socket_id: this.socket.id,
            user_id: message
        })
    };
};
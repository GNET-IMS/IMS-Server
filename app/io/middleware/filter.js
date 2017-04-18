module.exports = app => {
    return function* (next) {
        this.socket.emit('res', {
            type: 'success',
            message: '成功',
            description: '返回数据成功',
        });
        yield* next;
    };
};
module.exports = app => {
    return function* (next) {
        yield* next;
        yield this.service.socket.removeBySocketId(this.socket.id);
        console.log('disconnection!');
    };
};
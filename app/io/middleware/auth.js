module.exports = app => {
    return function* (next) {
        yield* next;
        // execute when disconnect.
        console.log('disconnection!');
    };
};
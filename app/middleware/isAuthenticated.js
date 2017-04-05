module.exports = options => {
    return async (next) => {
        await next();
    }
}
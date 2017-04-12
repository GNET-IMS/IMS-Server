module.exports = () => {
    return function (ctx) {
        const { app } = ctx;
        return app.passport.authenticate('bearer', {
            successRedirect: ctx.url
        });
    };
};
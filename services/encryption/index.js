var bcrypt = require('bcrypt-nodejs');

exports.passwordEncode = function (password, callback) {
    bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);
        bcrypt.hash(password, salt, null, function (err, hash) {
            if (err) return callback(err);
            callback(hash);
        });
    });
}


exports.passwordEncodeSync = function (password) {
    const salt = bcrypt.genSaltSync(5);
    return bcrypt.hashSync(password, salt);
}
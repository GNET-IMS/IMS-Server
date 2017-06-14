var bcrypt = require('bcrypt-nodejs');

module.exports = {
    hashEncode(password, rounds = 5) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(rounds, (err, salt) => {
                if (err) {
                    reject(err);
                    return false;
                }
                bcrypt.hash(password, salt, null, function (err, hash) {
                    if (err) {
                        reject(err);
                        return false;
                    }
                    resolve(hash);
                });
            });
        })
    },
    hashEncodeSync(password, rounds = 5) {
        const salt = bcrypt.genSaltSync(rounds);
        return bcrypt.hashSync(password, salt);
    },
    compare(data, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(data, hash, function (err, isMatch) {
                if (err) return reject(err);
                resolve(isMatch);
            });
        })
    },
    compareSync(data, hash) {
        return bcrypt.compareSync(data, hash);
    }
}
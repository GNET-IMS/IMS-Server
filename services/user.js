var { response, error } = require ('../response');
var gitlab = require ('../services/gitlab');
var zentao = require ('../services/zentao');
var User = require ('../models/user');

const save = (data, callback) => {
	var user = new User({
    username: data.username,
    password: data.password,
    sex: data.sex,
    email: data.email,
    name: data.name,
    birthday: data.birthday,
    department: data.department,
    title: data.title,
    avatar_url: data.avatar_url,
    is_admin: data.is_admin,
    created_at: moment().format('YYYY-MM-DD hh:mm:ss'),
  });

  user.save(callback);
}

const batchSave = (data, callback) => {
	let successFlag = 0;
	let failFlag = 0;
	for (let item of data) {
		save(item, (err) => {
			if (!err) {
				successFlag ++;
			} else {
				failFlag ++;
			}
			if (successFlag + failFlag == data.length) callback(successFlag == data.length);
		});
	}
}

exports = {
	save,
	batchSave
}
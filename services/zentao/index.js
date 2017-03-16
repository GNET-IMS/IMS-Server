//var request = require('../../request');
var request = require('superagent');

var url = 'http://115.29.166.64/zentao';
var session = {};

//  GET/POST  /zentao/user-create-[deptID].json create Create a suer.
//  GET/POST  /zentao/user-batchCreate-[deptID].json Batch create users.
//  parames   deptID	int
// request.post(url, {
//     deptID: ''
// }, function(data) {

// }, function(error) {
// }, {

// })


var getSession = function(callback) {
    request
	.get(url + '/api-getsessionid.json')
	.end(function (err, res) {
		if (res.ok) {
            var json = JSON.parse(res.text);
            json.data = JSON.parse(json.data)
            if (json.status === 'success') {
                callback(json.data);
            }
		} else {
			console.log(res.text);
		}
	});
}

var login = function(session, callback) {
    request
	.post(`${url}/user-login.json`)
    .set("Cookie", session.sessionName + '=' + session.sessionID)
    .set("Content-type", "application/x-www-form-urlencoded")
    .send({
        account: 'admin',
        password: '123456'
    })
	.end(function (err, res) {
		if (res.ok) {
            var json = JSON.parse(res.text);
            if (json.status === 'success') {
                callback(json.user);
            } else {
                callback(json.result);
            }
		} else {
			console.log(res.text);
		}
	});
}

var init = function (callback) {
    getSession(function(result) {
        session = result;
        login(session, function(data) {
            callback()
        })
    });
}

exports.createUser = function(params, callback) {
    init(function() {
        request
        .post(url + '/user-create-1.json')
        .set("Cookie", session.sessionName + '=' + session.sessionID)
        .set("Content-type", "application/x-www-form-urlencoded")
        .send(params)
        .end(function (err, res) {
            if (res.ok) {
                if (res.text.indexOf('parent.location=') >= 0) {
                    callback("创建成功");
                } else {
                    var errorMessage = res.text.split('alert(\'')[1].split('\\n\')')[0];
                    callback({}, errorMessage)
                    return false;
                }
            } else {
                console.log(res.text);
            }
        });
    });
}
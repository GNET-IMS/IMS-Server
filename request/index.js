var request = require('superagent');
var queryString = require('queryString');

var get = function (url, data, success, fail, headers, method = "get") {
	var methodName = method.toLowerCase();
	request
	[methodName === 'delete' ? 'del' : methodName](url)
	[methodName === 'get' ? 'query' : 'send'](data)
	.set((fail && 'object' === typeof fail) ? fail : headers)
	.end(function (err, res) {
		if (res.ok) {
			success(JSON.stringify(res.body));
		} else {
			if (fail && 'function' === typeof fail) fail(res.text)
		}
	});
}

var post = function(url, data, success, fail, headers) {
	return get(url, data, success, fail, headers, "post");
}

var put = function(url, data, success, fail, headers) {
	return get(url, data, success, fail, headers, "put");
}

var patch = function(url, data, success, fail, headers) {
	return get(url, data, success, fail, headers, "patch");
}

var del = function(url, data, success, fail, headers) {
	return get(url, data, success, fail, headers, "delete");
}


exports = {
	get,
	post,
	del,
	put,
	patch
}


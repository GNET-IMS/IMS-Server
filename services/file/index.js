var formidable = require('formidable');
var fs = require('fs');

	exports.uploadImage = function (req, option, success, fail) {
		var form = new formidable.IncomingForm();   //创建上传表单
		form.encoding = option.encoding || 'utf-8';        //设置编辑
		form.uploadDir = option.uploadDir || './public/images/photo/';     //设置上传目录
		form.keepExtensions = option.keepExtensions || true;     //保留后缀
		form.maxFieldsSize = option.maxFieldsSize || 2 * 1024 * 1024;   //文件大小
		form.parse(req, function (err, fields, files) {
			var extName = '';  //后缀名
			switch (files.avatar.type) {
				case 'image/pjpeg':
					extName = 'jpg';
					break;
				case 'image/jpeg':
					extName = 'jpg';
					break;
				case 'image/png':
					extName = 'png';
					break;
				case 'image/x-png':
					extName = 'png';
					break;
				case 'image/gif':
					extName = 'gif';
					break;
				case 'image/bmp':
					extName = 'bmp';
					break;
			}

			if (!extName) {
				if (fail && 'function' === typeof fail) fail('图片格式错误');
			}

			var avatarName = Math.random() + '.' + extName;
			var newPath = form.uploadDir + avatarName;
			fs.renameSync(files.avatar.path, newPath);
			if (success && 'function' === typeof success) success(newPath);
		});

		form.on('progress', function(bytesReceived, bytesExpected) {

		}); 
	}
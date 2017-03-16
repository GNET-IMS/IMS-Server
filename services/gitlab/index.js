var gitlab = require('gitlab')({
  url   : 'http://10.32.49.121',
  token : 'cooHFnypxf57Bpqhm5XJ'
});


// Listing users
exports.getUsers = function(params, callback) {
  gitlab.users.all(params, function(users) {
    callback(users);
    for (var i = 0; i < users.length; i++) {
      console.log("#" + users[i].id + ": " + users[i].email + ", " + users[i].name + ", " + users[i].created_at);
    }
  });
}

/**
 * gitlab 创建用户
 * {
    email,
    password,
    reset_password,
    username,
    name,
    skype,
    linkedin,
    twitter,
    website_url,
    organization,
    projects_limit,
    extern_uid,
    provider,
    bi,
    location,
    admin,
    can_create_group,
    confirm,
    external,
  }
 */
exports.createUser = function(params, callback) {
  gitlab.users.create(params, function(result) {
    callback(result);
  });
}

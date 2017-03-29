import userController from './controllers/user';

// 'POST /api/accounts'  添加一个账号
// 'GET /api/accounts/:id' 根据id获得某个账号
// 'PATCH /api/accounts/:id' 根据id修改某个账号
// 'DELETE /api/accounts/:id' 根据id删除某个账号
module.exports = function(router, authController) {

  // router.route('/accounts')
  //   .get(authController.isAppAuthenticated, accountController.getAccounts)
  //   .post(authController.isAppAuthenticated, accountController.postAccounts);

  // router.route('/account/:id')
  //   .get(authController.isAppAuthenticated, accountController.getAccount)
  //   .patch(authController.isAppAuthenticated, accountController.updateAccount)
  //   .delete(authController.isAppAuthenticated, accountController.deleteAccount);

  router.route('/users/:_id')
    .get(authController.isBearerAuthenticated, userController.getUser)
    .put(authController.isBearerAuthenticated, userController.updateUser)
    ['delete'](authController.isBearerAuthenticated, userController.deleteUser);

  router.route('/users/:_id/upload')
    .post(authController.isBearerAuthenticated, userController.uploadPhoto)
}

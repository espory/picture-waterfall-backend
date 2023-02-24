'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 用户路由
  router.get('/pic/user/index', controller.picture.index);
  router.post('/pic/user/upload', controller.picture.upload);
  router.post('/pic/user/create', controller.picture.create);

  // 管理端路由
  router.get('/pic/admin/index', controller.picture.index);
  router.get('/pic/admin/getItemTotal', controller.picture.getItemTotal);
  router.post('/pic/admin/del', controller.picture.del);
  router.post('/pic/admin/update', controller.picture.update);
};

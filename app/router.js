'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // get
  router.get('/', controller.home.index);
  router.get('/pic/get', controller.picture.get);
  router.get('/pic/getItemTotal', controller.picture.getItemTotal);
  // post
  router.post('/pic/upload', controller.picture.upload);
  router.post('/pic/create', controller.picture.create);
  router.post('/pic/del', controller.picture.del);
  router.resources('users', '/users', controller.users);
};

'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/pic/upload', controller.picture.upload);
  router.post('/pic/create', controller.picture.create);
  router.resources('users', '/users', controller.users);
};

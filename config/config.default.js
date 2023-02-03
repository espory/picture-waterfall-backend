/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {

    sequelize: {
      dialect: 'mysql',
      host: '101.43.119.45',
      username: 'root',
      password: 'curidemo',
      port: 3306,
      database: 'picture-waterfall',
    },
    multipart: {
      mode: 'file',
      // 表单 Field 文件名长度限制
      fieldNameSize: 100,
      // 表单 Field 内容大小
      fieldSize: '100kb',
      // 表单 Field 最大个数
      fields: 10,
      // 单个文件大小
      fileSize: '50mb',
      // 允许上传的最大文件数
      files: 20,
      cleanSchedule: {
        // run tmpdir clean job on every day 04:30 am
        // cron style see https://github.com/eggjs/egg-schedule#cron-style-scheduling
        cron: '0 30 4 * * *',
        disable: false,
      },
    },
    static: {
      prefix: '/',
      dir: path.join(appInfo.HOME, 'picture-waterfall-files'),
      dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
      preload: false,
      maxAge: 31536000, // in prod env, 0 in other envs
      // 修改为false
      buffer: false, // in prod env, false in other envs
      gzip: true,
      usePrecompiledGzip: true,
    },
    security: {
      csrf: {
        enable: false,
      },
      domainWhiteList: [ '*' ],
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: true,
    },
    WATERFALL_PATH: path.join(appInfo.HOME, 'picture-waterfall-files'),
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1675006134804_6839';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

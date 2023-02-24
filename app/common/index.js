'use strict';

// 目前仅用到这两种返回结果，后续可以进行补充
module.exports = {
  /**
   * @description
   * @param {*} { data, status }
   */
  success({ ctx, data, status, ...rest }) {
    ctx.body = {
      code: '0',
      message: 'success',
      data: data || null,
      ...rest,
    };
    ctx.status = status || 200;
  },

  /**
   * @description
   * @param {*} { status, message, data }
   */
  failure({ ctx, status, message, data, ...rest }) {
    ctx.body = {
      code: '-1',
      message: message || 'no message',
      data: data || null,
      ...rest,
    };
    ctx.status = status || 200;
  },
};

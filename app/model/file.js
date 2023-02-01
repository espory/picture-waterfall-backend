'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const File = app.model.define('file', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(150),
    path: STRING(200),
    title: STRING(150),
    type: STRING(150),
    intro: STRING(150),
    other: STRING(150),
    status: STRING(150),
    created_at: DATE,
    updated_at: DATE,
  });
  return File;
};

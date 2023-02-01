'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('files', {
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
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('files');
  },
};

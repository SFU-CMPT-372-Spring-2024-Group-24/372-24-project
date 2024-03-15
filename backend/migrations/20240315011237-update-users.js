'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      defaultValue: Sequelize.literal('gen_random_uuid()')
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'username');
  }
};

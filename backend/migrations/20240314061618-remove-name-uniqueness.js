'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Users', 'Users_name_key76');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Users', {
      fields: ['name'],
      type: 'unique',
      name: 'Users_name_key76'
    });
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i = 1; i <= 82; i++) {
      try {
        await queryInterface.removeConstraint('Users', `Users_name_key${i}`);
      } catch (error) {
        console.log(`Failed to remove constraint Users_name_key${i}: ${error.message}`);
      }
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const constraints = await queryInterface.sequelize.query(`
      SELECT conname FROM pg_constraint 
      INNER JOIN pg_class ON conrelid=pg_class.oid 
      WHERE relname='Chats' AND contype='u';
    `);

    const constraintNames = constraints[0].map(constraint => constraint.conname);

    for (const constraintName of constraintNames) {
      try {
        await queryInterface.removeConstraint('Chats', constraintName);
      } catch (error) {
        console.log(`Failed to remove constraint ${constraintName}: ${error.message}`);
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

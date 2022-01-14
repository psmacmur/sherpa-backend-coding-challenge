'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn(
      'Events', // name of Target model
      'OrganizerId', // name of the key we're adding 
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizers', // name of Source model
          key: 'id', // key in Source model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return queryInterface.removeColumn(
      'Events', // name of Source model
      'OrganizerId' // key we want to remove
    );
  }
};

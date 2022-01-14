'use strict';

const data = require('../data.json');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const organizers = {}; // map organizer names to the row structure
    data.map(event => organizers[event.organizer.name] = { 
      name: event.organizer.name, 
      createdAt: new Date(), 
      updatedAt: new Date() });
    const organizerInsertRows = [];
    for (const prop in organizers) {
      organizerInsertRows.push(organizers[prop]);
    }

    // console.log(eventRows);
    
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Organizers', organizerInsertRows, {})
      .then(x => queryInterface.sequelize.query(
        `SELECT id, name from Organizers;`
      )).then(organizerRows => {
        
        console.log(organizerRows);
        const eventRows = data.map(event => ({
          name: event.name,
          isOutside: event.isOutside,
          location: event.location,
          date: new Date(event.date),
          OrganizerId: organizerRows[0].find(row => row.name === event.organizer.name).id,
          createdAt: new Date(), 
          updatedAt: new Date()
        }));
        return queryInterface.bulkInsert('Events', eventRows, {});
      }).catch(err => console.log(err));
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Events', null, {});
    await queryInterface.bulkDelete('Organizers', null, {});
  }
};

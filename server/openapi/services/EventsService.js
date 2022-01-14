/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('../../../data/models');

/**
 * Map database rows to an Event API Schema
 * @param {Event} dbEvent Events table row
 * @param {*} dbOrganizer Organizers table row
 * @returns Event
 */
const constructApiEvent = (dbEvent, dbOrganizer, includeDetails = true) => ({
  id: dbEvent.id,
  name: dbEvent.name,
  date: dbEvent.date,
  isOutside: dbEvent.isOutside,
  attendees: includeDetails ? [] : undefined, // TODO!
  visaRequirements: includeDetails ? dbEvent.visaRequirements : undefined,
  proofOfVaccinationRequired: includeDetails ? dbEvent.proofOfVaccinationRequired : undefined,
  organizer: {
    id: dbOrganizer.id,
    name: dbOrganizer.name,
  },
});

/**
* Get an event by ID
*
* eventId Long Unique ID of the Event to retrieve
* returns EventDetails
* */
const getEvent = ({ eventId }) => new Promise(
  (resolve, reject) => {
    try {
      // call weather
      console.log(`getEvents(${eventId})`);
      db.Event.findAll({
        where: {
          id: eventId,
        },
      }).then((events) => {
        db.Organizer.findAll({
          where: {
            id: events[0].OrganizerId,
          },
        }).then((organizers) => resolve(Service.successResponse(constructApiEvent(events[0], organizers[0]))));
      });
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

/**
* Returns a list of upcoming events.
* Retrieve upcoming events. the endpoint accepts the following query parameters \"from\" - optional,
* Date, defaults to the current time, only return events after this date \"until\" - optional,
* Date, if omitted return all future events
*
* from Date optional, Date, defaults to the current time, only return events after this date (optional)
* until Date optional, Date, if omitted return all future events (optional)
* cursor Integer Specifies the first event to return (optional)
* limit Integer Limits the number of items on a page (optional)
* returns EventList
* */
const getEvents = ({
  from, until, cursor, limit,
}) => new Promise(
  (resolve, reject) => {
    try {
      // TODO: paginate
      console.log('getEvents');
      const dateFilter = {
        date: {
          [db.Sequelize.Op.gt]: from || Date(),
        },
      };
      if (until) {
        dateFilter.date[db.Sequelize.Op.lte] = until;
      }
      db.Event.findAll({
        where: dateFilter,
      }).then((events) => db.Organizer.findAll({
        where: {
          id: {
            [db.Sequelize.Op.or]: events.map((e) => e.OrganizerId),
          },
        },
      }).then((organizers) => resolve(Service.successResponse(events.map((event) => constructApiEvent(event,
        organizers.find((o) => o.id === event.OrganizerId), false)))))).catch((err) => {
        console.log(err);
        reject(err);
      });
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  getEvent,
  getEvents,
};

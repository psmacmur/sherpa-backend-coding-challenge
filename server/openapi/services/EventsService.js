/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const Service = require('./Service');
const db = require('../../../data/models');

/**
* Get an event by ID
*
* eventId Long Unique ID of the Event to retrieve
* returns EventDetails
* */
const getEvent = ({ eventId }) => new Promise(
  (resolve, reject) => {
    try {
      // TODO: pull organizer
      // call weather
      console.log(`getEvents(${eventId})`);
      db.Event.findAll({
        where: {
          id: eventId,
        },
      }).then((events) => resolve(Service.successResponse(events[0])));
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
      // TODO: pull organizers
      // paginate
      // call weather
      console.log('getEvents');
      db.Event.findAll().then((events) => resolve(Service.successResponse(events))).catch((err) => {
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

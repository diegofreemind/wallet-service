const { getAvailability, getOpenScheduler, createScheduler, updateScheduler, createEvent } = require('./ScheduleController');

module.exports = {
    createEvent,
    getOpenScheduler,
    updateScheduler,
    createScheduler,
    getAvailability
};
const scheduleModel = require('./ScheduleModel');
const { getAvailability, getScheduler, createScheduler } = require('./ScheduleController');

module.exports = {
    getScheduler,
    scheduleModel,
    createScheduler,
    getAvailability
};
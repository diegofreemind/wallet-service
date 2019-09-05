const faker = require("faker");
const moment = require('moment-timezone');
const { factory } = require("factory-girl");
const scheduleModel = require('../components/Scheduler/SchedulerModel');

faker.locale = "pt_BR";

factory.define('Schedule', scheduleModel, {
    week_events: [
        {
            customerId: faker.random.uuid(),
            status: "ontrack",
            customerName: faker.company.companyName(),
            date: "2019-09-01T17:30:00-03:00"
        },
        {
            customerId: faker.random.uuid(),
            status: "completed",
            customerName: faker.company.companyName(),
            date: "2019-09-01T11:30:00-03:00"
        },
        {
            customerId: faker.random.uuid(),
            status: "rescheduled",
            customerName: faker.company.companyName(),
            date: "2019-09-01T18:30:00-03:00"
        }, {
            customerId: faker.random.uuid(),
            status: "cancelled",
            customerName: faker.company.companyName(),
            date: "2019-09-01T13:30:00-03:00"
        }
    ],
    sellerId: faker.random.uuid(),
    wallet_status: "open"
});

function setTimezone(date) {

    return moment.tz(date, 'America/Recife');
}

module.exports = factory;
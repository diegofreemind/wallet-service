const faker = require("faker");
const { factory } = require("factory-girl");
const walletModel = require('../src/shared/models/Wallet');

faker.locale = "pt_BR";

factory.define('Wallet', walletModel, {
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

module.exports = factory;
const faker = require("faker");
const factory = require("../factories");
const { Document } = require('mongoose');
const moment = require('moment-timezone');

const {
    getEvent,
    createEvent,
    bulkEvents,
    getAvailability } = require('../../src/Event');


xdescribe('Should manage events in an opened scheduler', () => {


    it('Should add an event into scheduler when receiving a valid payload', async () => {

        const { week_events } = await factory.attrs('Wallet');
        const { sellerId } = await factory.create('Wallet',
            {
                week_events: []
            });

        const [event] = week_events;

        event.date = moment.tz('2019-09-01T14:15:00-03:00', 'America/Recife');

        await expect(createEvent(sellerId, event))
            .resolves
            .toBeInstanceOf(Document);

    });


    it('Should add events into scheduler when receiving a valid payload', async () => {

        const { sellerId } = await factory.create('Wallet', {
            week_events: []
        });

        const payload = await factory.attrs('Wallet', {
            sellerId,
            week_events: [
                {
                    customerId: faker.random.uuid(),
                    status: "ontrack",
                    customerName: faker.company.companyName(),
                    date: "2019-09-02T17:30:00-03:00"
                },
                {
                    customerId: faker.random.uuid(),
                    status: "completed",
                    customerName: faker.company.companyName(),
                    date: "2019-09-02T11:30:00-03:00"
                }
            ]
        });

        const { week_events } = await bulkEvents(payload)
        await expect(week_events)
            .toHaveLength(2);

    });


    it('Should find an event when receiving a valid Document id', async () => {

        const { week_events, sellerId } = await factory.create('Wallet');
        const [event] = week_events;

        const { id } = event;

        await expect(getEvent(sellerId, id))
            .resolves
            .toBeInstanceOf(Object);

    });


    it('Should return availability as true in scheduler when find a free slot', async () => {

        const { sellerId } = await factory.attrs('Wallet');
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        await expect(getAvailability(sellerId, date))
            .resolves
            .toMatchObject({
                busySlot: null,
                isAvailable: true
            });

    });


    it('Should return availability as false in scheduler when find a busy slot', async () => {

        const { sellerId } = await factory.create('Wallet');
        const date = moment.tz('2019-09-01T17:30:00-03:00', 'America/Recife');

        const { busySlot, isAvailable } = await getAvailability(sellerId, date);

        expect(busySlot).toBeInstanceOf(Document);
        expect(isAvailable).toBe(false);

    });
});
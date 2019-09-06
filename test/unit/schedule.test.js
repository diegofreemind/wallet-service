const faker = require("faker");
const factory = require("../factories");
const { Document } = require('mongoose');
const moment = require('moment-timezone');
const { checkIsNotNull } = require('../../src/shared/validators/entries');

const {
    getOpenScheduler,
    createScheduler,
    deleteScheduler,
    closeScheduler
} = require('../../src/Scheduler');

const {
    getEvent,
    createEvent,
    bulkEvents,
    getAvailability } = require('../../src/Event');

describe('Should create a new weekly scheduler', () => {

    it('Should return a new a weekly scheduler as Document', async () => {

        const weekly_scheduler = await factory.build('Wallet',
            {
                week_events: []
            });

        await expect(createScheduler(weekly_scheduler))
            .resolves
            .toBeInstanceOf(Document);
    });


    it('Should throw an error when sellerId is not passed to create a new weekly scheduler', async () => {

        const weekly_scheduler = await factory.build('Wallet',
            {
                sellerId: null
            });

        await expect(createScheduler(weekly_scheduler))
            .rejects
            .toThrow();
    });


    it('Should return an error when receiving a scheduler payload missing status', async () => {

        const weekly_scheduler = await factory.build('Wallet',
            {
                wallet_status: null
            });

        await expect(createScheduler(weekly_scheduler))
            .rejects
            .toThrow();
    });

});

describe('Should retrieve the weekly scheduler', () => {

    it('Should find an opened scheduler when receiving a valid seller id', async () => {

        const weekly_scheduler = await factory.build('Wallet');
        await createScheduler(weekly_scheduler);

        const { sellerId } = weekly_scheduler;

        await expect(getOpenScheduler(sellerId))
            .resolves
            .toBeInstanceOf(Document);

    });

    it('Should not find any opened scheduler as the current scheduler status is closed', async () => {

        const weekly_scheduler = await factory.build('Wallet',
            {
                wallet_status: 'closed'
            });

        await expect(createScheduler(weekly_scheduler))
            .resolves
            .toBeInstanceOf(Document);

        const { sellerId } = weekly_scheduler;

        await expect(getOpenScheduler(sellerId))
            .resolves
            .toBe(null);

    });

});

describe('Should update the weekly scheduler', () => {

    beforeEach(async () => {

        await factory.create('Wallet');

    });

    it('Should set the scheduler status from `open` to `closed`', async () => {

        const { sellerId } = await factory.attrs('Wallet');

        const { wallet_status } = await closeScheduler(sellerId);
        expect(wallet_status).toBe('closed');
    });

    it('Should throw an error when seller id is null to set scheduler status from `open` to `closed`', async () => {

        const { sellerId } = await factory.attrs('Wallet', { sellerId: null });

        await expect(closeScheduler(sellerId))
            .rejects
            .toThrow();
    });

});

describe('Should delete a scheduler', () => {

    it('Should remove the scheduler when receiving a valid Document id', async () => {

        const payload = await factory.build('Wallet');
        const scheduler = await createScheduler(payload);

        const { _id } = scheduler;

        await expect(deleteScheduler(_id))
            .resolves
            .toBeInstanceOf(Document);
    });

    it('Should throw an error when seller id is null to set scheduler status from `open` to `closed`', async () => {

        const { sellerId } = await factory.attrs('Wallet', { sellerId: null });

        await expect(closeScheduler(sellerId))
            .rejects
            .toThrow();
    });

});

describe('Should manage events in an opened scheduler', () => {


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

describe('Should validate the entries format for scheduler', () => {

    it('Should validate if arguments are not null', async () => {

        const { sellerId } = await factory.create('Wallet');
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        expect(checkIsNotNull).toBeInstanceOf(Function);
        expect(checkIsNotNull({ sellerId, date })).toBeTruthy();

    });

});


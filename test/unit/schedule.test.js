const factory = require("../factories");
const { Document } = require('mongoose');
const moment = require('moment-timezone');
const { checkIsNotNull } = require('../../components/shared/validators');

const {
    bulkEvents,
    getAvailability,
    getOpenScheduler,
    createScheduler,
    deleteScheduler,
    closeScheduler,
    createEvent } = require('../../components/Scheduler');

describe('Should create a new weekly scheduler', () => {

    it('Should return a new a weekly scheduler as Document', async () => {

        const weekly_scheduler = await factory.build('Schedule',
            {
                week_events: []
            });

        await expect(createScheduler(weekly_scheduler))
            .resolves
            .toBeInstanceOf(Document);
    });


    it('Should throw an error when sellerId is not passed to create a new weekly scheduler', async () => {

        const weekly_scheduler = await factory.build('Schedule',
            {
                sellerId: null
            });

        await expect(createScheduler(weekly_scheduler))
            .rejects
            .toThrow();
    });


    it('Should return an error when receiving a scheduler payload missing status', async () => {

        const weekly_scheduler = await factory.build('Schedule',
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

        const weekly_scheduler = await factory.build('Schedule');
        await createScheduler(weekly_scheduler);

        const { sellerId } = weekly_scheduler;

        await expect(getOpenScheduler(sellerId))
            .resolves
            .toBeInstanceOf(Document);

    });

    it('Should not find any opened scheduler as the current scheduler status is closed', async () => {

        const weekly_scheduler = await factory.build('Schedule',
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

        await factory.create('Schedule');

    });

    it('Should set the scheduler status from `open` to `closed`', async () => {

        const { sellerId } = await factory.attrs('Schedule');

        const { wallet_status } = await closeScheduler(sellerId);
        expect(wallet_status).toBe('closed');
    });

    it('Should throw an error when seller id is null to set scheduler status from `open` to `closed`', async () => {

        const { sellerId } = await factory.attrs('Schedule', { sellerId: null });

        await expect(closeScheduler(sellerId))
            .rejects
            .toThrow();
    });

});

describe('Should delete a scheduler', () => {

    it('Should remove the scheduler when receiving a valid ObjectId', async () => {

        const payload = await factory.build('Schedule');
        const scheduler = await createScheduler(payload);

        const { _id } = scheduler;

        await expect(deleteScheduler(_id))
            .resolves
            .toBeInstanceOf(Document);
    });

    it('Should throw an error when seller id is null to set scheduler status from `open` to `closed`', async () => {

        const { sellerId } = await factory.attrs('Schedule', { sellerId: null });

        await expect(closeScheduler(sellerId))
            .rejects
            .toThrow();
    });

});

describe('Should add events to an existing scheduler', () => {

    beforeEach(async () => {

        await factory.create('Schedule', {
            week_events: []
        });

    });

    it('Should add an event into scheduler when receiving a valid payload', async () => {

        const { sellerId, week_events } = await factory.attrs('Schedule');
        const [event] = week_events;

        event.date = moment.tz('2019-09-01T14:15:00-03:00', 'America/Recife');

        await expect(createEvent(sellerId, event))
            .resolves
            .toBeInstanceOf(Document);

    });


    it('Should add events into scheduler when receiving a valid payload', async () => {

        const payload = await factory.attrs('Schedule');

        const { week_events } = await bulkEvents(payload)
        await expect(week_events)
            .toHaveLength(4);

    });

    it('Should return availability as true in scheduler when find a free slot', async () => {

        const { sellerId } = await factory.attrs('Schedule');
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        await expect(getAvailability(sellerId, date))
            .resolves
            .toMatchObject({
                busySlot: null,
                isAvailable: true
            });

    });

    it('Should return availability as false in scheduler when find a busy slot', async () => {

        const { sellerId } = await factory.create('Schedule');
        const date = moment.tz('2019-09-01T17:30:00-03:00', 'America/Recife');

        const { busySlot, isAvailable } = await getAvailability(sellerId, date);

        expect(busySlot).toBeInstanceOf(Document);
        expect(isAvailable).toBe(false);

    });
});

describe('Should validate the entries format for scheduler', () => {

    it('Should validate if arguments are not null', async () => {

        const { sellerId } = await factory.create('Schedule');
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        expect(checkIsNotNull).toBeInstanceOf(Function);
        expect(checkIsNotNull({ sellerId, date })).toBeTruthy();

    });

});


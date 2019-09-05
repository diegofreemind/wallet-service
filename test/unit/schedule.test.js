const factory = require("../factories");
const { Document } = require('mongoose');
const moment = require('moment-timezone');
const { scheduler, event } = require('../mocks');
const { checkIsNotNull } = require('../../components/shared/validators');

const {
    getAvailability,
    getOpenScheduler,
    createScheduler,
    updateScheduler,
    createEvent } = require('../../components/Schedule');

describe('Should create a new scheduler for week', () => {

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
        await expect(createScheduler(weekly_scheduler))
            .resolves
            .toBeInstanceOf(Document);

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

    it('Should set the scheduler status from `open` to `closed`', async () => {

        const weekly_scheduler = await factory.build('Schedule',
            {
                wallet_status: 'closed'
            });

        await expect(createScheduler(weekly_scheduler))
            .resolves
            .toBeInstanceOf(Document);

        await expect(updateScheduler(weekly_scheduler))
            .resolves
            .toBeInstanceOf(Document);
    });

});

describe('Should add events to an existing scheduler', () => {

    beforeEach(async () => {

        await factory.create('Schedule', { week_events: [] });

    });

    //utilities validation - where to put?
    it('Should validate if arguments are not null - void', () => {

        const sellerId = '7c61deb00a634b45b7bfb1137a0121b9';
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        expect(checkIsNotNull).toBeInstanceOf(Function);
        expect(checkIsNotNull({ sellerId, date })).toBeTruthy();

    });

    it('Should add an event into scheduler when receiving a valid payload', async () => {

        const { sellerId, week_events } = await factory.build('Schedule');
        const [event] = week_events;

        await expect(createEvent(sellerId, event))
            .resolves
            .toBeInstanceOf(Document);

    });

    //return only available | unavailable or + busy doc?
    it('Should return availability as true in scheduler when receive a valid sellerId and date', async () => {

        const sellerId = '7c61deb00a634b45b7bfb1137a0121b9';
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        await expect(getAvailability(sellerId, date))
            .resolves
            .toMatchObject({
                busySlot: null,
                isAvailable: true
            });

    });

    it('Should return availability as false in scheduler when receive a valid sellerId and date', async () => {

        const sellerId = '7c61deb00a634b45b7bfb1137a0121b9';
        const date = moment.tz('2019-09-01T16:30:00-03:00', 'America/Recife');

        await expect(createScheduler(scheduler.mockSchedulerWithEvent))
            .resolves
            .toBeInstanceOf(Document);

        const { busySlot, isAvailable } = await getAvailability(sellerId, date);

        expect(busySlot).toBeInstanceOf(Document);
        expect(isAvailable).toBe(false);

    });
})
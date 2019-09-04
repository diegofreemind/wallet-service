const moment = require('moment-timezone');
const { Document } = require('mongoose');
const { scheduler, event } = require('./mocks');
const { checkIsNotNull } = require('../components/shared/validators');
const { getAvailability, getScheduler, createScheduler, updateScheduler } = require('../components/Schedule');

describe('Should create a new scheduler for week', () => {

    it('Should return a new a weekly scheduler as Document', async () => {

        await expect(createScheduler(scheduler.mockScheduler))
            .resolves
            .toBeInstanceOf(Document);
    });


    it('Should throw an error when sellerId is not passed to create a new weekly scheduler', async () => {

        await expect(createScheduler(scheduler.mockMissSellerId))
            .rejects
            .toThrow();
    });


    it('Should return an error when receiving a scheduler payload missing status', async () => {

        await expect(createScheduler(scheduler.mockMissStatus))
            .rejects
            .toThrow();
    });

});

describe('Should retrieve the weekly scheduler', () => {

    it('Should find the scheduler when receiving a valid seller id', async () => {

        const { sellerId } = scheduler.mockScheduler;
        await createScheduler(scheduler.mockScheduler);

        await expect(getScheduler(sellerId))
            .resolves
            .toBeInstanceOf(Document);

    });

});

describe('Should update the weekly scheduler', () => {


    it('Should set the scheduler status from `open` to `closed`', async () => {

        await expect(updateScheduler(scheduler.mockUpdateStatus))
            .resolves
            .toBeInstanceOf(Document)
            .toEqual(
                expect.objectContaining({
                    status: 'closed'
                }));
    });

});

xdescribe('Should add events in an existing scheduler', () => {

    it('Should add an event into scheduler when receiving a valid payload', async () => {

        //update
        const model = new scheduleModel(mockEvent);

        await expect(model.save())
            .resolves
            .toBeInstanceOf(Document);
    });

    //utilities validation - where to put?
    it('Should validate if arguments are not null - void', () => {

        const sellerId = '7c61deb00a634b45b7bfb1137a0121b9';
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        expect(checkIsNotNull).toBeInstanceOf(Function);
        expect(checkIsNotNull({ sellerId, date })).toBeTruthy();

    });

    //return only available | unavailable or + busy doc?
    it('Should return availability as true in scheduler when receive a valid sellerId and date', async () => {

        const sellerId = '7c61deb00a634b45b7bfb1137a0121b9';
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        const model = new scheduleModel(mockEvent);
        await model.save();

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

        const model = new scheduleModel(mockEvent);
        await model.save();

        const { busySlot, isAvailable } = await getAvailability(sellerId, date);

        expect(busySlot).toBeInstanceOf(Document);
        expect(isAvailable).toBe(false);

    });
})
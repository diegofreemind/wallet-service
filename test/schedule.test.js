const moment = require('moment-timezone');
const { Document } = require('mongoose');
const { scheduler, event } = require('./mocks');
const { checkIsNotNull } = require('../components/shared/validators');
const { connectToDataStore, clearDataStore, disconnectFromDataStore } = require('./utils');

const { getAvailability, scheduleModel } = require('../components/Schedule');

describe('Should create a new scheduler for week without events', () => {

    beforeAll(async () => {

        await connectToDataStore();
    });

    beforeEach(async () => {

        await clearDataStore();
    });

    afterAll(async () => {

        await disconnectFromDataStore();
    });


    it('Should return a new a weekly scheduler as Document', async () => {

        const model = new scheduleModel(scheduler.mockScheduler);

        await expect(model.save())
            .resolves
            .toBeInstanceOf(Document);

    });
    

    it('Should throw an error when sellerId is not passed to create a new weekly scheduler', async () => {

        const model = new scheduleModel(scheduler.mockMissSellerId);

        await expect(model.save())
            .rejects
            .toThrow();
    });


    it('Should return an error when receiving a scheduler payload missing status', async () => {

        const model = new scheduleModel(scheduler.mockMissStatus);

        await expect(model.save())
            .rejects
            .toThrow();

    });

});

xdescribe('Should add events in an existing scheduler', () => {

    beforeAll(async () => {

        await connectToDataStore();
    });

    beforeEach(async () => {

        await clearDataStore();
    });

    afterAll(async () => {

        await disconnectFromDataStore();
    });

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
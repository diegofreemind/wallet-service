const moment = require('moment-timezone');
const { Document } = require('mongoose');
const { mockEvent, mockEventMissStatus } = require('./mocks');
const {checkIsNotNull} = require('../components/shared/validators');
const { connectToDataStore, clearDataStore, disconnectFromDataStore } = require('./utils');

const { getAvailability,scheduleModel  } = require('../components/Schedule');

describe('Should schedule an event', () => {

    beforeAll(async () => {

        await connectToDataStore();
    });

    beforeEach(async () => {

        await clearDataStore();
    });

    afterAll(async () => {

        await disconnectFromDataStore();
    });

    it('Should schedule an event when receiving a valid payload', async () => {

        const model = new scheduleModel(mockEvent);

        await expect(model.save())
            .resolves
            .toBeInstanceOf(Document);
    });

    it('Should return an error when receiving a schedule payload missing status', async () => {

        const model = new scheduleModel(mockEventMissStatus);

        await expect(model.save())
            .rejects
            .toThrow();
    });
    
    //utilities validation - where to put?
    it('Should validate if arguments are not null - void',()=>{

        const sellerId = 'sellerid1234';
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        expect(checkIsNotNull).toBeInstanceOf(Function);
        expect(checkIsNotNull({sellerId,date})).toBeTruthy();
        
    });

    //return only available | unavailable or + busy doc?
    it('Should return availability as true in scheduler when receive a valid sellerId and date', async () => {

        const sellerId = 'sellerid1234';
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

        const sellerId = 'sellerid1234';
        const date = moment.tz('2019-09-01T16:30:00-03:00', 'America/Recife');

        const model = new scheduleModel(mockEvent);
        await model.save();

        const { busySlot, isAvailable } = await getAvailability(sellerId, date);

        expect(busySlot).toBeInstanceOf(Document);
        expect(isAvailable).toBe(false);

    });

});
const moment = require('moment-timezone');
const { Document } = require('mongoose');
const { mockEvent, mockEventMissStatus } = require('./mocks');
const { connectToDataStore, clearDataStore, disconnectFromDataStore } = require('./utils');

const { getAvailability, createEventInAgenda } = require('../components/Agenda');

describe('Should schedule an event into customer agenda', () => {

    beforeAll(async () => {

        await connectToDataStore();
    });

    beforeEach(async () => {

        await clearDataStore();
    });

    afterAll(async () => {

        await disconnectFromDataStore();
    });

    it('Should create an event in agenda when receiving a valid schedule payload', async () => {

        await expect(createEventInAgenda(mockEvent))
            .resolves
            .toBeInstanceOf(Document);
    });

    it('Should return an error when receiving a schedule payload missing status', async () => {

        await expect(createEventInAgenda(mockEventMissStatus))
            .rejects
            .toThrow();
    });

    it('Should return availability as true in agenda when receive a valid sellerId and date not already scheduled', async () => {

        const sellerId = 'sellerid1234';
        const date = moment.tz('2019-09-01T15:15:00-03:00', 'America/Recife');

        await createEventInAgenda(mockEvent);

        await expect(getAvailability(sellerId, date))
            .resolves
            .toMatchObject({
                busySlot: null,
                isAvailable: true
            });

    });

    it('Should return availability as false in agenda when receive a valid sellerId and date already scheduled', async () => {

        const sellerId = 'sellerid1234';
        const date = moment.tz('2019-09-01T16:30:00-03:00', 'America/Recife');

        await createEventInAgenda(mockEvent);

        const { busySlot, isAvailable } = await getAvailability(sellerId, date);

        expect(busySlot).toBeInstanceOf(Document);
        expect(isAvailable).toBe(false);

    });

});
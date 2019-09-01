const moment = require('moment-timezone');
const { Document } = require('mongoose');
const { mockEvent } = require('./mocks');
const { connectToDataStore, clearDataStore, disconnectFromDataStore } = require('./utils');

const { getAvailability, createEventInAgenda } = require('../components/Agenda');

describe('Should schedule an event into customer agenda', () => {

    beforeAll(async () => {
        await connectToDataStore();
    });

    beforeEach(async () => {

        await clearDataStore();
        await createEventInAgenda(mockEvent);
    });

    afterAll(async () => {
        await disconnectFromDataStore();
    });

    it('Should create an event in agenda when receiving a schedule payload', async () => {

        await expect(createEventInAgenda(mockEvent))
            .resolves
            .toBeInstanceOf(Document);
    });

    it('Should retrieve an available time in agenda when receive a valid customerId, sellerId and date', async () => {

        const sellerId = 'sellerid1234';
        const customerId = 'customer1234';
        const date = moment.tz('2019-09-01T15:30:00', 'America/Recife');

        await expect(getAvailability(sellerId, customerId, date))
            .resolves
            .toMatchObject({
                scheduled: [],
                isAvailable: true
            });

    });

});
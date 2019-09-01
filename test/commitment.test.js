
const { Document } = require('mongoose');
const { mockEvent } = require('./mocks');
const { connectToDataStore, clearDataStore, disconnectFromDataStore } = require('./utils');

const { getAvailability, createEventInAgenda } = require('../components/Agenda');

describe('Should schedule an event into customer agenda', () => {

    beforeAll(async () => {
        await connectToDataStore();
    })

    beforeEach(async () => {
        await createEventInAgenda(mockEvent);
    });

    afterEach(async () => {
        await clearDataStore();
    });

    afterAll(async () => {
        await disconnectFromDataStore();
    })

    it('Should create an event in agenda when receiving a schedule payload', async () => {

        await expect(createEventInAgenda(mockEvent))
            .resolves
            .toBeInstanceOf(Document);
    });

    it('Should retrieve an available time in agenda when receive a valid user id and date / time', async () => {

        const id = 12;
        const date = new Date();

        await expect(getAvailability(id, date))
            .resolves
            .toBeInstanceOf(Array);

    });

});
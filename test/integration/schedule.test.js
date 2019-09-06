const request = require('supertest');
const factory = require("../factories");
const { Document } = require('mongoose');

const app = require('../../src/index');

describe('Should create a scheduler', () => {

    it('Should return status code 200 and the new scheduler when receive a valid payload', async () => {

        const body = await factory.attrs('Wallet');

        request(app).post('/api/scheduler')
            .send(body)
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {

                expect(response).toBeInstanceOf(Document);
            });
    });

});
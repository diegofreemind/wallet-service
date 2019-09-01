const { connect, connection } = require('mongoose');
const agendaModel = require('../components/Agenda/AgendaModel');

const { mongo_host } = require('../components/_config/env');

async function clearDataStore() {
    try {
        agendaModel.deleteMany({}, (err) => {
            if (err) {
                console.log('Could not drop collection');
            }
        });

        return;
    } catch (error) {
        throw new Error('Could not destroy database');
    }
}

async function connectToDataStore() {

    await connect(mongo_host, { useNewUrlParser: true });
    return;
}

async function disconnectFromDataStore() {

    await connection.close();
    return;
}

module.exports = {
    clearDataStore,
    connectToDataStore,
    disconnectFromDataStore
};
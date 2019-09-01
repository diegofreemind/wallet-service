const { connect, connection } = require('mongoose');
const agendaModel = require('../components/Agenda/AgendaModel');

const { mongo_host } = require('../components/_config/env');

async function clearDataStore() {

    return agendaModel.deleteMany();
}

function connectToDataStore() {

    return connect(mongo_host, { useNewUrlParser: true });
}

function disconnectFromDataStore() {

    return connection.close();
}

module.exports = {
    clearDataStore,
    connectToDataStore,
    disconnectFromDataStore
};
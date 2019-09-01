const agendaModel = require('./AgendaModel');
const { createEventInAgenda, getAvailability } = require('./AgendaController');

module.exports = {
    agendaModel,
    getAvailability,
    createEventInAgenda
};
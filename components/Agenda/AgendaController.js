const agendaModel = require('./AgendaModel');

function validate(...args) {

    args.forEach(param => {

        let key = Object.keys(param)[0];
        let value = Object.values(param)[0];

        if (!value) {
            throw new Error(`The argument ${key} is invalid: ${value}`);
        }
    })
}

async function createEventInAgenda(event) {

    try {

        validate({ event });

        const newEvent = new agendaModel(event);
        const scheduled = await newEvent.save();

        return scheduled;

    } catch (error) {

        console.log(error);
        throw new Error('Error creating event');
    }
}

async function getAvailability(id, date) {

    try {

        validate({ id, date });

        const availability = await agendaModel.find({ id, date });

        const isAvailable = availability.length > 0 ? false : true;

        return {
            availability,
            isAvailable
        };

    } catch (error) {

        console.log(error);
        throw new Error(`Could not retrieve availability for ${id}`);
    }
}

module.exports = {
    getAvailability,
    createEventInAgenda
}
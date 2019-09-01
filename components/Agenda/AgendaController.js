const agendaModel = require('./AgendaModel');
const moment = require('moment-timezone');

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
        throw new Error(`Error creating event : ${error}`);
    }
}

async function getAvailability(sellerId, customerId, requestedDate) {

    try {

        validate({ sellerId, customerId, requestedDate });

        const start = requestedDate.subtract(1, 'hours');
        const end = requestedDate.add(1, 'hours');

        console.log(requestedDate, start, end);

        const scheduled = await agendaModel.find({
            sellerId, commitments: {
                $elemMatch: {
                    date: {
                        $gte: start,
                        $lte: end
                    }
                }
            }
        });

        const isAvailable = scheduled.length > 0 ? false : true;

        return {
            scheduled,
            isAvailable
        };

    } catch (error) {

        console.log(error);
        throw new Error(`Could not retrieve availability for ${sellerId} : ${error}`);
    }
}

module.exports = {
    getAvailability,
    createEventInAgenda
}
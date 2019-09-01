const agendaModel = require('./AgendaModel');
const moment = require('moment');

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

        throw new Error(`Error creating event : ${error}`);
    }
}

async function getAvailability(sellerId, requestedDate) {

    try {

        validate({ sellerId, requestedDate });

        const range_start = moment(requestedDate).subtract(1, 'hours').format();
        const range_end = moment(requestedDate).add(1, 'hours').format();

        const busySlot = await agendaModel.findOne({
            sellerId, week_events: {
                $elemMatch: {
                    date: {
                        $gte: range_start,
                        $lte: range_end
                    }
                }
            }
        });

        const isAvailable = busySlot !== null ? false : true;

        return {
            busySlot,
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
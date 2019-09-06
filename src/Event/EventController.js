const moment = require('moment');
const walletModel = require('../shared/models/Wallet');
const { checkIsNotNull } = require('../shared/validators/entries');


async function createEvent(sellerId, payload) {

    try {

        checkIsNotNull({ payload });

        const { date } = payload;
        const { isAvailable, busySlot } = await getAvailability(sellerId, date);

        if (isAvailable) {

            const newEvent = await walletModel.findOneAndUpdate(
                {
                    sellerId,
                    wallet_status: 'open'
                },
                {
                    $push: {
                        week_events: payload
                    }
                },
                {

                    new: true
                });

            if (newEvent) {
                return newEvent;
            }

        }

        throw new Error(`Time not available for schedule - planned: ${busySlot}`);

    } catch (error) {

        throw new Error(`Could not create event ${payload} : ${error}`);
    }
}

async function bulkEvents(payload) {

    try {

        checkIsNotNull({ payload });

        const { sellerId, week_events } = payload;


        const updatedScheduler = await walletModel.findOneAndUpdate(
            {
                sellerId,
                wallet_status: 'open'
            },
            {
                $set: {
                    week_events
                }
            },
            {
                new: true
            });

        if (updatedScheduler) {

            return updatedScheduler;
        }

    } catch (error) {

        throw new Error(`Could not add events ${payload} : ${error}`);

    }
}

async function getEvent(sellerId, eventId) {

    try {

        checkIsNotNull({ sellerId, eventId });

        const { week_events } = await walletModel.findOne(
            {
                sellerId,
                week_events: {
                    $elemMatch: {
                        _id: eventId
                    }
                }
            });

        const event = week_events.find(item => item._id == eventId);
        return event;

    } catch (error) {

        throw new Error(`Could not find the event ${eventId} : ${error}`);

    }

}

async function updateEvent(sellerId, payload) {

    try {

        checkIsNotNull({ sellerId, payload });

        const { _id, customerId, customerName, status, date } = payload;

        const { week_events } = await walletModel.findOneAndUpdate(
            {
                sellerId,
                wallet_status: 'open',
                week_events: {
                    $elemMatch: {
                        _id
                    }
                }
            },
            {
                $set: {
                    'week_events.$': {
                        customerId,
                        customerName,
                        status,
                        date
                    }
                }

            },
            {
                new: true
            });

        if (week_events) {

            return week_events;
        }

    } catch (error) {

        throw new Error(`Could not update the event ${payload} : ${error}`);

    }
}

async function getAvailability(sellerId, requestedDate) {

    try {

        checkIsNotNull({ sellerId, requestedDate });

        const range_start = moment(requestedDate).subtract(30, 'minutes').format();
        const range_end = moment(requestedDate).add(30, 'minutes').format();

        const busySlot = await walletModel.findOne({
            sellerId, week_events: {
                $elemMatch: {
                    date: {
                        $gte: range_start,
                        $lte: range_end
                    },
                    status: {
                        $eq: 'ontrack'
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

        throw new Error(`Could not retrieve availability for ${sellerId} : ${error}`);
    }
}

module.exports = {
    getEvent,
    bulkEvents,
    updateEvent,
    createEvent,
    getAvailability
}
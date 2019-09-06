const moment = require('moment');
const scheduleModel = require('./SchedulerModel');
const { checkIsNotNull } = require('../shared/validators');


//============== Scheduler stuff ========================

async function createScheduler(payload) {

    try {

        checkIsNotNull({ payload });

        const alreadyActive = await getOpenScheduler(payload.sellerId);

        if (alreadyActive === null) {

            const model = new scheduleModel(payload);
            const scheduler = await model.save();

            return scheduler;
        }

        throw new Error(`Scheduler already opened for the current week - planned : ${alreadyActive}`);


    } catch (error) {

        throw new Error(`Could not create the scheduler ${payload} : ${error}`);
    }

}

async function getOpenScheduler(sellerId) {

    try {

        checkIsNotNull({ sellerId });

        const schedule = await scheduleModel.findOne({
            sellerId,
            wallet_status: 'open'
        });

        return schedule;

    } catch (error) {

        throw new Error(`Could not retrieve schedule for ${sellerId} : ${error}`);
    }
}

async function closeScheduler(sellerId) {

    try {

        checkIsNotNull({ sellerId });

        const closedScheduler = await scheduleModel.findOneAndUpdate(
            {
                sellerId,
                wallet_status: 'open'
            },
            {
                wallet_status: 'closed'
            },
            {
                new: true
            });

        return closedScheduler;

    } catch (error) {

        throw new Error(`Could not close the scheduler ${sellerId} : ${error}`);

    }
}

async function deleteScheduler(id) {

    try {

        checkIsNotNull({ id });

        const deletedScheduler = await scheduleModel.findByIdAndRemove(id);

        return deletedScheduler;

    } catch (error) {

        throw new Error(`Could not delete the scheduler ${id} : ${error}`);
    }
}

//============== Event stuff ========================

async function createEvent(sellerId, payload) {

    try {

        checkIsNotNull({ payload });

        const { date } = payload;
        const { isAvailable, busySlot } = await getAvailability(sellerId, date);

        if (isAvailable) {

            const newEvent = scheduleModel.findOneAndUpdate(
                {
                    sellerId
                },
                {
                    $push: {
                        week_events: payload
                    }
                },
                {

                    new: true
                });

            return newEvent;
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


        const updatedScheduler = await scheduleModel.findOneAndUpdate(
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

        return updatedScheduler;

    } catch (error) {

        throw new Error(`Could not update the scheduler ${payload} : ${error}`);

    }
}

// async function updateEvent() { }

// async function deleteEvent() { }

// async function getEvent() { }


//============== helpers ========================

async function getAvailability(sellerId, requestedDate) {

    try {

        checkIsNotNull({ sellerId, requestedDate });

        const range_start = moment(requestedDate).subtract(30, 'minutes').format();
        const range_end = moment(requestedDate).add(30, 'minutes').format();

        const busySlot = await scheduleModel.findOne({
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
    bulkEvents,
    createEvent,
    closeScheduler,
    deleteScheduler,
    getOpenScheduler,
    createScheduler,
    getAvailability
}
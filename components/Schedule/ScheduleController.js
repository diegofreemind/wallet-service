const moment = require('moment');
const scheduleModel = require('./ScheduleModel');
const { checkIsNotNull } = require('../shared/validators');

async function getAvailability(sellerId, requestedDate) {

    try {

        checkIsNotNull({ sellerId, requestedDate });

        const range_start = moment(requestedDate).subtract(1, 'hours').format();
        const range_end = moment(requestedDate).add(1, 'hours').format();

        const busySlot = await scheduleModel.findOne({
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

        throw new Error(`Could not retrieve availability for ${sellerId} : ${error}`);
    }
}

async function getScheduler(sellerId) {

    try {

        checkIsNotNull({ sellerId });

        const schedule = await scheduleModel.findOne({ sellerId });
        return schedule;

    } catch (error) {

        throw new Error(`Could not retrieve schedule for ${sellerId} : ${error}`);
    }
}

async function createScheduler(payload) {

    //missing only one in 'open' rule
    try {

        checkIsNotNull({ payload });

        const model = new scheduleModel(payload);
        const scheduler = await model.save();

        return scheduler;

    } catch (error) {

        throw new Error(`Could not create the scheduler ${payload} : ${error}`);
    }

}

async function updateScheduler(payload) {

    try {

        checkIsNotNull({ payload });

        const { sellerId, wallet_status, week_events } = payload;
        const updateDoc = week_events ?
            {
                $set: {
                    week_events,
                    wallet_status
                }
            } : {
                $set: {
                    wallet_status
                }
            }

        const updatedScheduler = await scheduleModel.findOneAndUpdate({ sellerId }, updateDoc, { new: true });

        return updatedScheduler;

    } catch (error) {

        throw new Error(`Could not update the scheduler ${payload} : ${error}`);

    }
}

async function createEvent(sellerId, payload) {

    try {

        checkIsNotNull({ payload });

        const newEvent = scheduleModel.findOneAndUpdate({ sellerId }, {
            $push: {
                week_events: payload
            }
        }, { new: true });

        return newEvent;

    } catch (error) {

        throw new Error(`Could not create event ${payload} : ${error}`);
    }
}

module.exports = {
    createEvent,
    getScheduler,
    updateScheduler,
    createScheduler,
    getAvailability
}
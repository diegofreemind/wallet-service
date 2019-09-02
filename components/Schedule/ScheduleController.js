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

        console.log(error);
        throw new Error(`Could not retrieve availability for ${sellerId} : ${error}`);
    }
}

module.exports = {
    getAvailability
}
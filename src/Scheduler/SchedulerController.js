const walletModel = require('../shared/models/wallet');
const { checkIsNotNull } = require('../shared/validators/entries');

async function createScheduler(payload) {

    try {

        checkIsNotNull({ payload });

        const alreadyActive = await getOpenScheduler(payload.sellerId);

        if (alreadyActive === null) {

            const model = new walletModel(payload);
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

        const schedule = await walletModel.findOne(
            {
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

        const closedScheduler = await walletModel.findOneAndUpdate(
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

        const deletedScheduler = await walletModel.findByIdAndRemove(id);

        return deletedScheduler;

    } catch (error) {

        throw new Error(`Could not delete the scheduler ${id} : ${error}`);
    }
}



module.exports = {
    closeScheduler,
    deleteScheduler,
    getOpenScheduler,
    createScheduler
}
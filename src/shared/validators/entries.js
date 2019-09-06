const { check } = require('express-validator');

function checkIsNotNull(...args) {

    args.forEach(param => {

        let key = Object.keys(param)[0];
        let value = Object.values(param)[0];

        if (!value) {
            throw new Error(`The argument ${key} is invalid: ${value}`);
        }
    });

    return true;
}

const schedulerPayload = [
    check('sellerId', 'sellerId not defined').exists().isString(),
    check('week_events', 'week_events not defined').exists().isArray(),
    check('wallet_status', 'wallet_status not defined').exists().isString(),
];

const eventPayload = [
    check('date', 'date not defined').exists().isString(),
    check('status', 'status not defined').exists().isString(),
    check('customerId', 'customerId not defined or wrong type').exists().isMongoId(),
    check('customerName', 'customerName not defined').exists().isString(),
]

function validationErrorHandler(errors) {

    return {
        status: 422,
        message: errors.array()
    }
}

module.exports = {
    eventPayload,
    checkIsNotNull,
    schedulerPayload,
    validationErrorHandler
}
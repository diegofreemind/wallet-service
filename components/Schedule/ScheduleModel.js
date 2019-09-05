const { Schema, model } = require('mongoose');

const scheduleSchema = new Schema({
    week_events: [
        {
            customerId: {
                type: String,
                required: true
            },
            customerName: String,
            status: {
                type: String,
                required: true,
                enum: ['completed', 'rescheduled', 'cancelled']
            },
            date: String
        }
    ],
    sellerId: {
        type: String,
        required: true,
    },
    wallet_status: {
        type: String,
        required: true,
        enum: ['open', 'closed']
    }
},
    { timestamps: true });

const scheduleModel = model('Schedule', scheduleSchema);

module.exports = scheduleModel;
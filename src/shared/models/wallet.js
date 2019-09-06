const { Schema, model } = require('mongoose');

const walletSchema = new Schema({
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
                default: 'ontrack',
                enum: ['completed', 'rescheduled', 'cancelled', 'ontrack']
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

const walletModel = model('Wallet', walletSchema);

module.exports = walletModel;
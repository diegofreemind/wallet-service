const { Schema, model } = require('mongoose');

const commitmentSchema = new Schema({
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
},
    {
        timestamps: true
    });

const agendaSchema = new Schema({
    week_events: [
        {
            required: false,
            type: commitmentSchema
        }
    ],
    sellerId: String,
    wallet_status: {
        type: String,
        required: true,
        enum: ['open', 'closed']
    }
});


const agendaModel = model('Agenda', agendaSchema);

module.exports = agendaModel;
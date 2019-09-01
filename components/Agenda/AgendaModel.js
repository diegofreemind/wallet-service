const { Schema, model } = require('mongoose');

const commitmentSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    customerName: String,
    date: String
},
    {
        timestamps: true
    });

const agendaSchema = new Schema({
    commitments: [
        {
            required: false,
            type: commitmentSchema
        }
    ],
    sellerId: String
});


const agendaModel = model('Agenda', agendaSchema);

module.exports = agendaModel;
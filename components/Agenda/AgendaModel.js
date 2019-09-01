const { Schema, model } = require('mongoose');

const commitmentSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    customerName: String,
    date: {
        type: Date,
        //apply default date format dd/mm/yyyy | hh:mm
    }
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
},
    {
        timestamps: true
    });


const agendaModel = model('Agenda', agendaSchema);

module.exports = agendaModel;
const express = require('express');
const mongoose = require('mongoose');
const config = require('./_config/env');
const logger = require('./shared/middlewares/logger');

const scheduleRouter = require('./Scheduler/SchedulerRouter');
const eventRouter = require('./Event/EventRouter');

const app = express();
app.use(express.json());
app.use(logger);

app.use('/api', scheduleRouter);
app.use('/api', eventRouter);

mongoose.connect(config.mongo_host, config.mongo_extras);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', console.log.bind(console, 'Mongo ready'))

app.use((err, req, res) => {

    res.status(500)
        .send(err)
});

module.exports = app;
const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
const config = require('./_config/env');
const logger = require('./shared/middlewares/logger');

const scheduleRouter = require('./Scheduler/SchedulerRouter');
const eventRouter = require('./Event/EventRouter');

const app = express();
app.use(express.json());
app.use(logger);

app.use(passport.initialize());

app.use('/api', scheduleRouter);
app.use('/api', eventRouter);

try {

    mongoose.connect(config.mongo_host, config.mongo_extras);

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', console.log.bind(console, 'Mongo ready'))

} catch (error) {

    console.log(error);
    process.exit(1);
}


app.use((err, req, res) => {

    res.status(err.status)
        .send(err.message)
});

module.exports = app;
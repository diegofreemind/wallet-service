const express = require('express');
const logger = require('./middlewares/logger');

const scheduleRouter = require('./Scheduler/SchedulerRouter');
const eventRouter = require('./Event/EventRouter');

const app = express();
app.use(express.json());
app.use(logger);

app.use('/api', scheduleRouter);
app.use('/api', eventRouter);

app.use((err, req, res) => {

    res.status(500)
        .send(err.message)
});

module.exports = app;
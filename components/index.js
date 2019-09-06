const express = require('express');

const agendaRouter = require('./Agenda/AgendaRouter');
const rankingRouter = require('./Ranking/RankingRouter');
const scheduleRouter = require('./Schedule/ScheduleRouter');

const app = express();
app.use(express.json());

app.use('/api', agendaRouter);
app.use('/api', rankingRouter);
app.use('/api', scheduleRouter);

app.use((err, req, res) => {

    res.status(500)
        .send(err.message)
});

module.exports = app;
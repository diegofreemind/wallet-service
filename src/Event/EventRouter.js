const controller = require('./index');

const express = require('express');
const router = express.Router();

router.post('/event', (req, res, next) => {

    controller.createEvent(req.params.id, req.body)
        .then(newScheduler => {

            res.send(newScheduler);
        })
        .catch(next);
});

router.get('/event', (req, res, next) => {

    controller.getEvent(req.params.id, req.params.event_id)
        .then(openedScheduler => {

            res.send(openedScheduler);
        })
        .catch(next);
});


router.delete('/event', (req, res, next) => {

    controller.deleteEvent(req.params.id)
        .then(deletedScheduler => {

            res.send(deletedScheduler);
        })
        .catch(next);
});

module.exports = router;
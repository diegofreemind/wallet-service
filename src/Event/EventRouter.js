const controller = require('./index');

const { eventPayload, validationErrorHandler } = require('../shared/validators/entries');
const { validationResult } = require('express-validator');

const express = require('express');
const router = express.Router();

router.post('/event/:id', eventPayload, (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        next(validationErrorHandler(errors));
        return;
    }

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

router.put('/event/:id', (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        next(validationErrorHandler(errors));
        return;
    }

    controller.updateEvent(req.params.id, req.body)
        .then(openedScheduler => {

            res.send(openedScheduler);
        })
        .catch(next);
});

router.delete('/event', (req, res, next) => {

    controller.deleteEvent()
        .then(deletedScheduler => {

            res.send(deletedScheduler);
        })
        .catch(next);
});

module.exports = router;
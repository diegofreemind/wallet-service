const controller = require('./index');
const { authenticate } = require('../shared/middlewares/auth');

const { eventPayload, validationErrorHandler } = require('../shared/validators/entries');
const { validationResult } = require('express-validator');

const express = require('express');
const router = express.Router();

router.post('/event/:id', authenticate(), eventPayload, (req, res, next) => {

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

router.get('/event', authenticate(), (req, res, next) => {

    controller.getEvent(req.params.id, req.params.event_id)
        .then(openedScheduler => {

            res.send(openedScheduler);
        })
        .catch(next);
});

router.put('/event/:id', authenticate(), (req, res, next) => {

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

module.exports = router;
const controller = require('./index');
const { authenticate } = require('../shared/middlewares/auth');

const { schedulerPayload, validationErrorHandler } = require('../shared/validators/entries');
const { validationResult } = require('express-validator');

const express = require('express');
const router = express.Router();

router.post('/scheduler', authenticate(), schedulerPayload, (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        next(validationErrorHandler(errors));
        return;
    }

    controller.createScheduler(req.body)
        .then(newScheduler => {

            res.send(newScheduler);
        })
        .catch(next);
});

router.get('/scheduler/:id', authenticate(), (req, res, next) => {

    controller.getOpenScheduler(req.params.id)
        .then(openedScheduler => {

            res.send(openedScheduler);
        })
        .catch(next);
});


router.delete('/scheduler/:_id', authenticate(), (req, res, next) => {

    controller.deleteScheduler(req.params._id)
        .then(deletedScheduler => {

            res.send(deletedScheduler);
        })
        .catch(next);
});

module.exports = router;
const controller = require('./index');

const express = require('express');
const router = express.Router();

router.post('/scheduler', (req, res, next) => {

    controller.createScheduler(req.body)
        .then(newScheduler => {

            res.send(newScheduler);
        })
        .catch(next);
});

router.get('/scheduler/:id', (req, res, next) => {

    controller.getOpenScheduler(req.params.id)
        .then(openedScheduler => {

            res.send(openedScheduler);
        })
        .catch(next);
});


router.delete('/scheduler/:_id', (req, res, next) => {

    controller.deleteScheduler(req.params._id)
        .then(deletedScheduler => {

            res.send(deletedScheduler);
        })
        .catch(next);
});

module.exports = router;
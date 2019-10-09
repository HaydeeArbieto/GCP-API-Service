'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model-datastore');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));

router.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

/* GET /customer */
router.get('/', (req, res, next) => {
    model.list(10, req.query.pageToken, (err, entities, cursor) => {
        if (err) {
            next(err);
            return;
        }
        res.render('customer/list.pug', {
            books: entities,
            nextPageToken: cursor,
        });
    });
});

/**
 * GET /customer/:id
 */
router.get('/:customer', (req, res, next) => {
    model.read(req.params.customer, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.render('customer/view.pug', {
            customer: entity,
        });
    });
});

/**
 * Errors on "/customer/*" routes.
 */
router.use((err, req, res, next) => {
    // Format error and forward to generic error handler for logging and
    // responding to the request
    err.response = err.message;
    next(err);
});

module.exports = router;
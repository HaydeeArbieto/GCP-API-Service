'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model-datastore');

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

/*** GET /api/customer ***/
router.get('/', (req, res, next) => {
    model.list(10, req.query.pageToken, (err, entities, cursor) => {
        if (err) {
            next(err);
            return;
        }
        res.json({
            items: entities,
            nextPageToken: cursor,
        });
    });
});

/*** POST /api/customer : Create a new customer. ***/
router.post('/', (req, res, next) => {
    model.create(req.body, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entity);
    });
});

/*** GET /api/customers/:id  -> Retrieve a customer. ***/
router.get('/:customer', (req, res, next) => {
    model.read(req.params.customer, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entity);
    });
});

/*** PUT /api/customers/:id -> Update a customer. ***/
router.put('/:customer', (req, res, next) => {
    model.update(req.params.customer, req.body, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entity);
    });
});

/*** DELETE /api/customers/:id -> Delete a customer. ***/
router.delete('/:customer', (req, res, next) => {
    model.delete(req.params.customer, err => {
        if (err) {
            next(err);
            return;
        }
        res.status(200).send('OK');
    });
});

/*** Errors on "/api/customer/*" routes. ***/
router.use((err, req, res, next) => {
    // Format error and forward to generic error handler for logging and
    // responding to the request
    err.response = {
        message: err.message,
        internalCode: err.code,
    };
    next(err);
});

module.exports = router;
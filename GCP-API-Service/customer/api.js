'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model-datastore');

const router = express.Router();

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


/*** GET /api/customer/:id ***/
router.get('/:customer', (req, res, next) => {
    model.read(req.params.book, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.json(entity);
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
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model-datastore');

const router = express.Router();

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

// GET /customers -> Display a page of customers (up to ten at a time).
router.get('/', (req, res, next) => {
    model.list(10, req.query.pageToken, (err, entities, cursor) => {
        if (err) {
            next(err);
            return;
        }
        res.render('customers/list.pug', {
            customers: entities,
            nextPageToken: cursor,
        });
    });
});

// GET /customers/add -> Display a form for creating a customer.
router.get('/add', (req, res) => {
    res.render('customer/customer-form.pug', {
        customer: {},
        action: 'Add',
    });
});

// POST /customers/add -> Create a customer.
router.post('/add', (req, res, next) => {
    const data = req.body;

 // Save the data to the database 
  model.create(data, (err, savedData) => {
     if (err) {
            next(err);
            return;
        }
        res.redirect(`${req.baseUrl}/${savedData.id}`);
    });
});

// GET /customers/:id/edit -> Display a customer for editing. 
router.get('/:customer/edit', (req, res, next) => {
    model.read(req.params.customer, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.render('customers/form.pug', {
            customer: entity,
            action: 'Edit',
        });
    });
});

// POST /customers/:id/edit -> Update a customer.
router.post('/:customer/edit', (req, res, next) => {
    const data = req.body;

    model.update(req.params.customer, data, (err, savedData) => {
        if (err) {
            next(err);
            return;
        }
        res.redirect(`${req.baseUrl}/${savedData.id}`);
    });
});

// GET /customers/:id -> Display a customer.
router.get('/:customer', (req, res, next) => {
    model.read(req.params.customer, (err, entity) => {
        if (err) {
            next(err);
            return;
        }
        res.render('customers/view.pug', {
            customer: entity,
        });
    });
});

// GET /customers/:id/delete -> Delete a customer.
router.get('/:customer/delete', (req, res, next) => {
    model.delete(req.params.customer, err => {
        if (err) {
            next(err);
            return;
        }
        res.redirect(req.baseUrl);
    });
});


// Errors on "/customer/*" routes. 
router.use((err, req, res, next) => {
    // Format error and forward to generic error handler for logging and
    // responding to the request
    err.response = err.message;
    next(err);
});

module.exports = router;
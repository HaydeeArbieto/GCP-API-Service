
const express = require('express');
const http = require('http');
const favicon = require('serve-favicon');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./config');

const app = express();

app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', true);

// Customers
app.use('/customers', require('./customer/crud'));
app.use('/api/customers', require('./customer/api'));

//app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.use(cookieParser());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

//Redirect root to /customers
/*app.get('/', (req, res) => {
    res.redirect('/customers');
});*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers, development - will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler - no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/*const port = (process.env.PORT || '8080');
app.set('port', port);

var server = http.createServer(app);

server.listen(port, function () {
    console.log("Express Server listening on port " + app.get('port'));
});*/


if (module === require.main) {
    // Start the server
    const server = app.listen(process.env.PORT || 8080, () => {
        const port = server.address().port;
        console.log(`App listening on port ${port}`);
    });
}

module.exports = app;

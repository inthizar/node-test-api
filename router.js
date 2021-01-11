var register = require('./routes/register');

exports.setup = function( app ) {

    app.post('/api/register', register.index);

    app.get('/api/commonstudents', register.common);

    app.post('/api/suspend', register.suspend);

    app.post('/api/retrievefornotifications', register.notify);
};
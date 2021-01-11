require('dotenv').config();

var helmet = require('helmet');
var config = require('config');
var errorhandler = require('errorhandler');
var requestSanitizer = require('request-sanitizer')();
var validator = requestSanitizer.validator;
var emailValidator = require("email-validator");

var express = require('express');
var router  = require('./router');
var app     = express();

requestSanitizer.setOptions({
    query :{
        test : [validator.escape]
    },
    body :{
        name : [validator.escape,validator.ltrim],
        test : [validator.ltrim]
    },
});

app.use('/*',requestSanitizer.sanitize);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorhandler());

app.use( (req, res, next) => {
    let err = new Error();
    err.status = 400;
    if (req.body.teacher && !emailValidator.validate(req.body.teacher)) { err.message = "invalid teacher email"; next(err);}
    if (req.body.student && !emailValidator.validate(req.body.student)) { err.message = "invalid student email"; next(err);}
    if (req.body.students) {
        for(var i of req.body.students) {
            if (!emailValidator.validate(i)) { err.message = "invalid student email"; next(err);}
        }
    }
    if (req.query.teacher) {
        let teachers = req.query.teacher;
        if (!Array.isArray(teachers)) {
            teachers = [teachers]
        }
        for(var i of teachers) {
            if (!emailValidator.validate(i)) { err.message = "invalid teacher email"; next(err);}
        }
    }
    next();
});


app.listen(config.get('port'), config.get('host'))

router.setup(app);

console.log("Express server listening on port %d in %s mode", config.get('port'), config.get('env'));

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({message: err.message});
});
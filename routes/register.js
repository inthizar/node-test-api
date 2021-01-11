var db = require('../adapter/db');
var register = require('../models/register');

exports.index = ( request, response, next ) => {

    try {
        register.registerStudentsToTeacher(request.body, (err,  result) => {
            if (err) {
                err.status = 400;
                next(err);
                return;
            }
            response.statusCode = 204;
            response.send({result: result});
        });

    } catch (e) {
        console.error(e);
        next(e);
    }
};

exports.common = ( request, response, next ) => {

    try {

        register.commonStudentsOfTeachers(request.query, (err,  result) => {
            if (err) {
                err.status = 400;
                next(err);
                return;
            }
            response.statusCode = 200;
            response.send({students: result});
        });


    } catch (e) {
        console.error(e);
        next(e);
    }
};

exports.suspend = ( request, response, next ) => {

    try {
        register.suspendStudent(request.body, (err,  result) => {
            if (err) {
                err.status = 400;
                next(err);
                return;
            }
            response.statusCode = 204;
            response.send({result: result});
        });


    } catch (e) {
        console.error(e);
        next(e);
    }
};

exports.notify = ( request, response, next ) => {

    try {

        register.getNotificationList(request.body, (err,  result) => {
            if (err) {
                err.status = 400;
                next(err);
                return;
            }
            response.statusCode = 200;
            response.send({result: result});
        });


    } catch (e) {
        console.error(e);
        next(e);
    }
};
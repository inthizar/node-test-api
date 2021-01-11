var db = require('../adapter/db');
var async = require('async');

module.exports = {
    registerStudentsToTeacher: (body, fn) => {
        const teacherEmail = body.teacher;
        if (!!teacherEmail === false) {
            return fn(new Error("teacher not provided"));
        }

        const students = body.students;
        if (!!students === false || !students.length) {
            return fn(new Error("students not provided"));
        }

        db.query('select id from teacher where email = ?',  [teacherEmail], (err, result) => {
            if (err) {
                return fn(err);
            }
            if (!result[0] || !result[0].id) {
                return fn(new Error("teacher not found"));
            }

            const teacherId = result[0].id;

            db.getConnection(conn => {
                conn.beginTransaction(err => {
                    if (err) {
                        return fn(err);
                    }
                    async.eachSeries(students,function iteratorOverElems(i, cb) {
                        conn.query('insert into student (email) values (?)', [i], (err, result) => {
                            if (err) {
                                return cb(err);
                            }

                            conn.query('insert into teacher_student (fk_teacher, fk_student) values (?, ?)', [teacherId, result.insertId], (err, result) => {
                                if (err) {
                                    return cb(err);
                                }
                                return cb();
                            });
                        })
                    }, err => {
                        if (err) {
                            conn.rollback(() => {
                                return fn(err);
                            });
                        } else {
                            conn.commit(err => {
                                if (err) {
                                    conn.rollback(() => {
                                        return fn(err);
                                    });
                                }
                                fn(null, 'success');

                            })
                        }
                    });
                })
            });
        });
    },

    commonStudentsOfTeachers: (query, fn) => {
        let teachers = query.teacher;
        if (!teachers) {
            fn(new Error("teachers not provided")) ;
            return;
        }
        if (!Array.isArray(teachers)) {
            teachers = [teachers]
        }
        if (!teachers.length) {
            fn(new Error("teachers not provided"));
            return;
        }

        let  basesql = 'select student.email from teacher join teacher_student ' +
            'on teacher.id=teacher_student.fk_teacher join student on student.id=teacher_student.fk_student ' +
            'where teacher.email = ?';

        let sql = basesql;

        for (let k = 1; k < teachers.length; k++) {
            sql = basesql + ' and student.email in (' + sql + ')'
        }


        db.query(sql,  teachers, (err, result) => {

            if (err) {
                fn(err);
                return;
            }
            let emails = [];
            for(let i of result) {
                emails.push(i.email)
            }
            fn(null, emails)
        });
    },

    suspendStudent: (body, fn) => {
        const studentEmail = body.student;
        if (!!studentEmail === false) {
            fn(new Error("student not provided"));
            return;
        }

        db.query('select id from student where email = ?',  [studentEmail], (err, result) => {
            if (err) {
                fn(err);
                return;
            }
            if (!result[0] || !result[0].id) {
                fn(new Error("student not found"));
                return;
            }

            db.query('update student set suspended = 1 where id = ?',  [result[0].id], (err, result) => {
                if (err) {
                    fn(err);
                    return;
                }

                fn(null, 'success');
            });

        });


    },

    getNotificationList: (body, fn) => {
        const teacherEmail = body.teacher;
        if (!!teacherEmail === false) {
            fn(new Error("teacher not provided"));
            return;
        }

        const notification = body.notification;
        if (!!notification === false) {
            fn(new Error("notification not provided"));
            return;
        }

        const regex = / @[\w+-.@]+/gi;
        const matches = [...notification.matchAll(regex)];

        let mentions = [];
        for(let m of matches) {
            mentions.push(m[0].trim().replace(/^@/, ''))
        }
        let sql = 'select distinct student.email from teacher join teacher_student on teacher.id=teacher_student.fk_teacher ' +
            'join student on student.id=teacher_student.fk_student ' +
            'where student.suspended=0 and ';
        let where = 'teacher.email = ?';
        let params = [teacherEmail];
        if (mentions.length){
            where = '(' + where + ' or student.email in (?))';
            params.push(mentions);
        }
        sql = sql + where;
        db.query('select id from teacher where email = ?',  [teacherEmail], (err, result) => {

            if (err) {
                fn(err);
                return;
            }
            if (!result[0] || !result[0].id) {
                fn(new Error("teacher not found"));
                return;
            }

            db.query(sql, params, (err, result) => {
                if (err) {
                    fn(err);
                    return;
                }
                let emails = [];
                for(let i of result) {
                    emails.push(i.email)
                }
                fn(null, emails)
            });
        });
    }
};

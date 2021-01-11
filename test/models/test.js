require('dotenv').config({path:'./.env.test'});
var assert = require('assert');
var db = require('../../adapter/db');
var register = require('../../models/register');
const path = require('path');
const fs = require('fs');


describe('Setup', () => {

  before((done) => {
    let mig = fs.readFileSync(path.join(__dirname, '../../migration/init.sql')).toString();
    let seed = fs.readFileSync(path.join(__dirname, '../../migration/test/seed.sql')).toString();
    db.query(mig + seed, (e, r) => {
      if (e) console.log(e);
      done();
    });
  });

  describe('Test Register student', () => {

    describe('Invalid teacher', () => {
      it('should return error message', () => {
        let data = {"teacher": "teachernone@gmail.com", "students": ["studentken2@gmail.com", "studentken3@gmail.com"]};
        register.registerStudentsToTeacher(data, (e, r) => {
          assert.equal(e.message, "teacher not found");
        });
      });
    });

    describe('Missing teacher', () => {
      it('should return error message', () => {
        let data = {"students": ["studentken2@gmail.com", "studentken3@gmail.com"]};
        register.registerStudentsToTeacher(data, (e, r) => {
          assert.equal(e.message, "teacher not provided");
        });
      });
    });

    describe('Missing student', () => {
      it('should return error message', () => {
        let data = {"teacher": "teachernone@gmail.com"};
        register.registerStudentsToTeacher(data, (e, r) => {
          assert.equal(e.message, "students not provided");
        });
      });
    });

    describe('Ok', () => {
      it('should succeed', () => {
        let data = {"teacher": "teacherken@gmail.com", "students": ["studentken2@gmail.com", "studentken3@gmail.com"]};
        register.registerStudentsToTeacher(data, (e, r) => {
          assert.equal(e, null);
          assert.equal(r, 'success');
        });
      });
    });
  });

  describe('Test Common students', () => {
    describe('missing teacher', () => {
      it('should return error message', () => {
        let data = {"teacher": ""};
        register.commonStudentsOfTeachers(data, (e, r) => {
          assert.equal(e.message, "teachers not provided");
        });
      });
      it('should return error message', () => {
        let data = {"teacher": []};
        register.commonStudentsOfTeachers(data, (e, r) => {
          assert.equal(e.message, "teachers not provided");
        });
      });
    });

    describe('Ok', () => {
      it('should return students', () => {
        let data = {"teacher": "teacherken@gmail.com"};
        register.commonStudentsOfTeachers(data, (e, r) => {
          assert.equal(e, null);
          assert.deepEqual(r, [ 'studentken@gmail.com', 'studentall@gmail.com', 'studentkenother@gmail.com' ]);
        });
      });
    });
  });

  describe('Test suspend student', () => {
    describe('missing student', () => {
      it('should return error message', () => {
        let data = {"student": ""};
        register.suspendStudent(data, (e, r) => {
          assert.equal(e.message, "student not provided");
        });
      });
    });

    describe('invalid student', () => {
      it('should return error message', () => {
        let data = {"student": "invalid@gmail.com"};
        register.suspendStudent(data, (e, r) => {
          assert.equal(e.message, "student not found");
        });
      });
    });

    describe('Ok', () => {
      it('should return success', () => {
        let data = {"student": 'studentkenother@gmail.com'};
        register.suspendStudent(data, (e, r) => {
          assert.equal(e, null);
          assert.equal(r, 'success');
        });
      });
    });
  });

  describe('Test notification student', () => {
    describe('missing teacher', () => {
      it('should return error message', () => {
        let data = {"teacher": ""};
        register.getNotificationList(data, (e, r) => {
          assert.equal(e.message, "teacher not provided");
        });
      });
    });

    describe('missing notification', () => {
      it('should return error message', () => {
        let data = {"teacher": "teachersun@gmail.com"};
        register.getNotificationList(data, (e, r) => {
          assert.equal(e.message, "notification not provided");
        });
      });
    });

    describe('missing notification', () => {
      it('should return error message', () => {
        let data = {"teacher": "teachersun@gmail.com"};
        register.getNotificationList(data, (e, r) => {
          assert.equal(e.message, "notification not provided");
        });
      });
    });

    describe('Ok - no mention', () => {
      it('should return list', () => {
        let data = {"teacher": "teachersun@gmail.com", "notification": "hello world"};
        register.getNotificationList(data, (e, r) => {
          assert.equal(e, null);
          assert.deepEqual(r, ['studentsun@gmail.com', 'studentall@gmail.com']);
        });
      });
    });

    describe('Ok - with mention', () => {
      it('test 1', () => {
        let data = {"teacher": "teachersun@gmail.com", "notification": "hello world @studentken@gmail.com"};
        register.getNotificationList(data, (e, r) => {
          assert.equal(e, null);
          assert.deepEqual(r, ['studentken@gmail.com', 'studentsun@gmail.com', 'studentall@gmail.com']);
        });
      });

      it('test 2', () => {
        let data = {"teacher": "teachersun@gmail.com", "notification": "hello world@studentken@gmail.com"};
        register.getNotificationList(data, (e, r) => {
          assert.equal(e, null);
          assert.deepEqual(r, ['studentsun@gmail.com', 'studentall@gmail.com']);
        });
      });
    });
  });
});


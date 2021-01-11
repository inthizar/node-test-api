const config = require('config');
const mysql = require('mysql');
let pool = null;

const getPool = () => {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: config.get('db.host'),
        user: config.get('db.user'),
        password: config.get('db.password'),
        database: config.get('db.name'),
        port: config.get('db.port'),
        connectionLimit : 100,
        multipleStatements: true
      });
    } catch (err) {
      console.log('Unable to connect DB');
      process.exit(1);
    }
  }
  return pool;
};

module.exports = {
  query : (query, params, fn) => {
    getPool().getConnection((err, connection) => {
      if (err) {
        console.log(err);
        throw err;
      }
      connection.query(query, params, fn);
    });
  },

  getConnection: (fn) => {
    getPool().getConnection((err, connection) => {
      if (err) {
        console.log(err);
        throw err;
      }
      fn(connection);
    });
  }
};

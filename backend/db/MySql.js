const mysql2 = require('mysql2')

let _DBConnection;

const connectDatabase = async () => {
    return mysql2.createConnection({
        host:'localhost',
        user:'root',
        password:'gayanu.amb',
        database:'pos8'
    })
}

const getDbConnection = async () => {
  if (!_DBConnection) {
    _DBConnection = await connectDatabase().connect();
  }
  return _DBConnection;
};

const closeConnection = conn => {
  if (conn) {
    return conn.close();
  }
};

module.exports = {
  getDbConnection,
  closeConnection
};
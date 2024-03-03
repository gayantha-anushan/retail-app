const mysql2 = require('mysql2')

let _DBConnection;

const connectDatabase = async () => {
    return mysql2.createConnection({
      host:'34.121.0.150',
      port:3306,
      user:'demo-pos',
      password:'pos@demo',
      database:'dev_db'
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
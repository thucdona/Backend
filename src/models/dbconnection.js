const mysql = require('mysql');

//tạo kết nối đến cơ sở dữ liệu mysql
 const ConnectDatabase = mysql.createPool({
    host: "localhost",
    user: 'root',
    database: 'db_app'
 })

 module.exports = {
    ConnectDatabase,
 }
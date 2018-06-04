var mysql = require('mysql');
var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tda_db',
    port: 3306
});



connection.getConnection(function(err) {
    if (err) {
        console.log(err);
    }

});
console.log("Connected to Mysql");
module.exports = connection;
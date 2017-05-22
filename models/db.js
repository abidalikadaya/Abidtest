var mysql =	require("mysql");

/**
 * Defines database operations.
 * @class
 */
var DB = function(){};
var mysql_ip = process.env.OPENSHIFT_MYSQL_DB_HOST || "127.0.0.1";
var mysql_port = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;

DB.prototype.createPool = function(){
	return mysql.createPool({
			host     : mysql_ip,
			port     : mysql_port ,
			user     : 'adminEKjjeuX',
			password : 'PqYE_gZiKH5p',
			database : 'employeemanagement',
			connectionLimit : 100
		});
}

/**
 * Establishes mysql connection and returns the connection object.
 * @function
 * @param {object} pool - Mysql pool object.
 * @param {function} callback - Callback.
 */
DB.prototype.getConnection = function(pool,callback){
	var self = this;
	console.log("Trying to connect db")
	pool.getConnection(function(err, connection) {
		console.log("connection complete",err);
		if(err) {
			//logging here
			console.log(err);
			callback(true);
			return;
		}
		connection.on('error', function(err) {
			if(err.code === "PROTOCOL_CONNECTION_LOST") {
				connection.destroy();
			} else {
				connection.release();
			}
			console.log(err);
			callback(true);
			return;
		});
		callback(null,connection);
	});
}

/**
 * Establishes mysql connection, begins transaction and returns the transactio connection object.
 * @function
 * @param {object} pool - Mysql pool object.
 * @param {function} callback - Callback.
 */
DB.prototype.createTransaction = function(pool,callback) {
	var self = this;
	self.getConnection(pool,function(err,connection){
		if(err) {
			//logging here
			console.log(err);
			callback(true);
			return;
		}
		connection.beginTransaction(function(err) {
			if(err){
				console.log(err);
				callback(true);
				return;
			}
			callback(null,connection)
		});
	});
}

module.exports = new DB();

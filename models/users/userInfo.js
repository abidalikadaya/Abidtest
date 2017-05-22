var mysql =	require("../db.js"),
	mysqlPool = mysql.createPool();
/**
 * Defines user information operations.
 * @class
 */
var userinfo = function(){};

/**
 * Get all information .
 * @Function
 * @param callback
 */
userinfo.prototype.getAllUserInfo = function(callback){
	var getInfoQuery = 'SELECT * FROM users';
	mysqlPool.getConnection(function(err, connection){
		connection.query(getInfoQuery, function(err, rows, fields) {
			if (err){
				connection.release();
				callback(true, null);
			}else{
				connection.release();
				callback(null, rows);
			}
		});
	})
}

module.exports = new userinfo();
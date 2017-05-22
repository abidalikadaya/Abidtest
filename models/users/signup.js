var mysql =	require("../db.js");
	mysqlPool = mysql.createPool();
/**
 * Defines add user information operations.
 * @class
 */
var signup = function(){};

/**
 * Add user information .
 * @Function
 * @param req
 * @param res
 * @param callback
 */
signup.prototype.addUser = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        dob = new Date(req.body.dateOfBirth).toISOString().slice(0, 19).replace('T', ' '),
        params = [req.body.fullName, req.body.userName, req.body.sex, dob, req.body.country, req.body.state, req.body.password, req.body.emailAddress, req.body.mobileNumber, nowDate, nowDate],
	    insertUser = 'INSERT INTO users (fullName, userName, sex, dateOfBirth, country, state, password, emailAddress, mobileNumber, accountCreated, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	mysqlPool.getConnection(function(err, connection){
		connection.query(insertUser, params, function(err, rows, fields) {
			if (err){
				connection.release();
				callback(true, null);
			}else{
				connection.release();
				callback(null, rows);
			}
		});
	});
}

module.exports = new signup();
var mysql =	require("../db.js"),
	mysqlPool = mysql.createPool();
/**
 * Defines login operations.
 * @class
 */
var login = function(){};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
login.prototype.loginUser = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        params = [req.body.username, req.body.username, req.body.password],
        detailParams = [ req.body.username, req.body.password],
        updateParams = [],
	    loginUserQuery = 'SELECT * FROM users WHERE (userName = ? OR emailAddress = ?) AND password = ?',
        getDetailQuery = 'CALL get_userDetail(?, ?)'
        updateLastloginTime = 'UPDATE users SET lastLogin = ? WHERE id = ?';
	mysqlPool.getConnection(function(err, connection){
		connection.query(loginUserQuery, params, function(err, rows, fields) {
           if(rows.length <= 0){
                connection.release();
                callback(true, null);
            }else{
                updateParams = [nowDate, rows[0].Id];
                req.session.user = rows[0];
                connection.query(updateLastloginTime, updateParams, function(err, rows, fields) {
                    connection.query(getDetailQuery, detailParams, function(err, rows, fields) {
                        connection.release();
                        callback(null, rows);
                    });
                });
            }
		});
	});
}

module.exports = new login();
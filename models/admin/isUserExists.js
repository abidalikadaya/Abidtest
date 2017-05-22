var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool();

/**
 * Defines chnage passoword.
 * @class
 */
var isUserExists = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
isUserExists.prototype.byUserName = function(req, res, callback){
   var  getUserByUserNameQuery = 'CALL isUserNameExists(?)',
        params = req.params.username;
    mysqlPool.getConnection(function(err, connection){
        connection.query(getUserByUserNameQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
};

isUserExists.prototype.byEmailAddress = function(req, res, callback){
   var  getUserByEmailAddressQuery = 'CALL isEmailAddressExists(?)',
        params = req.params.emailAddress;
    mysqlPool.getConnection(function(err, connection){
        connection.query(getUserByEmailAddressQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
};

module.exports = new isUserExists();
var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool();

/**
 * Defines chnage passoword.
 * @class
 */
var changePass = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
changePass.prototype.changePwd = function(req, res, callback){
   var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        updatePassQueury = 'UPDATE users SET',
        params = [id];
    mysqlPool.getConnection(function(err, connection){
        connection.query(updatePassQueury, params, function(err, rows, fields) {
            if(!!rows && rows.length > 0){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
};

module.exports = new changePass();
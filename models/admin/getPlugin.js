var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool();

/**
 * Defines chnage passoword.
 * @class
 */
var getPlugin = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
getPlugin.prototype.getActivePlugin = function(req, res, callback){
   var  id = req.session.user.Id,
        isActive = 1;
        getActivePluginQuery = 'CALL getPlugin(?)',
        params =[isActive];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getActivePluginQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                callback(null, rows[0]);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
};

module.exports = new getPlugin();
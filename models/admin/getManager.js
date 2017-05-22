var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool();

/**
 * Defines get managers.
 * @class
 */
var getManagers = function(){};

/**
 * Get managers details.
 * @Function
 * @param callback
 */
getManagers.prototype.byManagerId = function(req, res, callback){
   var  isManager = 1;
        getManagerQuery = 'CALL getManagers(?)',
        params =[isManager];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getManagerQuery, params, function(err, rows, fields) {
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

module.exports = new getManagers();
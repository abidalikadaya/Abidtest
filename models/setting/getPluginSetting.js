var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool();

/**
 * Defines plugin segttings.
 * @class
 */
var pluginSettings = function(){};

/**
 * grt plugins.
 * @Function
 * @param callback
 */
pluginSettings.prototype.get = function(req, res, callback){
   var  getPluginQuery = 'CALL getPluginSetting';
    mysqlPool.getConnection(function(err, connection){
        connection.query(getPluginQuery, function(err, rows, fields) {
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

module.exports = new pluginSettings();
var mysql =	require("../db.js"),
    _ = require("lodash")
    mysqlPool = mysql.createPool();

/**
 * Defines chnage passoword.
 * @class
 */
var getRoles = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
getRoles.prototype.byPluginID = function(req, res, callback){
   var  isActive = 1;
        getActivePluginQuery = 'CALL getRoles(? , ?)',
        params =[parseInt(req.params.pluginId) ,isActive];
        console.log(params);
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

getRoles.prototype.all = function(req, res, callback){
   var  isActive = 1;
        getAllRolesQuery = 'CALL getAllRoles(?)',
        params =[isActive];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getAllRolesQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                var finalData = _.groupBy( rows[0], "pluginId");
                callback(null, finalData);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
};

module.exports = new getRoles();
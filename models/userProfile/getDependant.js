var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    moment = require("moment");

/**
 * Defines chnage passoword.
 * @class
 */
var getDependant = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
getDependant.prototype.getByUserID = function(req, res, callback){
   var  id = req.session.user.Id,
        isActive = 1;
        getUserDependantQuery = 'SELECT id, userID, name, nationality, relation, gender, saudiOrExpat, iqamaID, saudiID, mobileNumber, birthDate, isActive, updatedby, updatedDate FROM userDependantDetails where userID = ? and isActive = ?',
        params =[id, isActive];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getUserDependantQuery, params, function(err, rows, fields) {
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

module.exports = new getDependant();
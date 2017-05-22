var mysql = require("../db.js"),
    mysqlPool = mysql.createPool();

/**
 * Defines chnage passoword.
 * @class
 */
var userCreate = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
userCreate.prototype.createNew = function(req, res, callback){
   var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        createUserQuery = 'CALL createUser (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        params = [req.body.username, req.body.firstName, req.body.middleName, req.body.lastName, req.body.managerId, req.body.isManager, req.body.password, req.body.emailAddress,
                 req.body.mobileNumber, req.body.officeNumber,  req.body.officeExtn, id, req.body.roleIds];
    mysqlPool.getConnection(function(err, connection){
        connection.query(createUserQuery, params, function(err, rows, fields) {
            if(err) {
                connection.release();
                callback(true, null);
            }
            else {
                connection.release();
                callback(null, rows);
            }
            // console.log(err);
            // if(!!rows && rows.length > 0){
            //     connection.release();
            //     callback(true, rows);
            // }else{
            //     connection.release();
            //     callback(true, null);
            // }
        });
    });
};

module.exports = new userCreate();
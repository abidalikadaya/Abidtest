var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool();

/**
 * Defines chnage passoword.
 * @class
 */
var emailSetting = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
emailSetting.prototype.create = function(req, res, callback){
   var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        createEmailQuery = 'CALL createEmailSetting(?,?,?,?,?,?,?,?,?,?,?)',
        params = [req.body.serverName,req.body.port,req.body.fromEmail,req.body.toEmail,req.body.timeOut,
        req.body.userName,req.body.password,req.body.sslEnabled,req.body.sslCertificate,req.body.sslCertificatePwd,id];      
    mysqlPool.getConnection(function(err, connection){
        connection.query(createEmailQuery, params, function(err, rows, fields) {
            if(err){
                callback(true,err);
            }else{
                callback(null,true);
            }            
        });
    });
};

module.exports = new emailSetting();
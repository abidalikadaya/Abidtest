var mysql =	require("../db.js"),
moment = require("moment"),
	mysqlPool = mysql.createPool();
/**
 * Defines update Procurement operations.
 * @class
 */
var updateProc = function(){};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
updateProc.prototype.updateProcurement = function(req, res, callback){
    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss").toString(),
        id = req.session.user.Id,
        updateProcQuery = 'UPDATE procurement SET ? where id = ?',
        addProcAudit = 'INSERT INTO procurementaudit (procurementId,approverId,approverComment,status,createdDate) VALUES (?,?,?,?,"'+nowDate+'")',
        updateProcQueryparams = [{status : req.body.status}, req.body.procurementId],
        comment = req.body.approverComment || '',
        addProcAuditparams = [req.body.procurementId, id, comment, req.body.status];
    mysqlPool.getConnection(function(err, connection){
        connection.query(updateProcQuery, updateProcQueryparams,  function(err, rows, fields) {
            if(err){
                connection.release();
                callback(true, null);
            }else {
                connection.query(addProcAudit, addProcAuditparams,  function(err, rows, fields) {
                    if(err){
                        connection.release();
                        callback(true, null);
                    } else {
                        connection.release();
                        callback(null, rows);
                    }
                });
            }
        });
	});
}

module.exports = new updateProc();
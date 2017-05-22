var mysql =	require("../db.js"),
	mysqlPool = mysql.createPool();
/**
 * Defines Add Procurement operations.
 * @class
 */
var getProcAudit = function(){};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
getProcAudit.prototype.getProcurementAudit = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        getProcAuditqurey ='select pa.id,u.firstName as "Approver",pa.approverComment,sa.statusName,pa.createdDate from procurementaudit pa join users u on pa.approverId = u.id join procurementstatus sa on pa.status = sa.id where pa.procurementId = ? ORDER By pa.createdDate desc',
        params = [req.params.procurementId];
        console.log(req.params.procurementId);
	mysqlPool.getConnection(function(err, connection){
		connection.query(getProcAuditqurey, params, function(err, rows, fields) {
			if(err){
                connection.release();
                callback(true, null);
            }else{
                connection.release();
                callback(null, rows);
            }
		});
	});
}

module.exports = new getProcAudit();
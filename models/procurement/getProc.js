var mysql =	require("../db.js"),
	mysqlPool = mysql.createPool();
/**
 * Defines Add Procurement operations.
 * @class
 */
var getProc = function(){};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
getProc.prototype.getPendingApprovalForUsers = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        getPendingForUsersProcquery = 'SELECT p.id,pt.code,pt.description,pt.price,ps.statusName,p.CreatedDate FROM procurement p join product pt on p.productId = pt.id join procurementstatus ps on p.Status = ps.id where createdBy = ? and p.cartStatus=0',
        params = [id];
	mysqlPool.getConnection(function(err, connection){
		connection.query(getPendingForUsersProcquery, params, function(err, rows, fields) {
            if(!!rows && rows.length > 0){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
		});
	});
}

getProc.prototype.getPendingApprovalForManagerProcurement = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        getPendingForManagerProcquery = 'SELECT p.id,pt.code,pt.description,pt.price,ps.statusName,p.CreatedDate,p.cartStatus FROM procurement p join product pt on p.productId = pt.id join procurementstatus ps on p.Status = ps.id where p.status = 1 and p.createdBy in (select id from users u where managerId = ?) and p.cartStatus=0',
        params = [id];
	mysqlPool.getConnection(function(err, connection){
		connection.query(getPendingForManagerProcquery, params, function(err, rows, fields) {
			if(!!rows && rows.length > 0){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
		});
	});
}

getProc.prototype.getPendingApprovalForDeptProcurement = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        getPendingApprovalForDeptProcquery = 'select p.id,pt.code,pt.description,pt.price,ps.statusName,p.CreatedDate from users u join departments d on u.departmentId = d.id join procurement p on p.status = d.fulfillmentStatus join product pt on p.productId = pt.id JOIN procurementstatus ps on p.status = ps.id where u.id = ? and p.cartStatus=0',
        params = [id];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getPendingApprovalForDeptProcquery, params, function(err, rows, fields) {
            if(!!rows && rows.length > 0){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
}

getProc.prototype.getMyClosedProcurement = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        getMyClosedProcquery = 'SELECT p.id,pt.code,pt.description,pt.price,ps.statusName,p.CreatedDate FROM procurement p join product pt on p.productId = pt.id join procurementstatus ps on p.Status = ps.id where createdBy = ? and status=8 and p.cartStatus=0',
        params = [id];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getMyClosedProcquery, params, function(err, rows, fields) {
            if(!!rows && rows.length > 0){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
}

getProc.prototype.getMyCartData = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        getMyCartDataQuery = 'SELECT p.id,pt.code,pt.description,pt.price,p.quantity,p.CreatedDate FROM procurement p join product pt on p.productId = pt.id where createdBy = ? and cartStatus=1',
        params = [id];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getMyCartDataQuery, params, function(err, rows, fields) {
            if(!!rows && rows.length > 0){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
}

module.exports = new getProc();
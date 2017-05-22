var mysql =	require("../db.js"),
    moment = require("moment"),
    async = require("async"),
    _ = require("lodash"),
	mysqlPool = mysql.createPool();
/**
 * Defines Add Procurement operations.
 * @class
 */
var addProc = function(){};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
addProc.prototype.addProcurement = function(req, res, callback){
    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss").toString(),
        initialStatus = 1,
        id = req.session.user.Id,
        initialComment = 'MR request Created',
        getMyCartDataQuery = 'SELECT p.id,pt.code,pt.description,pt.price,p.quantity,p.CreatedDate FROM procurement p join product pt on p.productId = pt.id where createdBy = ? and cartStatus=1',
        updateProcQuery = 'UPDATE procurement SET cartStatus=0 where createdBy = ? and cartStatus=1',
        //addProcQuery = 'INSERT INTO procurement(ProductId, Status, CreatedBy, CreatedDate) VALUES (?, '+initialStatus+', '+id+', "'+nowDate+'")',
        addProcAudit = 'Insert into procurementaudit (procurementId,approverId,approverComment,Status, createdDate) Values (?,?,?,?,"'+nowDate+'")',
        getCartParams = [id],
        addProcQueryParams=[];
        mysqlPool.getConnection(function(err, connection){
            connection.query(getMyCartDataQuery, getCartParams, function(err, cartData, fields) {
                if(err){
                    connection.release();
                    callback(true, null);
                }else{
                    connection.query(updateProcQuery, getCartParams, function(err, updatedProcData, fields) {
                        if(err){
                            connection.release();
                            callback(true, null);
                        }else{
                            var requirdIds = _.map(cartData, 'id');
                            async.each(requirdIds, function(procId, callback) {
                                addProcQueryParams = [procId,id,initialComment,initialStatus];
                                connection.query(addProcAudit, addProcQueryParams, function(err, rows, fields) {
                                    if(err){
                                        callback(true, null);
                                    }
                                    else {
                                        callback(null, rows);
                                    }
                                });
                            }, function(err) {
                                if( err ) {
                                    connection.release();
                                    callback(true, null);
                                } else {
                                    connection.release();
                                    callback(null, true);
                                }
                            });
                        }
                    }); 
                }
            });            
            /*connection.query(addProcQuery, params, function(err, rows, fields) {
                if(err){
                    connection.release();
                    callback(true, null);
                }else{
                    addProcQueryParams = [rows.insertId,id,initialComment,initialStatus];
                    connection.query(addProcAudit, addProcQueryParams, function(err, rows, fields) {
                        if(err){
                            connection.release();
                            callback(true, null);
                        }
                        else {
                            connection.release();
                            callback(null, rows);
                        }
                    });
                }
            });*/
        });
}

module.exports = new addProc();
var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    async = require("async");

/**
 * Defines chnage passoword.
 * @class
 */
var hotelCashFlow = function(){};

 hotelCashFlow.prototype.getFields = function(req, res, callback){
     var  userId = req.session.user.Id,
     getDataEntryFieldsQuery = 'CALL hotel_getCashFlowFields(?, ? ,?)',
     params =[userId, req.body.projectYear,req.body.projectId];
     mysqlPool.getConnection(function(err, connection){
        connection.query(getDataEntryFieldsQuery, params, function(err, rows, fields) {
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

 hotelCashFlow.prototype.save = function(req, res, callback) {
    var  userId = req.session.user.Id,
    isActive = 1,   
    savePeriodQuery = 'CALL hotel_saveCashflow(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    console.log(req.body);
    mysqlPool.getConnection(function(err, connection){
    async.each(req.body.cashflowData, function(cashflow, callback) {
       params =[cashflow.jan, cashflow.feb, cashflow.mar, cashflow.apr,
       cashflow.may, cashflow.jun, cashflow.jul, cashflow.aug,
       cashflow.sep, cashflow.oct, cashflow.nov, cashflow.dec,
       cashflow.total,  cashflow.periodId, cashflow.dataEntryFieldsId, isActive, 
       userId];
       connection.query(savePeriodQuery, params, function(err, rows, fields) {
        if(err){
            callback(err);
        }else{
            callback();
        }        
    });

   }, function(err) {
       console.log(err);
        if( err ) {
            connection.release();
            callback(true, null);
        } else {
            connection.release();
            callback(null, true);
        }
    });
 });
};

module.exports = new hotelCashFlow();
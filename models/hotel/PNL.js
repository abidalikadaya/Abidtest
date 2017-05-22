var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    async = require("async"),
    _ = require('lodash');

/**
 * Defines chnage passoword.
 * @class
 */
 var hotelPNL = function(){};

 hotelPNL.prototype.getFields = function(req, res, callback){
    var  userId = req.session.user.Id,
        getDataEntryFieldsQuery = 'CALL hotel_getPnlFields(?, ?, ?)',  
        params =[userId,req.body.projectYear, req.body.projectId],  
        result = {};
    mysqlPool.getConnection(function(err, connection){
        connection.query(getDataEntryFieldsQuery, params, function(err, rows, fields) {  
          if(!!rows){
                connection.release();
                result.value = rows[0];               
                callback(null, result);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });    
 };  

 hotelPNL.prototype.save = function(req, res, callback) {   
    var  userId = req.session.user.Id,
    isActive = 1,       
    savePnlQuery = 'CALL hotel_savePNL(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlPool.getConnection(function(err, connection){ 
    async.each(req.body.PNLData, function(PNL, callback) { 
        params =[PNL.jan_actual,PNL.jan_actualPer,PNL.jan_budget,PNL.jan_budgetPer, 
                PNL.feb_actual,PNL.feb_actualPer,PNL.feb_budget,PNL.feb_budgetPer,
                PNL.mar_actual,PNL.mar_actualPer,PNL.mar_budget,PNL.mar_budgetPer,
                PNL.apr_actual,PNL.apr_actualPer,PNL.apr_budget,PNL.apr_budgetPer,
                PNL.may_actual,PNL.may_actualPer,PNL.may_budget,PNL.may_budgetPer,
                PNL.jun_actual,PNL.jun_actualPer,PNL.jun_budget,PNL.jun_budgetPer,
                PNL.jul_actual,PNL.jul_actualPer,PNL.jul_budget,PNL.jul_budgetPer,
                PNL.aug_actual,PNL.aug_actualPer,PNL.aug_budget,PNL.aug_budgetPer,
                PNL.sep_actual,PNL.sep_actualPer,PNL.sep_budget,PNL.sep_budgetPer,
                PNL.oct_actual,PNL.oct_actualPer,PNL.oct_budget,PNL.oct_budgetPer,
                PNL.nov_actual,PNL.nov_actualPer,PNL.nov_budget,PNL.nov_budgetPer,
                PNL.dec_actual,PNL.dec_actualPer,PNL.dec_budget,PNL.dec_budgetPer,       
                PNL.periodId, PNL.dataEntryFieldsId, isActive,userId];
       connection.query(savePnlQuery, params, function(err, rows, fields) {
        if(err){
            console.log(err);
            callback(err);
        }else{
            callback();
        }        
    });

   }, function(err) {      
        if( err ) {
            connection.release();
            callback(true, null);
        } else {
            connection.release();
            callback(null, req);
        }
    });
 });
};
module.exports = new hotelPNL();
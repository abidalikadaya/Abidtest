var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    async = require("async"),
    _ = require('lodash');

/**
 * Defines chnage passoword.
 * @class
 */
 var hotelBudget = function(){};

 hotelBudget.prototype.getFields = function(req, res, callback){
    var  userId = req.session.user.Id,
        getDataEntryFieldsQuery = 'CALL hotel_getBudgetFields(?, ?, ?)',        
        getLockStatusQuery = 'CALL hotel_getLockBudgetStatus(?,?)',
        params =[userId,req.body.projectYear, req.body.projectId],
        lockStatusParams = [req.body.projectYear, req.body.projectId],
        result = {};
    mysqlPool.getConnection(function(err, connection){
        connection.query(getDataEntryFieldsQuery, params, function(err, rows, fields) {            
            if(!!rows){
                
                    result.value = rows[0];
                connection.query(getLockStatusQuery, lockStatusParams, function(err, rows1, fields) {
                    if(!!rows1){
                        console.log(rows1);
                        result['actionLockStatus'] = rows1[0][0].isLocked;
                        result['actionStatus'] = rows1[0][0].status;
                    }
                    connection.release();
                    callback(null, result);
                });
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });

    //  var  userId = req.session.user.Id,
    //  getDataEntryFieldsQuery = 'CALL hotel_getBudgetFields(?, ? ,?)',
    //  params =[userId, req.body.projectYear,req.body.projectId];
    //  mysqlPool.getConnection(function(err, connection){
    //     connection.query(getDataEntryFieldsQuery, params, function(err, rows, fields) {
    //         if(!!rows){
    //             connection.release();
    //             callback(null, rows[0]);
    //         }else{
    //             connection.release();
    //             callback(true, null);
    //         }
    //     });
    // });
 };

  hotelBudget.prototype.getLockBudget = function(req, res, callback){
     var  userId = req.session.user.Id,
     getLockBudgetQuery = 'CALL hotel_getLockBudget(?)',
     params =[userId];
     mysqlPool.getConnection(function(err, connection){
        connection.query(getLockBudgetQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                var dbData = rows[0];
                data = _.chain(_.clone(dbData))
            	 .uniqBy("projectName")
            	 .value();
                 _.each(data, function(value, key) {
            	 	var yearsData =  _.chain(_.clone(dbData))
            	 	 .filter(['projectName',value.projectName])
            	 	 .map('periodYear')
            	 	 .value();
            	 	 value.periodYear = yearsData;
             	 });
                 
                callback(null, rows[0]);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
 };

 hotelBudget.prototype.unlockBudget = function(req, res, callback){
    var  userId = req.session.user.Id,
    getUnlockBudgetQuery = 'CALL hotel_unlockBudget(?,?,?)',
    params =[userId, req.body.projectId, req.body.projectYear];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getUnlockBudgetQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                callback(null, true);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
 };

 hotelBudget.prototype.save = function(req, res, callback) {
    var  userId = req.session.user.Id,
    isActive = 1,   
    savePeriodQuery = 'CALL hotel_saveBudget(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlPool.getConnection(function(err, connection){
    async.each(req.body.budgetData, function(budget, callback) {
       params =[budget.jan, budget.feb, budget.mar, budget.apr,
       budget.may, budget.jun, budget.jul, budget.aug,
       budget.sep, budget.oct, budget.nov, budget.dec,
       budget.total,  budget.periodId, budget.dataEntryFieldsId, isActive, 
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
            callback(null, req);
        }
    });
 });
};

hotelBudget.prototype.saveStatus = function(req, res, callback) {
    var  userId = req.session.user.Id,
         operatorId = 0,
         controllerId = 0,
    getBudgetStatusQuery = 'CALL hotel_saveBudgetStatus(?,?,?,?,?,?)';
    if(req.body.statusData.operator === 1) {
        operatorId = userId;
    } 
    if(req.body.statusData.controller === 1) {
        controllerId = userId;        
    }
    var params =[req.body.statusData.projectYear,req.body.statusData.projectId,  operatorId, controllerId,req.body.operation,req.body.statusData.comment];
    console.log(params);
    mysqlPool.getConnection(function(err, connection){
        connection.query(getBudgetStatusQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                callback(null, true);
            }else{
                console.log(err);
                connection.release();
                callback(true, null);
            }
        });
    });
};

module.exports = new hotelBudget();
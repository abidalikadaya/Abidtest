var mysql =	require("../db.js"),
    async = require('async'),
    moment = require('moment'),
    mysqlPool = mysql.createPool(),
    _ = require('lodash');

/**
 * Defines chnage passoword.
 * @class
 */
var hotelActual = function(){};

hotelActual.prototype.getDataEntryFields = function(req, res, callback){
   var  userId = req.session.user.Id,
        getDataEntryFieldsQuery = 'CALL hotel_getActualFields(?, ?, ?, ?)',        
        getLockStatusQuery = 'CALL hotel_getLockActualStatus(?,?,?)',
        params =[userId, req.body.projectId, req.body.projectYear, req.body.date],
        lockStatusParams = [req.body.projectYear, req.body.projectId,req.body.date],
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
                        result['dollarRate'] = rows1[0][0].dollarRate;
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
};

hotelActual.prototype.getDataEntryViewFields = function(req, res, callback){
   var  userId = req.session.user.Id,
        getDataEntryFieldsQuery = 'CALL  hotel_getActualView(?, ?, ?, ?)',
        params =[userId, req.body.projectId, req.body.projectMonth, req.body.projectYear];       
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

hotelActual.prototype.getLockActual = function(req, res, callback){
    var  userId = req.session.user.Id,
    getLockActualQuery = 'CALL hotel_getLockActual(?)',
    params =[userId];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getLockActualQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                var dbData = rows[0];
                console.log(dbData);
                data = _.chain(_.clone(dbData))
            	 .uniqBy("projectName")
            	 .value();
                 console.log(data);
                 _.each(data, function(value, key) {
            	 	var yearsData =  _.chain(_.clone(dbData))
            	 	 .filter(['projectName',value.projectName])                      
                      .uniqBy('periodYear')
            	 	 .map('periodYear')
            	 	 .value();
            	 	 value.yearsDates = {};
                      console.log(yearsData);
                      _.each(yearsData, function(value1, key1) {
                          console.log(value1);
                        value.yearsDates[value1] = _.chain(_.clone(dbData))
                                                    .filter(_.matches({ 'projectName':value.projectName,'periodYear':value1 }))
                                                    //.filter(['projectName',value.projectName])
                                                    //.filter(['periodYear',value1])
                                                    .map('Day')
                                                    .value();
                                                    
                      });
                    delete value.Day;

             	 });
                 
                callback(null, data);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
0 };

 hotelActual.prototype.unlockActual = function(req, res, callback){
    var  userId = req.session.user.Id,
    getUnlockActualQuery = 'CALL hotel_unlockActual(?,?,?,?)',
    params =[userId, req.body.projectYear,req.body.projectId, req.body.projectDay];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getUnlockActualQuery, params, function(err, rows, fields) {
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

hotelActual.prototype.save = function(req, res, callback) {
    var  userId = req.session.user.Id,
    isActive = 1,   
    saveActualQuery = 'CALL hotel_saveActual(?,?,?,?,?,?)';
    mysqlPool.getConnection(function(err, connection){
    async.each(req.body.actualData, function(actual, callback) {       
       params =[actual.periodId, actual.dataEntryFieldsId, actual.dayActual, actual.date, isActive, userId];
       connection.query(saveActualQuery, params, function(err, rows, fields) {
        if(err){
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

hotelActual.prototype.saveStatus = function(req, res, callback) {
    var  userId = req.session.user.Id,
         operatorId = 0,
         controllerId = 0,
    getActualStatusQuery = 'CALL hotel_saveActualStatus(?,?,?,?,?,?,?,?)';
    if(req.body.statusData.operator === 1) {
        operatorId = userId;
    } 
    if(req.body.statusData.controller === 1) {
        controllerId = userId;        
    }
    var params =[req.body.statusData.projectYear,req.body.statusData.projectId, req.body.statusData.date, operatorId, controllerId,req.body.operation,req.body.statusData.comment,req.body.statusData.dollarRate];
    console.log(params);
    mysqlPool.getConnection(function(err, connection){
        connection.query(getActualStatusQuery, params, function(err, rows, fields) {
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

module.exports = new hotelActual();
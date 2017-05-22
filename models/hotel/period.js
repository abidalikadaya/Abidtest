var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    _ = require('lodash');

var period = function(){};


period.prototype.save = function(req, res, callback){
   var  userId = req.session.user.Id
   		isActive = 1,
   		params =[req.body.projectId, req.body.periodYear, isActive, userId];
    savePeriodQuery = 'CALL hotel_savePeriod(?,?,?,?)';  
    mysqlPool.getConnection(function(err, connection){
        connection.query(savePeriodQuery, params, function(err, rows, fields) {
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

period.prototype.getByUserId = function(req, res, callback) {
	var  userId = req.session.user.Id,
		 params = [userId],
		 getPeriodQuery = 'CALL hotel_getPeriod(?)';  
    mysqlPool.getConnection(function(err, connection){
        connection.query(getPeriodQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                var dbData = rows[0];
            	data = _.chain(_.clone(dbData))
            	 .uniqBy("name")
            	 .value();

            	 _.each(data, function(value, key) {
            	 	var yearsData =  _.chain(_.clone(dbData))
            	 	 .filter(['name',value.name])
            	 	 .map('periodYear')
            	 	 .value();

            	 	 value.periodYear = yearsData;
             	 });
                callback(null, data);
            }else{
                connection.release();
                callback(true, null);
            }        
        });
    }); 
};

period.prototype.getByDashUserId = function(req, res, callback) {
	var  userId = req.session.user.Id,
		 // params = [userId],
        getPeriodQuery = 'CALL hotel_getDashPeriod()';  
        mysqlPool.getConnection(function(err, connection){
        connection.query(getPeriodQuery, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                var dbData = rows[0];
            	data = _.chain(_.clone(dbData))
            	 .uniqBy("name")
            	 .value();

            	 _.each(data, function(value, key) {
            	 	var yearsData =  _.chain(_.clone(dbData))
            	 	 .filter(['name',value.name])
            	 	 .map('periodYear')
            	 	 .value();

            	 	 value.periodYear = yearsData;
             	 });
                callback(null, data);
            }else{
                connection.release();
                callback(true, null);
            }        
        });
    }); 
};



module.exports = new period();


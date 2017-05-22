var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    async = require("async");

/**
 * Defines chnage passoword.
 * @class
 */
 var hotelForecast = function(){};

 hotelForecast.prototype.getFields = function(req, res, callback){
     var  userId = req.session.user.Id,
     getDataEntryFieldsQuery = 'CALL hotel_getForecastFields(?, ? ,?)',
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
 hotelForecast.prototype.save = function(req, res, callback) {
    var  userId = req.session.user.Id,
    isActive = 1,   
    saveForecastQuery = 'CALL hotel_saveForecast(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlPool.getConnection(function(err, connection){
    async.each(req.body.forecastData, function(forecast, callback) {
       params =[forecast.jan, forecast.feb, forecast.mar, forecast.apr,
       forecast.may, forecast.jun, forecast.jul, forecast.aug,
       forecast.sep, forecast.oct, forecast.nov, forecast.dec,
       forecast.total,  forecast.periodId, forecast.dataEntryFieldsId, isActive, 
       userId];
       connection.query(saveForecastQuery, params, function(err, rows, fields) {
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

module.exports = new hotelForecast();
var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    async = require("async"),
    _ = require('lodash');

/**
 * Defines dashboard.
 * @class
 */
 var dashboard = function(){};

 dashboard.prototype.getRevenue = function(req, res, callback){
     var  userId = req.session.user.Id,     
     getRevenueFieldsQuery = 'CALL hotel_getRevGraphData(?, ?)',     
     params =[req.body.projectId, req.body.projectYear];
     console.log(params);
     mysqlPool.getConnection(function(err, connection){
        connection.query(getRevenueFieldsQuery, params, function(err, rows, fields) {
            if(err){
                connection.release();
                callback(true, null);
            }else{
                connection.release();
                callback(null, rows[0]);
            }
        });
    });
 };

  dashboard.prototype.getDashOccupany = function(req, res, callback){
     var  userId = req.session.user.Id,
     getRevenueFieldsQuery = 'CALL hotel_getOccGraphData(?, ?)',
     params =[req.body.projectId, req.body.projectYear];
     mysqlPool.getConnection(function(err, connection){
        connection.query(getRevenueFieldsQuery, params, function(err, rows, fields) {
            if(err){
                connection.release();
                callback(true, null);
            }else{
                connection.release();
                var data = rows[0],
                    finalData = [];
                _.each(data , function(val, key){
                    var tempObj = {
                        hotelName: "",
                        Categories: [],
                        LineCategory: []
                    };
                    tempObj.hotelName = val.hotelName;
                    tempObj.Categories.push({'Name':'LYA', Value: val.ALYA || 0});
                    tempObj.Categories.push({'Name':'YTDA', Value: val.AYTDA || 0});
                    tempObj.Categories.push({'Name':'BYTD', Value: val.ABYTD || 0});
                    tempObj.LineCategory.push({'Name':'LYA', Value: val.OLYA || 0});
                    tempObj.LineCategory.push({'Name':'YTDA', Value: val.OYTDA || 0});
                    tempObj.LineCategory.push({'Name':'BYTD', Value: val.OBYTD || 0});
                    finalData.push(tempObj);
                });
                callback(null, finalData);
            }
        });
    });
 };

  dashboard.prototype.getDashScopeRevenue = function(req, res, callback){
     var  userId = req.session.user.Id,
     getRevenueFieldsQuery = 'CALL hotel_getSocRevGraphData(?, ?)',
     params =[req.body.projectId, req.body.projectYear];
     mysqlPool.getConnection(function(err, connection){
        connection.query(getRevenueFieldsQuery, params, function(err, rows, fields) {
            if(err){
                connection.release();
                callback(true, null);
            }else{
                connection.release();
                var data = rows[0],
                    finalData = [];
                    grandTotalRevenue = _.sumBy(data, 'TotalRevenue');
                _.each(data , function(val, key){
                    var tempObj = {};
                    tempObj.hotelName = val.hotelName;
                    tempObj.roomRevenue = val.RoomRevenue || 0;
                    tempObj.FBRevenue = val.FBRevenue || 0;
                    tempObj.otherRevenue = val.OtherRevenue || 0;
                    tempObj.revenue = val.TotalRevenue || 0;
                    tempObj.percentRevenue = (tempObj.revenue / grandTotalRevenue) * 100;
                    finalData.push(tempObj);
                });
                callback(null, finalData);
            }
        });
    });
 };

module.exports = new dashboard();
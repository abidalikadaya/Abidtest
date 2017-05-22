var mysql =	require("../db.js"),
    moment = require("moment"),
	mysqlPool = mysql.createPool();
/**
 * Defines Search Procurement operations.
 * @class
 */
var searchProc = function(){};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
searchProc.prototype.searchProcurement = function(req, res, callback){
    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss").toString(),
        id = req.session.user.Id,
        itemCode = '%'+ req.param('itemCode')+'%',
        searchProcQuery = 'SELECT * FROM product WHERE code like ?',
        params = [itemCode];
	mysqlPool.getConnection(function(err, connection){
		connection.query(searchProcQuery, params, function(err, rows, fields) {
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

module.exports = new searchProc();
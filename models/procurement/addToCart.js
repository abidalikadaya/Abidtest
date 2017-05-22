var mysql =	require("../db.js"),
    moment = require("moment"),
	mysqlPool = mysql.createPool();
/**
 * Defines Add To Cart operations.
 * @class
 */
var addToCart = function(){};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
addToCart.prototype.addToCart = function(req, res, callback){
    var nowDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss").toString(),
        initialStatus = 1,
        id = req.session.user.Id,
        addToCartQuery = 'INSERT INTO procurement(ProductId, Status, quantity, cartStatus, CreatedBy, CreatedDate) VALUES (?, '+initialStatus+', ?,1, '+id+', "'+nowDate+'")',
        params = [req.body.productId, req.body.quantity];
    mysqlPool.getConnection(function(err, connection){
        connection.query(addToCartQuery, params, function(err, rows, fields) {
            if(err){
                connection.release();
                callback(true, null);
            }else{
                connection.release();
                callback(null, true);
            }
        });
    });
}

module.exports = new addToCart();
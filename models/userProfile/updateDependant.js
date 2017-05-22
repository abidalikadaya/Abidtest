var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    moment = require("moment");

/**
 * Defines chnage passoword.
 * @class
 */
var updateDependant = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
updateDependant.prototype.updateByDependantID = function(req, res, callback){
    console.log(req.body);
   var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
    id = req.session.user.Id,
    isActive = 1,
    birthDate = moment(req.body.birthDate).format('YYYY-MM-DD');
    updateDependantDetailQuery = 'UPDATE userDependantDetails SET ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,? WHERE id = ?',
    params =[{userId : req.body.userId},
             {name: req.body.name},
             {nationality: req.body.nationality}, 
             {relation: req.body.relation},
             {gender:req.body.gender},
             {saudiOrExpat:req.body.saudiOrExpat},
             {iqamaID:req.body.iqamaID},
             {saudiID:req.body.saudiID},
             {mobileNumber:req.body.mobileNumber},
             {birthDate:req.body.birthDate},
             {isActive: isActive},
             {updatedBy: id},
             {updatedDate: nowDate},
              req.body.Id];
    mysqlPool.getConnection(function(err, connection){
        connection.query(updateDependantDetailQuery, params, function(err, rows, fields) {
            if(!!rows){
                connection.release();
                callback(null, rows);
            }else{
                connection.release();
                callback(true, null);
            }
        });
    });
};

module.exports = new updateDependant();
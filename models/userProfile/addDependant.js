var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    moment = require("moment");

/**
 * Defines chnage passoword.
 * @class
 */
var addDependant = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
addDependant.prototype.createNew = function(req, res, callback){
   var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        id = req.session.user.Id,
        isActive = 1,
        birthDate = moment(req.body.birthDate).format('YYYY-MM-DD');
        createUserQuery = 'INSERT INTO userDependantDetails(userID, name, nationality, relation, gender, saudiOrExpat, iqamaID, saudiID, mobileNumber, birthDate, isActive, createdBy, createdDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,'+id+', "'+nowDate+'")',
        params =[id, req.body.name, req.body.nationality, req.body.relation,req.body.gender,req.body.saudiOrExpat,req.body.iqamaID,req.body.saudiID,req.body.mobileNumber,birthDate,isActive];
        console.log(birthDate);
    mysqlPool.getConnection(function(err, connection){
        connection.query(createUserQuery, params, function(err, rows, fields) {
            console.log(rows);
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

module.exports = new addDependant();
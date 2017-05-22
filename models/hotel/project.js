var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
    multer = require("multer"),
    randomstring = require("randomstring"),
    storage = require('../../helpers/uploadFileBase.js');

/**
 * Defines chnage passoword.
 * @class
 */
var hotelProject = function(){};

/**
 * Chnage pass.
 * @Function
 * @param callback
 */

hotelProject.prototype.getAllProject = function(req, res, callback){
   var  isActive = 1;
        getHotelProjectQuery = 'CALL hotel_getProject(?, ?)',
        params =[isActive, 0];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getHotelProjectQuery, params, function(err, rows, fields) {
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

/**
 * Chnage pass.
 * @Function
 * @param callback
 */
hotelProject.prototype.getUserProject = function(req, res, callback){
   var  isActive = 1;
        userId = req.session.user.id,
        getHotelProjectQuery = 'CALL hotel_getProject(?, ?)',
        params =[isActive, userId];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getHotelProjectQuery, params, function(err, rows, fields) {
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

hotelProject.prototype.getProjectDataFields = function(req, res, callback){
   var  isActive = 1;
        getHotelProjectQuery = 'CALL hotel_getProjectFields(?,?)',
        params =[1,1];
    mysqlPool.getConnection(function(err, connection){
        connection.query(getHotelProjectQuery, params, function(err, rows, fields) {
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

hotelProject.prototype.save = function(req, res, callback){
    var id = req.session.user.Id,
        createHotelProjectQuery = 'CALL hotel_saveProject(?, ?, ?, ?, ?, ?, ?, ?,?)',
        params = [req.body.project.name,req.body.project.address,req.body.project.logo,
        req.body.project.currency,req.body.project.operator,
        req.body.project.controller,req.body.project.dashboard, id,req.body.project.id];
    mysqlPool.getConnection(function(err, connection){
        connection.query(createHotelProjectQuery, params, function(err, rows, fields) {
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

hotelProject.prototype.saveImage = function(req, res, callback){
    var filename = randomstring.generate(),
        storageMulter = storage.upload(req, res, '/hotel/',filename),
        uploadFile = multer({ "storage": storageMulter }).single('file');
    uploadFile(req,res,function(err){
        if(err){
            callback(true, null);
        }else{
            console.log("dsf",res.req.file);
            var path = "assets/uploads/hotel/"+res.req.file.filename;
            req.body.project.logo = path;
            console.log("save image",req.body);
            callback(false, req);
        }
    });
};

module.exports = new hotelProject();
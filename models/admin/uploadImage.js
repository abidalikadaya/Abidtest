var mysql =	require("../db.js"),
    mysqlPool = mysql.createPool(),
	multer = require("multer"),
    storage = require('../../helpers/uploadFileBase.js');

/**
 * Defines upload operations.
 * @class
 */
var upload = function(){};

/**
 * Set banner image.
 * @Function
 * @param callback
 */
upload.prototype.bannerImage = function(req, res, callback){
    var storageMulter = storage.upload(req, res, 'banner'),
        uploadFile = multer({ "storage": storageMulter }).single('file');
    uploadFile(req,res,function(err){
        if(err){
            callback({error:true,'message':err});
        }else{
            callback({success:true,"message":'Image uploaded successfully'});
        }
    })
};

/**
 * Set Company logo.
 * @Function
 * @param callback
 */
upload.prototype.companyImage = function(req, res, callback){
    var storageMulter = storage.upload(req, res, 'companyLogo'),
        uploadFile = multer({ "storage": storageMulter }).single('file');
    uploadFile(req,res,function(err){
        if(err){
            callback({error:true,'message':err});
        }else{
            callback({success:true,"message":'Company logo Image uploaded successfully'});
        }
    })
};

upload.prototype.companyLoginImage = function(req, res, callback){
     var storageMulter = storage.upload(req, res, 'companyLoginLogo'),
        uploadFile = multer({ "storage": storageMulter }).single('file');
    uploadFile(req,res,function(err){
        if(err){
            callback({error:true,'message':err});
        }else{
            callback({success:true,"message":'Company logo Image uploaded successfully'});
        }
    })
};

module.exports = new upload();
var multer = require('multer'),
	fs = require('fs');
/**
 * Defines upload operations.
 * @class
 */
var uploadFile = function(){};

/**
 * upload multer function.
 * @Function
 * @param callback
 */
uploadFile.prototype.upload = function(req, res, folderName, fileName){ 
    var dir = './client/assets/uploads/'+folderName,
        fileName = fileName || folderName;
    if(!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}
    return multer.diskStorage({
        destination: function (req, file, callback) {
            //console.log("ddsf",file);
           callback(null, './client/assets/uploads/'+folderName);
        },
        filename: function (req, file, cb) {
            //console.log("ddsf 1",file);
            var datetimestamp = Date.now();
            cb(null, fileName+".jpg");
        }
    });
}

module.exports = new uploadFile();
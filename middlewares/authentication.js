/**
 * Defines authentication operations.
 * @class
 */
var userAuthentication = function(){};

/**
 * Check authentication or throw error.
 * @Function
 * @param req
 * @param res
 * @param callback
 */
userAuthentication.prototype.checkUserAuthentication = function(req, res, next) {
    
    var  isUserAuthenticated = function(req) {
        var sess = req.session.user;
        if(!!sess && sess !== null){
            return true;
        }
        return false;
    }
    
    if (isUserAuthenticated(req)) {
        return next();
    }
    
    res.json({"error": true, "message": "User not authenticated"});
}

module.exports = new userAuthentication();
var mysql = require("../db.js"),
    moment = require("moment"),
    _ = require("lodash"),
    async = require("async"),
    mysqlPool = mysql.createPool();
/**
 * Defines application settings operations.
 * @class
 */
var applicationSetting = function () {};

/**
 * save settings.
 * @Function
 * @param callback
 */
applicationSetting.prototype.save = function (req, res, callback) {
    var id = req.session.user.Id,
        saveApplicationSettingQuery = 'CALL applicationSettingSave(?, ?, ?)';
    mysqlPool.getConnection(function (err, connection) {
        async.eachSeries(req.body.plugins, function (item, callback) {
            var params = [item.name, item.value, id];
            connection.query(saveApplicationSettingQuery, params, function (err, rows, fields) {
                if (err) {
                    callback(true);
                } else {
                    callback();
                }
            });
        }, function (err) {
            if (err) {
                connection.release();
                callback(true, null);
            } else {
                connection.release();
                callback(null, true);
            }
        });
    });
}

module.exports = new applicationSetting();
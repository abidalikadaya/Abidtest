var mysql =	require("../db.js"),
    nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport('smtps://sajidali.fateh@gmail.com:H@kimaS@jidali@smtp.gmail.com'),
    generatePassword = require('password-generator'),
	mysqlPool = mysql.createPool();
/**
 * Defines login operations.
 * @class
 */
var passwordReset = function(){};

/**
 * Authenticate user.
 * @Function
 * @param callback
 */
passwordReset.prototype.pwdReset = function(req, res, callback){
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' '),
        params = [req.body.emailAdderess],
        updateParams = [],
	    findEmailQuery = 'SELECT * FROM users WHERE emailAdderess = ?',
        updatepassWordReset = 'UPDATE users SET password = ? WHERE id = ?',
        randomPass = generatePassword(),
        mailOptions = {
            from: 'sajidali.fateh@gmail.com',
            to: '',
            subject: 'FAS : Updated password',
            html: ''
        };

	mysqlPool.getConnection(function(err, connection){
		connection.query(findEmailQuery, params, function(err, rows, fields) {
            rows = JSON.stringify(rows);
            rows = JSON.parse(rows);
            if(rows.length <= 0){
                connection.release();
                callback(true, "Email Doesnot exist");
            }else{
                updateParams = [ randomPass, rows[0].id];
                mailOptions.to = params[0];
                mailOptions.html = "Hi "+rows[0].userName+"<br>"+
                                    "Your updated password is <b>"+randomPass+"</b><br><br>"+
                                    "<b>FAS - Real Estate</b>";
                connection.query(updatepassWordReset, updateParams, function(err, rows, fields) {
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            callback(true, "Error sending mail. please try again !!");
                        }else{
                            connection.release();
                            callback(null, rows);
                        }
                    });
                });
            }
		});
	});
}

module.exports = new passwordReset();
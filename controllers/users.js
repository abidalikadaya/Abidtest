var express = require('express'),
  router = express.Router(),
  //User = require('../models/user'),
  userInfo = require('../models/users/userInfo.js'),
  signup = require('../models/users/signup.js'),
  login = require('../models/users/login.js'),
  logout = require('../models/users/logout.js'),
  authentication = require('../middlewares/authentication.js'),
  passwordReset = require('../models/users/passwordReset.js');


router.get('/check/authentication', authentication.checkUserAuthentication, function(req, res) {
  res.json({success:true, 'message': 'User is authenticated'});
});

router.get('/getAllUsers', authentication.checkUserAuthentication, function(req, res) {
  userInfo.getAllUserInfo(function(err, data) {
    res.json({ 'users': data });
  });
});

router.post('/signup', function(req, res) {
  User.forge({
      email: req.body.email,
      mobile: req.body.mobile,
      user_type: req.body.user_type,
      user_name: req.body.user_name,
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      manager_id: req.body.manager_id,
      password: req.body.password,
      department_id: req.body.department_id
    })
    .save()
    .then(function(user) {
      res.json(user);
    })
    .catch(function(err) {
      console.log(err);
      console.log(err.stack);
      res.status(500).json({ error: true, data: { message: err.message } });
    });

});

router.post('/login', function(req, res) {
  login.loginUser(req, res, function(err, data) {
    if (err) {
      res.json({ 'error': true, 'message': 'Error logged in' });
    } else {
      res.json({ 'success': true, 'data': data });
    }
  });
  // User.login(req.body.user_name, req.body.password)
  //   .then(function(user) {
  //     if (user) {
  //       res.json({ 'success': true, "data": user });
  //     } else {
  //       res.json({ 'success': false });
  //     }
  //   })
  //   .catch(function(error) {
  //     res.json({ 'error': true, 'message': 'Error getting user information' });
  //   });
});

router.post('/logout', function(req, res) {
  logout.logoutUser(req, res, function(err, data) {
    if (err) {
      res.json({ 'error': data.error, 'message': data.message });
    } else {
      res.json({ 'passwordResetcess': data.success, 'message': data.message });
    }
  });
});

router.post('/password/reset', function(req, res) {
  passwordReset.pwdReset(req, res, function(err, data) {
    if (err) {
      res.json({ 'error': true, 'message': data });
    } else {
      res.json({ 'success': true, 'message': "Changed successfully" });
    }
  });
});

module.exports = router;

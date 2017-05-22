var express = require('express'),
  router = express.Router(),
  authentication = require('../middlewares/authentication.js'),
  uploadBanner = require('../models/admin/uploadImage.js'),
  passwordChange = require('../models/admin/changePassword.js'),
  createUser = require('../models/admin/userCreate.js'),
  getPlugin = require('../models/admin/getPlugin.js'),
  getRoles = require('../models/admin/getRoles.js'),
  getManager = require('../models/admin/getManager.js'),
  isUserExists = require('../models/admin/isUserExists.js'),
  emailSetting = require('../models/admin/createEmailSetting.js');


router.post('/upload/banner/image', authentication.checkUserAuthentication, function(req, res) {
  uploadBanner.bannerImage(req, res,function(data){
    res.json(data);
  });
});

router.post('/upload/company/logo', authentication.checkUserAuthentication, function(req, res) {
  uploadBanner.companyImage(req, res,function(data){
    res.json(data);
  });
});

router.post('/upload/companylogin/logo', authentication.checkUserAuthentication, function(req, res) {
  uploadBanner.companyLoginImage(req, res,function(data){
    res.json(data);
  });
});

router.get('/plugins',authentication.checkUserAuthentication, function(req,res) {
  getPlugin.getActivePlugin(req, res, function(err, data) {
      if (err) {
        res.json({ 'error': true, 'message': 'Error in selecting plugin' });
      } else {
        res.json({ 'success': true, 'data': data });
      }
    });
});

router.get('/roles/:pluginId', authentication.checkUserAuthentication, function(req,res) {
  getRoles.byPluginID(req, res, function(err, data) {
    if(err) {
      res.json({ 'error': true, 'message': 'Error in selecting roles'});
    } else {
      res.json({ 'success': true, 'data': data });
    }
  });
});

router.get('/all/roles', authentication.checkUserAuthentication, function(req,res) {
  getRoles.all(req, res, function(err, data) {
    if(err) {
      res.json({ 'error': true, 'message': 'Error in selecting roles'});
    } else {
      res.json({ 'success': true, 'data': data });
    }
  });
});

router.get('/getManager',authentication.checkUserAuthentication,function(req,res){
  getManager.byManagerId(req,res,function(err,data){
    if(err){
      res.json({ 'error': true, 'message': 'Error in selecting roles'});
    }else{
      res.json({ 'success': true, 'data': data });
    }
  });

});

router.get('/getUser/username/:username',authentication.checkUserAuthentication,function(req,res){
  console.log(req.params);
  isUserExists.byUserName(req,res,function(err,data){
    if(err){
      res.json({ 'error': true, 'message': 'Error in selecting username'});
    }else{
      res.json({ 'success': true, 'data': data });
    }
  });

});

router.get('/getUser/emailAddress/:emailAddress',authentication.checkUserAuthentication,function(req,res){
  isUserExists.byEmailAddress(req,res,function(err,data){
    if(err){
      res.json({ 'error': true, 'message': 'Error in selecting emailAddress'});
    }else{
      res.json({ 'success': true, 'data': data });
    }
  });

});

router.post('/emailSetting/save',authentication.checkUserAuthentication,function(req,res){
  emailSetting.create(req,res,function(err,data){
    if(err){
      console.log(err);
      res.json({ 'error': true, 'message': 'Error in creating emailSetting'});
    }else{
      res.json({ 'success': true, 'data': data });
    }
  });
});

router.post('/user/save',authentication.checkUserAuthentication,function(req,res){
  createUser.createNew(req,res,function(err,data){
    if(err){
      res.json({ 'error': true, 'message': 'Error in creating user account'});
    }else{
      res.json({ 'success': true, 'data': data });
    }
  });
});

/*router.post('/chnage/password', authentication.checkUserAuthentication, function(req, res) {
  passwordChange.changePwd(req, res,function(data){
    
  });
});*/

module.exports = router;
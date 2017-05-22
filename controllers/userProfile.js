var express = require('express'),
  router = express.Router(),
  authentication = require('../middlewares/authentication.js'),
  addDependant = require('../models/userProfile/addDependant.js'),
  updateDependant = require('../models/userProfile/updateDependant.js'),
  getDependant = require('../models/userProfile/getDependant.js'); 


  router.post('/addDependant', authentication.checkUserAuthentication, function(req, res) {
    addDependant.createNew(req, res, function(err, data) {
      if (err) {
        res.json({ 'error': true, 'message': 'Error in saving user dependant' });
      } else {
        res.json({ 'success': true, 'data': data });
      }
    });
  });

  router.get('/getDependant', authentication.checkUserAuthentication, function(req, res) {
    getDependant.getByUserID(req, res, function(err, data) {
      if (err) {
        res.json({ 'error': true, 'message': 'Error in selecting user dependant' });
      } else {
        res.json({ 'success': true, 'data': data });
      }
    });
  });

  router.post('/updateDependant', authentication.checkUserAuthentication, function(req, res) {
    updateDependant.updateByDependantID(req, res, function(err, data) {
      if (err) {
        res.json({ 'error': true, 'message': 'Error in updating user dependant' });
      } else {
        res.json({ 'success': true, 'data': data });
      }
    });
  });

  module.exports = router;
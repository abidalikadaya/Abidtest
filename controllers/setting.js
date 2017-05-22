var express = require('express')
  , router = express.Router()
  , async = require('async')
  , authentication = require('../middlewares/authentication.js')
  , appSetting = require('../models/setting/createApplicationSetting.js')
  , pluginSetting = require('../models/setting/getPluginSetting.js');


  
router.post('/save', authentication.checkUserAuthentication, function(req, res) {
	appSetting.save(req, res,function(err, data){
		if(err){
            return res.json({'error': true});
        }else{
            res.json({'success': true, 'message': 'data added successfully'});
        }
	});
});

router.get('/getPlugins', authentication.checkUserAuthentication, function(req, res) {
	pluginSetting.get(req, res,function(err, data){
		if(err){
            return res.json({'error': true});
        }else{
            res.json({'data': data});
        }
	});
});


module.exports = router;
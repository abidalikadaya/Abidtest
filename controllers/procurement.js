var express = require('express')
  , router = express.Router()
  , async = require('async')
  , addProc = require('../models/procurement/addProc.js')
  , addCart = require('../models/procurement/addToCart.js')
  , getProc = require('../models/procurement/getProc.js')
  , updateProc = require('../models/procurement/updateProc.js')
  , searchProc = require('../models/procurement/searchProc.js')
  , authentication = require('../middlewares/authentication.js')
  , getProcAudit = require('../models/procurement/getProcAudit.js');

  
router.post('/add/procurement', authentication.checkUserAuthentication, function(req, res) {
	addProc.addProcurement(req, res,function(err, data){
		if(err){
            return res.json({'error': true});
        }else{
            res.json({'success': true, 'message': 'data added successfully'});
        }
	});
});

router.post('/add/cart', authentication.checkUserAuthentication, function(req, res) {
  addCart.addToCart(req, res,function(err, data){
    if(err){
            return res.json({'error': true});
        }else{
            res.json({'success': true, 'message': 'data added successfully'});
        }
  });
});

router.get('/search/product/item', authentication.checkUserAuthentication, function(req, res) {
	searchProc.searchProcurement(req, res,function(err, data){
		if(err){
            return res.json({'error': true});
        }else{
            res.json({'data': data});
        }
	});
});

router.get('/get/procurement', authentication.checkUserAuthentication, function(req, res) {
  async.parallel([
      function(callback){
          getProc.getPendingApprovalForUsers(req, res, function(err, data){
            callback(null, data);
          });
      },
      function(callback){
          getProc.getPendingApprovalForManagerProcurement(req, res, function(err, data){
            callback(null, data);
          });
      },
      function(callback){
          getProc.getPendingApprovalForDeptProcurement(req, res, function(err, data){
            callback(null, data);
          });
      },
      function(callback){
          getProc.getMyClosedProcurement(req, res, function(err, data){
            callback(null, data);
          });
      },
      function(callback){
          getProc.getMyCartData(req, res, function(err, data){
            callback(null, data);
          });
      }
  ],
  // optional callback
  function(err, results){
      var requestRaisedByMe = results[0],
        managerPendingApproval = results[1],
        departmentPendingApproval = results[2],
        closedRequest = results[3],
        cartData = results[4],
        pendingApproval = (req.session.user.isManager === 1 && req.session.user.departmentId === 0) ? results[1] : results[2];
    var finalObj = {
        requestedByMe : requestRaisedByMe,
        pendingApproval: pendingApproval,
        closedRequest : closedRequest,
        addToCart : cartData
    }
      if(err){
        res.json({error:true, message:'error fetching data'});
      }else{
        res.json({success:true, data:finalObj});
      }
  });
});

router.post('/update/procurement', authentication.checkUserAuthentication, function(req, res) {
	updateProc.updateProcurement(req, res, function(err, data){
		if(err){
            res.json({error:true, message:'error updating data'});
        }else{
            res.json({success:true, message :'Record updated successfully'});
        }
	});
});

router.get('/get/procurementAudit/:procurementId', authentication.checkUserAuthentication, function(req, res) {
	getProcAudit.getProcurementAudit(req, res, function(err, data){
		if(err){
            return res.json({'error': true});
        }else{
            res.json({'success': true, 'auditData': data});
            //return data;
        }
	});
});

module.exports = router;
var express = require('express'),
  router = express.Router(),
  authentication = require('../middlewares/authentication.js'),
  project = require('../models/hotel/project.js'),
  budget = require('../models/hotel/budget.js'),
  PNL = require('../models/hotel/PNL.js'),
  forecast = require('../models/hotel/forecast.js'),
  actual = require('../models/hotel/actual.js'),
  cashflow = require('../models/hotel/cashFlow.js'),
  period = require('../models/hotel/period.js'),
  dashboard = require('../models/hotel/dashboard.js'),
  async = require('async'),
  _ = require("lodash");

router.post('/projects/save', authentication.checkUserAuthentication, function (req, res) {
  console.log("hotel", req.body);
  async.waterfall([
      function (cb) {
        if (!!req.body.project) {
          cb(null, req);
        } else {
          project.saveImage(req, res, function (err, data) {
            if (!err) {
              console.log(data);
              cb(null, data);
            }
          });
        }
      },
      function (req, cb) {
        project.save(req, res, function (err, data) {
          if (!err) {
            console.log(data);
            cb(null, data);
          }
        });
      }
    ],
    function (err, result) {
      if (err) {
        res.json({
          'error': true,
          'message': 'Error in project save'
        });
      } else {
        res.json({
          'success': true,
          'data': result
        });
      }
    });
});

router.get('/period', authentication.checkUserAuthentication, function (req, res) {
  period.getByUserId(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting hotel period'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.get('/dashboard/period', authentication.checkUserAuthentication, function (req, res) {
  period.getByDashUserId(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting hotel period'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/period/save', authentication.checkUserAuthentication, function (req, res) {
  period.save(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in period save'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});



router.get('/allProjects', authentication.checkUserAuthentication, function (req, res) {
  project.getAllProject(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting hotel projects'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.get('/userProjects', authentication.checkUserAuthentication, function (req, res) {
  project.getUserProject(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting hotel projects'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.get('/projects/datafields', authentication.checkUserAuthentication, function (req, res) {
  project.getProjectDataFields(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting plugin'
      });
    } else {
      var finalData = _.groupBy(data, "field");
      res.json({
        'success': true,
        'data': finalData
      });
    }
  });
});

router.post('/actual', authentication.checkUserAuthentication, function (req, res) {
  actual.getDataEntryFields(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting actual fields'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});
router.post('/actual/view', authentication.checkUserAuthentication, function (req, res) {
  actual.getDataEntryViewFields(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting actual fields'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/actual/save', authentication.checkUserAuthentication, function (req, res) {
  var executablefn = [];
  var saveActual = function (cb) {
    actual.save(req, res, function (err, data) {
      if (!err) {
        cb(null, data);
      }else{
        cb(true, null);
      } 
    });
  };

  var saveStatus = function (args, cb) {
    actual.saveStatus(args, res, function (err, data) {
      if (!err) {
        cb(null, data);
      }else{
        cb(true, null);
      } 
    });
  };

 if(req.body.operation != 'save') {
   executablefn = [saveActual,saveStatus];
 } else{
  executablefn = [saveActual];
 }  
  async.waterfall(
    executablefn
  , function (err, result) {    
      if (err) {
        res.json({
          'error': true,
          'message': 'Error in project save'
        });
      } else {
        res.json({
          'success': true,
          'data': true
        });
      }
    });



  // actual.save(req, res, function(err, data) {
  //     if (err) {
  //       res.json({ 'error': true, 'message': 'Error in saving  actual fields' });
  //     } else {
  //       res.json({ 'success': true, 'data': data });
  //     }
  //   });
});
router.get('/actual/lock', authentication.checkUserAuthentication, function (req, res) {
  actual.getLockActual(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in lock actual get'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});
router.post('/actual/unlock', authentication.checkUserAuthentication, function (req, res) {
  actual.unlockActual(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in saving  unockActual'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/PNL', authentication.checkUserAuthentication, function (req, res) {
  PNL.getFields(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting PNL Fields'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/budget', authentication.checkUserAuthentication, function (req, res) {
  budget.getFields(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting budget Fields'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/budget/save', authentication.checkUserAuthentication, function (req, res) {
  var executablefn = [];
  var saveBudget = function (cb) {
    budget.save(req, res, function (err, data) {
      if (!err) {
        cb(null, data);
      }else{
        cb(true, null);
      } 
    });
  };

  var saveStatus = function (args, cb) {
    budget.saveStatus(args, res, function (err, data) {
      if (!err) {
        cb(null, data);
      }else{
        cb(true, null);
      } 
    });
  };

 if(req.body.operation != 'save') {
   executablefn = [saveBudget,saveStatus];
 } else{
  executablefn = [saveBudget];
 }  
  async.waterfall(
    executablefn
  , function (err, result) {    
      if (err) {
        res.json({
          'error': true,
          'message': 'Error in project save'
        });
      } else {
        res.json({
          'success': true,
          'data': true
        });
      }
    });

  // budget.save(req, res, function (err, data) {
  //   if (err) {
  //     res.json({
  //       'error': true,
  //       'message': 'Error in budget save'
  //     });
  //   } else {
  //     res.json({
  //       'success': true,
  //       'data': data
  //     });
  //   }
  // });
});

router.post('/PNL/save', authentication.checkUserAuthentication, function (req, res) {
  var executablefn = [];
  var savePNL = function (cb) {
    PNL.save(req, res, function (err, data) {
      if (!err) {
        cb(null, data);
      }else{
        cb(true, null);
      } 
    });
  };  
 
  executablefn = [savePNL];
  async.waterfall(
    executablefn
  , function (err, result) {    
      if (err) {
        res.json({
          'error': true,
          'message': 'Error in project save'
        });
      } else {
        res.json({
          'success': true,
          'data': true
        });
      }
    });
});

router.get('/budget/lock', authentication.checkUserAuthentication, function (req, res) {
  budget.getLockBudget(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in lock budget get'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});
router.post('/budget/unlock', authentication.checkUserAuthentication, function (req, res) {
  budget.unlockBudget(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in unlockBudget'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/forecast', authentication.checkUserAuthentication, function (req, res) {
  forecast.getFields(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting forecast Fields'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/forecast/save', authentication.checkUserAuthentication, function (req, res) {
  forecast.save(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in forecast save'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/cashflow', authentication.checkUserAuthentication, function (req, res) {
  cashflow.getFields(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting cashFlow data'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});
router.post('/cashflow/save', authentication.checkUserAuthentication, function (req, res) {
  cashflow.save(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in cashflow save'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.get('/projects/:id', authentication.checkUserAuthentication, function (req, res) {
  project.getProject(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in selecting hotel projects'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/dashboard/revenue', authentication.checkUserAuthentication, function (req, res) {
  dashboard.getRevenue(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in getting revenue data'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/dashboard/occupany', authentication.checkUserAuthentication, function (req, res) {
  dashboard.getDashOccupany(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in getting revenue data'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

router.post('/dashboard/scopeRevenue', authentication.checkUserAuthentication, function (req, res) {
  dashboard.getDashScopeRevenue(req, res, function (err, data) {
    if (err) {
      res.json({
        'error': true,
        'message': 'Error in getting revenue data'
      });
    } else {
      res.json({
        'success': true,
        'data': data
      });
    }
  });
});

module.exports = router;
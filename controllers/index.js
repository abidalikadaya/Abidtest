var express = require('express')
  , router = express.Router();
  
router.use('/api/users', require('./users'));
router.use('/api/procurement', require('./procurement'));
router.use('/api/admin', require('./admin'));
router.use('/api/userProfile', require('./userProfile'));
router.use('/api/setting', require('./setting'));
router.use('/api/hotel', require('./hotel'));

module.exports = router;
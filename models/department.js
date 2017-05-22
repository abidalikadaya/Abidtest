var Bookshelf = require('./base');
var Promise = require('bluebird');
var User = require('./user');

var Department = Bookshelf.Model.extend({
  tableName: 'departments'
});


module.exports = Department;

var Bookshelf = require('./base');
var Promise = require('bluebird');

var Procurement = Bookshelf.Model.extend({
    tableName: 'procurements',
    created_by: function () {
      return this.belongsTo('users', 'created_by_id');
    },
});


module.exports = Procurement;

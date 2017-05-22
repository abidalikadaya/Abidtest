var Bookshelf = require('./base');
var Promise = require('bluebird');
var User = require('./user');
var Procurement = require('./procurement');

var ProcurementAudit = Bookshelf.Model.extend({
  tableName: 'procurement_audits',
  approver: function() {
    return this.belongsTo(User, 'approver_id');
  },

  procurement: function() {
    return this.belongsTo(Procurement, 'procurement_id');
  },
});


module.exports = ProcurementAudit;

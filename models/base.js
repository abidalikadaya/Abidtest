var config = require('../config');
var _ = require('lodash');
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: config.db.host,
    user: config.db.username,
    password: config.db.password,
    database: config.db.db_name,
    charset: 'utf8'
  }
});
var bookshelf = require('bookshelf');
var baseBookshelf = bookshelf(knex);
var UserModel = null;
proto = baseBookshelf.Model.prototype;
baseBookshelf.Model = baseBookshelf.Model.extend({
  // Bookshelf `hasTimestamps` - handles created_at and updated_at properties
  hasTimestamps: true,

  created_by: function() {
    if (!UserModel) {
      UserModel = require('./user');
    }
    return this.belongsTo(UserModel, 'created_by');
  },

  updated_by: function() {
    if (!UserModel) {
      UserModel = require('./user');
    }
    return this.belongsTo(User, 'updated_by');
  },

  deleted_by: function() {
    if (!UserModel) {
      UserModel = require('./user');
    }
    return this.belongsTo(User, 'deleted_by');
  },

  creating: function creating(newObj, attr, options) {
    if (!this.get('created_by')) {
      this.set('created_by', 1);
    }
  },

  saving: function saving(newObj, attr, options) {
    // Remove any properties which don't belong on the model
    // this.attributes = this.pick(this.permittedAttributes());
    // Store the previous attributes so we can tell what was updated later
    // this._updatedAttributes = newObj.previousAttributes();

    // this.set('updated_by', this.contextUser(options));
    this.set('updated_by', 1);
  },

  initialize: function initialize() {
    var self = this,
      options = arguments[1] || {};

    // make options include available for toJSON()
    if (options.include) {
      this.include = _.clone(options.include);
    }

    this.on('creating', this.creating, this);
    this.on('saving', function onSaving(model, attributes, options) {
      return Promise.resolve(self.saving(model, attributes, options)).then(function then() {
        return true;
        // return self.validate(model, attributes, options);
      });
    });
  },

  // Get the user from the options object
  contextUser: function contextUser(options) {
    // Default to context user
    if ((options.context && options.context.user) || (options.context && options.context.user === 0)) {
      return options.context.user;
      // Other wise use the internal override
    } else if (options.context && options.context.internal) {
      return 1;
    } else if (options.context && options.context.external) {
      return 0;
    } else {
      throw new Error('models.base.missingContext');
    }
  },
});

module.exports = baseBookshelf

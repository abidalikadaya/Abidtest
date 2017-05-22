var Bookshelf = require('./base');
var Promise = require('bluebird');

var Product = Bookshelf.Model.extend({
    tableName: 'Products'

});

module.exports = Product;

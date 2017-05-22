var Bookshelf = require('./base');
var Promise = require('bluebird');
var Department = require('./department');

var User = Bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,

  manager: function() {
    return this.hasOne(User, 'manager_id');
  },

  department: function() {
    return this.hasOne(Department, 'department_id');
  }
}, {
  // login: Promise.method(function(email, password) {
  //   if (!email || !password) throw new Error('Email and password are both required');
  //   return new this({ email: email.toLowerCase().trim() })
  //     .fetch({ require: true })
  //     .tap(function(customer) {
  //       return bcrypt.compareAsync(password, customer.get('password'))
  //         .then(function(res) {
  //           if (!res) throw new Error('Invalid password');
  //         });
  //     });
  // }),
  login: Promise.method(function(user_name, password) {
    var enc_pwd = password;
    return new User({ 'user_name': user_name, 'password': enc_pwd })
      .fetch()
  })
});


module.exports = User;

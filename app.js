var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
//var config = require('./config');
var morgan = require('morgan');
var session = require('express-session');
var db = require('./models/db.js');
var server_ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0' ;
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000 ;
// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: config.db.host,
//     user: config.db.username,
//     password: config.db.password,
//     database: config.db.db_name,
//     charset: 'utf8'
//   }
// });

// var Bookshelf = require('bookshelf')(knex);
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

morgan.token('res', function getId(res) {
  return res;
});

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });

app.use(morgan(':req[body] :res[body]', { stream: accessLogStream }));



app.use(bodyParser.json());

 app.use(bodyParser.urlencoded({
     extended: true
 }));
app.use(require('./controllers'));

app.use('/', express.static(__dirname + '/client'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
//app.set('db', knex);
app.use(function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.listen(server_port,server_ip, function() {
  console.log("Connected on port 3000.");
});

// module.exports = {
//   knex: knex,
//   Bookshelf: Bookshelf
// };

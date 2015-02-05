var express = require('express');
var app = express();
var Firebase = require('firebase');
var body = require('body-parser');

app.set('view engine', 'jade');
app.set('views', __dirname);
app.use(body.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/', function(req, res) {
  console.log('req.body is', req.body);
  res.send(200);
});

app.listen(3003);

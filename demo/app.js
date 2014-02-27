
var weixin = require('../index')
, http = require('http');;

var app = weixin();

http.createServer(app).listen(3000);

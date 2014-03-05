var weixin = require('../index');

var express = require('express');
var app = express();

var weixinConfig = {
		token: 'token',
		appid: 'appid',
		secret: 'secret'
};

app.use('/', weixin.checkSignature(weixinConfig));
app.use('/', weixin.msgParser());
//app.use('/weixin', weixin.);

app.listen(80);

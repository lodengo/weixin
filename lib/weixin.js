var request = require('request'), sha1 = require('crypto').createHash('sha1'), xml2js = require('xml2js');

/*
 * 
 */
var weixin = module.exports = function weixin(config) {
	this.appid = config.appid;
	this.secret = config.secret;
	this.access_token = {
		access_token : null,
		expires_at : 0
	};
};

weixin.prototype.checkSignature = function(signature, timestamp, nonce, callback){
	var self = this;
	self.token(function(token){
		var array = [token, timestamp, nonce];
		array.sort();		
		var str = sha1.update(array.join("")).digest('hex');
		callback(str == signature);
	});	
}

/*
 * 
 */
weixin.prototype.token = function(callback) {
	var self = this;
	if (self.access_token.access_token
			&& self.access_token.expires_at > Date.parse(new Date())) {
		callback(self.access_token.access_token);
	} else {
		var options = {
			method : 'GET',
			uri : 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
			qs : {
				appid : self.appid,
				secret : self.secret
			},
			json : true
		};
		request(options, function(e, r, b) {
			if (!e && b.access_token) {
				self.access_token.access_token = b.access_token;
				self.access_token.expires_at = Date.parse(new Date())
						+ b.expires_in * 1000;
				callback(self.access_token.access_token);
			} else {
				console.log(b);
				callback(null);
			}
		});
	}
};

weixin.prototype.media_upload = function(type) {
	var self = this;
	self.token(function(token) {
		var options = {
			method : 'POST',
			uri : 'http://file.api.weixin.qq.com/cgi-bin/media/upload',
			qs : {
				access_token : token,
				type : type
			},
			json : true
		};
		request(options, function(e, r, b) {
			
		});
	});
};

weixin.prototype.media_get = function() {

};

weixin.prototype.send_text = function(touser, content) {
	var self = this;
	self.token(function(token) {
		var options = {
			method : 'POST',
			uri : 'https://api.weixin.qq.com/cgi-bin/message/custom/send',
			qs : {
				access_token : token
			},
			json : {
				touser : touser,
				msgtype : 'text',
				text : {
					content : content
				}
			}
		};
		request(options, function(e, r, b) {

		});
	});
};

weixin.prototype.send_image = function(touser, media_id) {
	var self = this;
	self.token(function(token) {
		var options = {
			method : 'POST',
			uri : 'https://api.weixin.qq.com/cgi-bin/message/custom/send',
			qs : {
				access_token : token
			},
			json : {
				touser : touser,
				msgtype : 'image',
				image : {
					media_id : media_id
				}
			}
		};
		request(options, function(e, r, b) {

		});
	});
};

weixin.prototype.send_voice = function(touser, media_id) {
	var self = this;
	self.token(function(token) {
		var options = {
			method : 'POST',
			uri : 'https://api.weixin.qq.com/cgi-bin/message/custom/send',
			qs : {
				access_token : token
			},
			json : {
				touser : touser,
				msgtype : 'voice',
				voice : {
					media_id : media_id
				}
			}
		};
		request(options, function(e, r, b) {

		});
	});
};

weixin.prototype.send_video = function(touser, media_id, title, description) {
	var self = this;
	self.token(function(token) {
		var options = {
			method : 'POST',
			uri : 'https://api.weixin.qq.com/cgi-bin/message/custom/send',
			qs : {
				access_token : token
			},
			json : {
				touser : touser,
				msgtype : 'video',
				video : {
					media_id : media_id,
					title: title,
					description: description
				}
			}
		};
		request(options, function(e, r, b) {

		});
	});
};

weixin.prototype.send_music = function(touser, musicurl, thumb_media_id, hqmusicurl, title, description) {
	var self = this;
	self.token(function(token) {
		var options = {
			method : 'POST',
			uri : 'https://api.weixin.qq.com/cgi-bin/message/custom/send',
			qs : {
				access_token : token
			},
			json : {
				touser : touser,
				msgtype : 'music',
				music : {
					musicurl : musicurl,
					thumb_media_id: thumb_media_id,
					hqmusicurl: hqmusicurl || musicurl,
					title: title,
					description: description
				}
			}
		};
		request(options, function(e, r, b) {

		});
	});
};

weixin.prototype.send_news = function(touser, articles) {
	var self = this;
	self.token(function(token) {
		var options = {
			method : 'POST',
			uri : 'https://api.weixin.qq.com/cgi-bin/message/custom/send',
			qs : {
				access_token : token
			},
			json : {
				touser : touser,
				msgtype : 'news',
				news : {
					articles: articles || []
				}
			}
		};
		request(options, function(e, r, b) {

		});
	});
};

weixin.prototype.user_get = function(next_openid, callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'GET',
				uri: 'https://api.weixin.qq.com/cgi-bin/user/get',
				qs: {access_token : token, next_openid: next_openid},
				json: true
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.user_info = function(openid, callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'GET',
				uri: 'https://api.weixin.qq.com/cgi-bin/user/info',
				qs: {access_token : token, openid: openid},
				json: true
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.groups_get = function(callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'GET',
				uri: 'https://api.weixin.qq.com/cgi-bin/groups/get',
				qs: {access_token : token},
				json: true
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.groups_create = function(name, callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'POST',
				uri: 'https://api.weixin.qq.com/cgi-bin/groups/create',
				qs: {access_token : token},
				json: {group: {name: name}}
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.groups_update = function(id, name, callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'POST',
				uri: 'https://api.weixin.qq.com/cgi-bin/groups/update',
				qs: {access_token : token},
				json: {group: {id: id, name: name}}
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.groups_members_update = function(openid, to_groupid, callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'POST',
				uri: 'https://api.weixin.qq.com/cgi-bin/groups/members/update',
				qs: {access_token : token},
				json: {openid: openid, to_groupid: to_groupid}
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.groups_getid = function(openid, callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'POST',
				uri: 'https://api.weixin.qq.com/cgi-bin/groups/getid',
				qs: {access_token : token},
				json: {openid: openid}
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.menu_create = function(buttons, callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'POST',
				uri: ' https://api.weixin.qq.com/cgi-bin/menu/create',
				qs: {access_token : token},
				json: {button: buttons}
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.menu_get = function(callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'GET',
				uri: ' https://api.weixin.qq.com/cgi-bin/menu/get',
				qs: {access_token : token},
				json: true
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.menu_delete = function(callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'GET',
				uri: ' https://api.weixin.qq.com/cgi-bin/menu/delete',
				qs: {access_token : token},
				json: true
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.qrcode_create = function(data, callback){
	var self = this;
	self.token(function(token) {
		var options = {
				method: 'POST',
				uri: ' https://api.weixin.qq.com/cgi-bin/qrcode/create',
				qs: {access_token : token},
				json: data
		};
		request(options, function(e, r, b){
			var err = b.errcode ? b : null;
			callback(err, b);
		});
	});
};

weixin.prototype.showqrcode = function(ticket, callback){	
	var options = {
			method: 'GET',
			uri: ' https://mp.weixin.qq.com/cgi-bin/showqrcode',
			qs: {ticket : ticket},
			json: true
	};
	request(options, function(e, r, b){
		var err = b.errcode ? b : null;
		callback(err, b);
	});	
};



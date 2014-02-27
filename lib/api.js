var request = require('request'), sha1 = require('crypto').createHash('sha1'), xml2js = require('xml2js');

/*
 * 
 */
var Api = module.exports = function Api() {

};

Api.checkSignature = function(token, signature, timestamp, nonce, callback) {
	var array = [ token, timestamp, nonce ];
	array.sort();
	var pass = (str == sha1.update(array.join("")).digest('hex'));
	callback(pass);
}

/*
 * 
 */
Api.token = function(appid, secret, callback) {
	var options = {
		method : 'GET',
		uri : 'https://api.Api.qq.com/cgi-bin/token?grant_type=client_credential',
		qs : {
			appid : appid,
			secret : secret
		},
		json : true
	};
	request(options, function(e, r, b) {
		if (!e && b.access_token) {			
			callback(null, b.access_token);
		} else {			
			callback(b, null);
		}
	});
};

Api.media_upload = function(token, type, callback) {
	var options = {
		method : 'POST',
		uri : 'http://file.api.Api.qq.com/cgi-bin/media/upload',
		qs : {
			access_token : token,
			type : type
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.media_get = function() {

};

Api.send_text = function(token, touser, content, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/message/custom/send',
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
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.send_image = function(token, touser, media_id, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/message/custom/send',
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
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.send_voice = function(token, touser, media_id, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/message/custom/send',
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
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.send_video = function(token, touser, media_id, title, description, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/message/custom/send',
		qs : {
			access_token : token
		},
		json : {
			touser : touser,
			msgtype : 'video',
			video : {
				media_id : media_id,
				title : title,
				description : description
			}
		}
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.send_music = function(token, touser, musicurl, thumb_media_id, hqmusicurl,
		title, description, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/message/custom/send',
		qs : {
			access_token : token
		},
		json : {
			touser : touser,
			msgtype : 'music',
			music : {
				musicurl : musicurl,
				thumb_media_id : thumb_media_id,
				hqmusicurl : hqmusicurl || musicurl,
				title : title,
				description : description
			}
		}
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.send_news = function(token, touser, articles, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/message/custom/send',
		qs : {
			access_token : token
		},
		json : {
			touser : touser,
			msgtype : 'news',
			news : {
				articles : articles || []
			}
		}
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.user_get = function(token, next_openid, callback) {
	var options = {
		method : 'GET',
		uri : 'https://api.Api.qq.com/cgi-bin/user/get',
		qs : {
			access_token : token,
			next_openid : next_openid
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.user_info = function(token, openid, callback) {
	var options = {
		method : 'GET',
		uri : 'https://api.Api.qq.com/cgi-bin/user/info',
		qs : {
			access_token : token,
			openid : openid
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.groups_get = function(token, callback) {
	var options = {
		method : 'GET',
		uri : 'https://api.Api.qq.com/cgi-bin/groups/get',
		qs : {
			access_token : token
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.groups_create = function(token, name, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/groups/create',
		qs : {
			access_token : token
		},
		json : {
			group : {
				name : name
			}
		}
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.groups_update = function(token, id, name, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/groups/update',
		qs : {
			access_token : token
		},
		json : {
			group : {
				id : id,
				name : name
			}
		}
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.groups_members_update = function(token, openid, to_groupid, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/groups/members/update',
		qs : {
			access_token : token
		},
		json : {
			openid : openid,
			to_groupid : to_groupid
		}
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.groups_getid = function(token, openid, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.Api.qq.com/cgi-bin/groups/getid',
		qs : {
			access_token : token
		},
		json : {
			openid : openid
		}
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.menu_create = function(token, buttons, callback) {
	var options = {
		method : 'POST',
		uri : ' https://api.Api.qq.com/cgi-bin/menu/create',
		qs : {
			access_token : token
		},
		json : {
			button : buttons
		}
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.menu_get = function(token, callback) {
	var options = {
		method : 'GET',
		uri : ' https://api.Api.qq.com/cgi-bin/menu/get',
		qs : {
			access_token : token
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.menu_delete = function(token, callback) {
	var options = {
		method : 'GET',
		uri : ' https://api.Api.qq.com/cgi-bin/menu/delete',
		qs : {
			access_token : token
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

Api.qrcode_create = function(token, data, callback) {
	var options = {
		method : 'POST',
		uri : ' https://api.Api.qq.com/cgi-bin/qrcode/create',
		qs : {
			access_token : token
		},
		json : data
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});

};

Api.showqrcode = function(ticket, callback) {
	var options = {
		method : 'GET',
		uri : ' https://mp.Api.qq.com/cgi-bin/showqrcode',
		qs : {
			ticket : ticket
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = b.errcode ? b : null;
		callback(err, b);
	});
};

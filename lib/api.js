var request = require('request'), sha1 = require('crypto').createHash('sha1'), xml2js = require('xml2js'), fs = require('fs');

/*
 * 
 */
var Api = module.exports = function Api() {

};

Api.checkSignature = function(token, signature, timestamp, nonce, callback) {
	var array = [ token, timestamp, nonce ];
	array.sort();
	var pass = (signature == sha1.update(array.join("")).digest('hex'));
	callback && callback(pass);
}

Api.packMsg = function(msg) {
	var time = Math.round(new Date().getTime() / 1000);

	var output = "<xml>" + "<ToUserName><![CDATA[" + msg.ToUserName
			+ "]]></ToUserName>" + "<FromUserName><![CDATA[" + msg.FromUserName
			+ "]]></FromUserName>" + "<CreateTime>" + time + "</CreateTime>"
			+ "<MsgType><![CDATA[" + msg.MsgType + "]]></MsgType>";

	switch (msg.MsgType) {
	case 'text':
		output += "<Content><![CDATA[" + msg.Content + "]]></Content>";
		break;
	case 'image':
		output += "<Image><MediaId><![CDATA[" + msg.MediaId
				+ "]]></MediaId></Image>";
		break;
	case 'voice':
		output += "<Voice><MediaId><![CDATA[" + msg.MediaId
				+ "]]></MediaId></Voice>";
		break;
	case 'video':
		output += "<Video><MediaId><![CDATA[" + msg.MediaId
				+ "]]></MediaId><Title><![CDATA[" + msg.Title
				+ "]]></Title><Description><![CDATA[" + msg.Description
				+ "]]></Description></Video>";
		break;
	case 'music':
		output += "<Music><Title><![CDATA[" + msg.Title
				+ "]]></Title><Description><![CDATA[" + msg.Description
				+ "]]></Description><MusicUrl><![CDATA[" + msg.MusicUrl
				+ "]]></MusicUrl><HQMusicUrl><![CDATA[" + msg.HQMusicUrl
				+ "]]></HQMusicUrl><ThumbMediaId><![CDATA[" + msg.ThumbMediaId
				+ "]]></ThumbMediaId></Music>";
		break;
	case 'news':
		output += "<ArticleCount>" + msg.Articles.length
				+ "</ArticleCount><Articles>";

		msg.Articles.forEach(function(item) {
			output += "<item><Title><![CDATA[" + item.Title
					+ "]]></Title><Description><![CDATA[" + item.Description
					+ "]]></Description><PicUrl><![CDATA[" + item.PicUrl
					+ "]]></PicUrl><Url><![CDATA[" + item.Url
					+ "]]></Url></item>";
		});

		output += "</Articles>";
		break;
	}

	output += "</xml>";

	return output;
}

/*
 * 
 */
Api.access_token = function(appid, secret, callback) {
	var options = {
		method : 'GET',
		uri : 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
		qs : {
			appid : appid,
			secret : secret
		},
		json : true
	};
	request(options, function(e, r, b) {
		if (!e && b.access_token) {
			callback && callback(null, b.access_token);
		} else {
			var err = e ? e : b.errcode ? b : null;
			callback && callback(err, null);
		}
	});
};

Api.media_upload = function(token, type, path, callback) {
	var options = {
		method : 'POST',
		uri : 'http://file.api.weixin.qq.com/cgi-bin/media/upload',
		qs : {
			access_token : token,
			type : type
		},
		json : true
	};

	var r = request(options, function(e, r, b) {
		console.log(e? e: r.request.headers);
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
	var form = r.form();
	form.append('media', fs.createReadStream(path));
};

Api.media_get = function(token, media_id, callback) {
	var options = {
			method: 'GET',
			uri: 'http://file.api.weixin.qq.com/cgi-bin/media/get',
			qs: {
				access_token : token,
				media_id: media_id
			}
	};
	
	request(options, function(e, r, b){console.log(b);
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.send_text = function(token, touser, content, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/message/custom/send',
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.send_image = function(token, touser, media_id, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/message/custom/send',
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.send_voice = function(token, touser, media_id, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/message/custom/send',
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.send_video = function(token, touser, media_id, title, description, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/message/custom/send',
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.send_music = function(token, touser, musicurl, thumb_media_id, hqmusicurl,
		title, description, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/message/custom/send',
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.send_news = function(token, touser, articles, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/message/custom/send',
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.user_get = function(token, next_openid, callback) {
	var options = {
		method : 'GET',
		uri : 'https://api.qq.com/cgi-bin/user/get',
		qs : {
			access_token : token,
			next_openid : next_openid
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.user_info = function(token, openid, callback) {
	var options = {
		method : 'GET',
		uri : 'https://api.qq.com/cgi-bin/user/info',
		qs : {
			access_token : token,
			openid : openid
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.groups_get = function(token, callback) {
	var options = {
		method : 'GET',
		uri : 'https://api.qq.com/cgi-bin/groups/get',
		qs : {
			access_token : token
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.groups_create = function(token, name, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/groups/create',
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.groups_update = function(token, id, name, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/groups/update',
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.groups_members_update = function(token, openid, to_groupid, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/groups/members/update',
		qs : {
			access_token : token
		},
		json : {
			openid : openid,
			to_groupid : to_groupid
		}
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.groups_getid = function(token, openid, callback) {
	var options = {
		method : 'POST',
		uri : 'https://api.qq.com/cgi-bin/groups/getid',
		qs : {
			access_token : token
		},
		json : {
			openid : openid
		}
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.menu_create = function(token, buttons, callback) {
	var options = {
		method : 'POST',
		uri : ' https://api.qq.com/cgi-bin/menu/create',
		qs : {
			access_token : token
		},
		json : {
			button : buttons
		}
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.menu_get = function(token, callback) {
	var options = {
		method : 'GET',
		uri : ' https://api.qq.com/cgi-bin/menu/get',
		qs : {
			access_token : token
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.menu_delete = function(token, callback) {
	var options = {
		method : 'GET',
		uri : ' https://api.qq.com/cgi-bin/menu/delete',
		qs : {
			access_token : token
		},
		json : true
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

Api.qrcode_create = function(token, data, callback) {
	var options = {
		method : 'POST',
		uri : ' https://api.qq.com/cgi-bin/qrcode/create',
		qs : {
			access_token : token
		},
		json : data
	};
	request(options, function(e, r, b) {
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
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
		var err = e ? e : b.errcode ? b : null;
		callback && callback(err, b);
	});
};

var getBody = require('raw-body');
var xml2js = require('xml2js');

exports = module.exports = function msgParser(options) {
	options = options || {};

	return function msgParser(req, res, next) {
		if (req._msg) {
			return next();
		}

		req.msg = req.msg || {};

		// flag as parsed
		req._msg = true;

		// parse
		getBody(req, {
			limit : options.limit || '1mb',
			length : req.headers['content-length'],
			encoding : 'utf8'
		}, function(err, buf) {
			if (err) {
				return next(err);
			}

			xml2js.parseString(buf, function(err, json) {
				if (err) {
					err.msg = buf;
					return next(err);
				}

				var msg = json.xml;
				Object.keys(msg).forEach(function(k) {
					msg[k] = msg[k][0];
				});

				req.msg = msg;

				next();
			});
		})
	};
};
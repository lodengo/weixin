var api = require('../api')

exports = module.exports = function checkSignature(options) {
	options = options || {};

	return function checkSignature(req, res, next) {
		var signature = req.query.signature;
		var timestamp = req.query.timestamp;
		var nonce = req.query.nonce;
		var token = options.token;

		api.checkSignature(token, signature, timestamp, nonce, function(pass) {
			if (pass) {
				if (req.route.method == 'get') {
					res.send(req.query.echostr);
				} else {
					next();
				}
			} else {
				var err = 'checkSignature fail';
				next(err);
			}
		})
	}
}
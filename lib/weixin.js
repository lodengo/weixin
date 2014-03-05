var EventEmitter = require('events').EventEmitter
, path = require('path')
, basename = path.basename
, fs = require('fs');


/**
 * Auto-load bundled middleware with getters.
 */
fs.readdirSync(__dirname + '/middleware').forEach(function(filename) {
	if (!/\.js$/.test(filename))
		return;
	var name = basename(filename, '.js');
	function load() {
		return require('./middleware/' + name);
	}
	
	exports.__defineGetter__(name, load);
});
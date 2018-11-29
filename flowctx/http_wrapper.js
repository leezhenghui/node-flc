const http = require('http');
const cm = require('./cm');

const origHTTPSVREmit = http.Server.prototype.emit;

http.Server.prototype.emit = function(event) {
	if ('request' === event) {
		// initial context at the beginning of inbound entry, 
		// e.g: HTTP server receive a new incoming call
		cm.initContext();
	}

	origHTTPSVREmit.apply(this, arguments);
}

module.exports = exports = http;

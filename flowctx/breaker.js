const AsyncHooks = require('async_hooks');

class AsyncContextBreaker extends AsyncHooks.AsyncResource {
	constructor() {
		super('AsyncContextBreaker');
		this.count = 0;
	}

	action(callback) {
		setTimeout(() => {
			this.emitBefore();
			callback(null, ++this.count);
			this.emitAfter();
		}, 500);
	}

	close() {
		this.count = 0;
		this.emitDestroy();
	};
}

module.exports = exports = AsyncContextBreaker;

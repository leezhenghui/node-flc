const AsyncHooks = require('async_hooks');

class AsyncContextBreaker extends AsyncHooks.AsyncResource {
	constructor() {
		super('AsyncContextBreaker');
		this.count = 0;
	}

	action(callback) {
		const self = this;
		setTimeout(() => {
			self.runInAsyncScope(callback, null, self.count);
		}, 500);
	}

	close() {
		this.count = 0;
		this.emitDestroy();
	};
}

module.exports = exports = AsyncContextBreaker;

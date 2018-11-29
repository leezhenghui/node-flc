/**
 * In many cases, we want to propagate a end2end context following the invocation flow. Just like the threadlocal in Java. This is really helpful to enable the security subject, transaction status and distributed tracing features.
 *
 * @author leezhenghui@gmail.com 
 */

const debug = require('debug')('context');
const AsyncHooks = require('async_hooks');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const util = require('util');

// singleton context manager
const cm = (function() {

	//================================
	//  Private variables definitions
	//================================
	const contextSlots = new Map();

	function debug_sync(...args) {
		// fs.writeSync(process.stdout.fd, `${util.format(...args)}\n`);
	}

	class AsyncHookCallback {
		constructor() {}

    init(asyncId, type, triggerAsyncId, resource) {
			debug_sync('AsyncHook [init]: ', asyncId, type, triggerAsyncId, resource);

			const pCS = contextSlots.get(triggerAsyncId);
			if (pCS) {
				debug_sync('AsyncHook [init] propagate context from parent  "' + triggerAsyncId + '" to current "' + asyncId + '"' );
		    contextSlots.set(asyncId, pCS);	
			}
		}

		destroy(asyncId) {
			debug_sync('AsyncHook [destory]: ', asyncId);
			contextSlots.delete(asyncId);
		}
	}

	const ak = AsyncHooks.createHook(new AsyncHookCallback()); 

	class Context {
     constructor() {
			 this.uuid = uuidv4();
		 }	
	}

	class ContextManager {

		initContext() {
			const self = this;
			if (self.getContext()) {
				const err = new Error('Context was attached to current invocation flow!');
				debug('Error: ', err);
				throw err;
			}

			contextSlots.set(AsyncHooks.executionAsyncId(), new Context());	
		}

		getContext() {
	    return contextSlots.get(AsyncHooks.executionAsyncId());	
		}

		dump() {
		 const self = this;
	   return JSON.stringify({
		    uuid: self.uuid,
			 context: self.getContext()
		 });	
		}
	}

	ak.enable();

	return new ContextManager();
})(); 

module.exports = exports = cm;

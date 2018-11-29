const debug = require('debug')('router');

const express = require('express');
const bodyParser = require('body-parser')
const router = express.Router();
const Q = require('q');

const PolicyRouter = require('express-policyrouter').PolicyRouter;
const policyRouter = new PolicyRouter(router);
const cm = require('../flowctx/cm');

//====================================
//   Policy Handlers Registraiton
//====================================
const SimpleLogger = require('./policies/logger')
policyRouter.register(new SimpleLogger())

const HealthChecker = require('express-policyrouter').HealthChecker;
policyRouter.register(new HealthChecker('/health/state'));

//====================================
//   Routers Registraiton
//====================================
policyRouter.use('/', bodyParser.json(), {
  name: 'httpSetting.bodyParser.json'
});

policyRouter.get('/health/state', function(req, res, next) {
	// do nothing
}, {
  name: 'health-checker-placeholder'
});

async function doSomethingAsync() {
  const deferred = Q.defer(); 
  setTimeout(function() {
    console.log('      >>> [Propagated Context]: ', cm.getContext().uuid);	
		deferred.resolve();
	}, 1000);	

	return deferred.promise;
}

policyRouter.get('/test/ctx/propagation', async function(req, res, next) {
	console.log('      >>> [Initialed Context]: ', cm.getContext().uuid);
	await doSomethingAsync();
  res.status(200).send('done' );
}, {
  name: 'test-context-propagation'
});

module.exports = router;

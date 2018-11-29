## The Investigation Playground for Invocation Flow Context Propagation via Async\_HOOK

This is just a investigation project to seek for a stable solution for context progation in node.js. 


### Run the sample

- Clone the project

```bash
git clone git@github.com:leezhenghui/node-flc.git
```

- Run the sample

```bash
npm install
npm run start
curl http://localhost:8080/test/ctx/propagation
```

```
router:policy:logger [HTTP-Entry] resource-path: </test/ctx/propagation>; method: <GET>; headers: <{"user-agent":"curl/7.35.0","host":"localhost:8080","accept":"*/*"}> @2018-11-29T05:34:51.962Z +0ms
router:policy:logger [Entry] resource-path: </test/ctx/propagation>; protocol: <http>; method: <GET>; user: <->; middleware-fn: <httpSetting.bodyParser.json> @2018-11-29T05:34:51.964Z +2ms
body-parser:json skip empty body +0ms
router:policy:logger [Exit] resource-path: </test/ctx/propagation>; protocol: <http>; method: <GET>; statusCode: <200>; user: <->; middleware-fn: <httpSetting.bodyParser.json> @2018-11-29T05:34:51.966Z +2ms
policyrouter The res.end has been wrapped, no need to wrap it! +1s
router:policy:logger [Entry] resource-path: </test/ctx/propagation>; protocol: <http>; method: <GET>; user: <->; middleware-fn: <test-context-propagation> @2018-11-29T05:34:51.967Z +1ms
>>> [Initialed Context]:  633f1af1-d6d6-4f52-8372-8fca6cb7cf14
>>> [Propagated Context]:  633f1af1-d6d6-4f52-8372-8fca6cb7cf14
router:policy:logger [Exit] resource-path: </test/ctx/propagation>; protocol: <http>; method: <GET>; statusCode: <200>; user: <->; middleware-fn: <test-context-propagation> @2018-11-29T05:34:52.974Z +1s
router:policy:logger [HTTP-Exit] resource-path: </test/ctx/propagation>; method: <GET>; statusCode: <200>; headers: <{"user-agent":"curl/7.35.0","host":"localhost:8080","accept":"*/*"}>; user: <-> @2018-11-29T05:34:52.975Z +1ms
```

If we have a async-resource used in the across-invocation-flow situation , the context propagation will be broken then:

```
curl http://localhost:8080/test/ctx/breaker
```

```
router:policy:logger [HTTP-Entry] resource-path: </test/ctx/breaker>; method: <GET>; headers: <{"user-agent":"curl/7.35.0","host":"localhost:8080","accept":"*/*"}> @2018-11-29T07:27:02.203Z +4s
router:policy:logger [Entry] resource-path: </test/ctx/breaker>; protocol: <http>; method: <GET>; user: <->; middleware-fn: <httpSetting.bodyParser.json> @2018-11-29T07:27:02.203Z +0ms
body-parser:json skip empty body +4s
router:policy:logger [Exit] resource-path: </test/ctx/breaker>; protocol: <http>; method: <GET>; statusCode: <200>; user: <->; middleware-fn: <httpSetting.bodyParser.json> @2018-11-29T07:27:02.203Z +0ms
policyrouter The res.end has been wrapped, no need to wrap it! +4s
router:policy:logger [Entry] resource-path: </test/ctx/breaker>; protocol: <http>; method: <GET>; user: <->; middleware-fn: <test-context-breaker> @2018-11-29T07:27:02.203Z +0ms
>>> [Initialed Context]:  a91b0c73-63ef-4c2b-a027-8372754282a3
>>> [Propagated Context]:  5774fd81-04e0-4de4-8843-8efc2909df04
router:policy:logger [Exit] resource-path: </test/ctx/breaker>; protocol: <http>; method: <GET>; statusCode: <200>; user: <->; middleware-fn: <test-context-breaker> @2018-11-29T07:27:02.705Z +502ms
router:policy:logger [HTTP-Exit] resource-path: </test/ctx/breaker>; method: <GET>; statusCode: <200>; headers: <{"user-agent":"curl/7.35.0","host":"localhost:8080","accept":"*/*"}>; user: <-> @2018-11-29T07:27:02.705Z +0ms
```

> Please keep in mind, the events provided by Async\_Hook is based on async resource lifecycle. 
>
> Some insights from [Strongloop](https://strongloop.com/strongblog/context-propagation-in-loopback/)
> "There is no official and standard way for modules to tell AsyncWrap/CLS when and how to correctly restore the continuation context, As a result, any module that implements a custom task queue or a connection pool is prone to break context storage. "

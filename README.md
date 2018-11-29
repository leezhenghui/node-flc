## Invocation Flow Context Propagation via Async\_HOOK

### Run the sample

- Clone the project

```bash
git clone git@github.com:leezhenghui/node-flowcontext-prototype.git
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


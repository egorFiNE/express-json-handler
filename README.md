# express-json-handler

Simply return objects from your route handler functions in express.

Instead of:

```javascript
app.post('/auth/', (req, res) => {
  res.json({ success: false });
});
```

do:

```javascript
const JSONHandler = require('express-json-handler');

app.post('/auth/', JSONHandler(async (req, res) {
  return { success: false };
}));
```

## Benefits?

* `return` instead of `res.json()`
* `async` functions properly handled
* errors properly delivered in JSON responses
* browser cache disabled

# Async functions handled and errors catched

express-json-handler properly supports async functions in Express 4. This won't work as expected in Express 4:

```javascript
app.post('/auth/', async (req, res) {
  non_existing();
});
```

express-json-handler catches errors on your async handler and in that case `{ success: false }` is returned. You can change the default reply:

```javascript
const JSONHandler = require('express-json-handler');

JSONHandler.DEFAULT_FAIL_RESPONSE = {
  message: "Internal server error"
};

app.post('/auth/', JSONHandler(async (req, res) {
  non_existing();
}));
```

# Direct responses

You can still send direct responses from your handler code, either with `res.send()` or even `res.json()` if you like. Return nothing or null from your handler in case you do.

# Caching of responses

By default express-json-handler sends cache disabling headers in responses, namely:

```
Cache-Control: private, max-age=0, no-cache, must-revalidate
Pragma: no-cache
```

You can change that behavior:

```javascript
const JSONHandler = require('JSONHandler');

JSONHandler.DEFAULT_HEADERS = {
  'Cache-Control': 'max-age=3600'
};
```

# Development and maintenance

Tests: `npm run test` or `mocha test.js`.

Liner: `npm run lint` or `eslint index.js`.

# Footer

Author: Egor Egorov me@egorfine.com.<br>
License: MIT
